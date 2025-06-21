const axios = require("axios");
const fs = require("fs-extra");
const tinyurl = require("tinyurl");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
    );
    return base.data.api;
};

module.exports.config = {
    name: "autodl",
    version: "1.0.3",
    permission: 0,
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "Download videos or images from social media links.",
    commandCategory: "Media",
    usages: "Reply with a valid video/image URL (Facebook, TikTok, Instagram, YouTube, Pinterest, Imgur)",
    cooldowns: 2,
    dependencies: {
        axios: "",
        "fs-extra": "",
        tinyurl: ""
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const content = event.body ? event.body : "";
        if (!content) return;

        const supportedPlatforms = [
            "https://vt.tiktok.com",
            "https://vm.tiktok.com",
            "https://www.facebook.com",
            "https://fb.watch",
            "https://www.instagram.com/",
            "https://www.instagram.com/p/",
            "https://youtu.be/",
            "https://pin.it/",
            "https://youtube.com/",
            "https://i.imgur.com"
        ];

        if (!supportedPlatforms.some(platform => content.startsWith(platform))) return;

        api.setMessageReaction("🔎", event.messageID, (err) => {}, true);

        let ex, cp, path, shortUrl;

        if (content.startsWith("https://i.imgur.com")) {
            const ext = content.substring(content.lastIndexOf("."));
            path = __dirname + `/cache/dipto${ext}`;
            const response = await axios.get(content, { responseType: "arraybuffer" });
            fs.writeFileSync(path, Buffer.from(response.data, "binary"));

            await api.sendMessage({
                body: `╔═══════✨ 𝗜𝗺𝗮𝗴𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 ✨═══════╗
                       📷 Downloaded from Imgur! 🌟
                       ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
                attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path), event.messageID);

            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            return;
        }

        const aa = await axios.get(
            `${await baseApiUrl()}/alldl?url=${encodeURIComponent(content)}`
        );
        const bb = aa.data;

        if (!bb.result) {
            api.setMessageReaction("❌", event.messageID, (err) => {}, true);
            return api.sendMessage(
                `╔═══════🚫 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗙𝗮𝗶𝗹𝗲𝗱 🚫═══════╗
                       ⚠ Failed to fetch media data! 😔
                       🔄 Please check the URL and try again.
                       ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
                event.threadID, event.messageID
            );
        }

        shortUrl = await tinyurl.shorten(bb.result);

        if (bb.result.includes(".jpg") || bb.result.includes(".png") || bb.result.includes(".jpeg")) {
            ex = bb.result.includes(".jpg") ? ".jpg" : bb.result.includes(".png") ? ".png" : ".jpeg";
            cp = "Here's your Photo! 📸";
        } else {
            ex = ".mp4";
            cp = bb.cp || "Here's your Video! 🎬";
        }

        path = __dirname + `/cache/video${ex}`;
        const vid = (await axios.get(bb.result, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path, Buffer.from(vid, "utf-8"));

        await api.sendMessage({
            body: `╔═══════✨ 𝗠𝗲𝗱𝗶𝗮 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 ✨═══════╗
                   ${cp}
                   🔗 Download URL: ${shortUrl}
                   ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    } catch (error) {
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
        await api.sendMessage(
            `╔═══════🚫 𝗘𝗿𝗿𝗼𝗿 𝗢𝗰𝗰𝘂𝗿𝗿𝗲𝗱 🚫═══════╗
                   ❌ Something went wrong! 😔
                   📝 Error: ${error.message}
                   🔄 Please try again later!
                   ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
            event.threadID, event.messageID
        );
    }
};

module.exports.run = async function ({ api, event }) {
    try {
        return api.sendMessage(
            `╔═══════✨ 𝗔𝘂𝘁𝗼𝗗𝗟 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 ✨═══════╗
                   📋 Usage: Reply with a valid video/image URL (Facebook, TikTok, Instagram, YouTube, Pinterest, Imgur)
                   ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
            event.threadID, event.messageID
        );
    } catch (error) {
        return api.sendMessage(
            `╔═══════🚫 𝗘𝗿�_r𝗢𝗰𝗰𝘂𝗿𝗿𝗲𝗱 🚫═══════╗
                   ❌ Something went wrong! 😔
                   📝 Error: ${error.message}
                   🔄 Please try again later!
                   ╚═══════💫 Crafted by Tohidul 💫═══════╝`,
            event.threadID, event.messageID
        );
    }
};
