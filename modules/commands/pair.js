
module.exports.config = {
  name: "pair",
  version: "1.0.1",
  permssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "fun",
  cooldowns: 5,
  dependencies: {
        "axios": "",
        "fs-extra": ""
    }
}

module.exports.onLoad = async() => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'pair_bg.jpg');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg", path);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const Jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache", "canvas");

    let pair_img = await Jimp.read(__root + "/pair_bg.jpg");
    let pathImg = __root + `/pair_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne));

    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo));

    let circleOne = await Jimp.read(await circle(avatarOne));
    let circleTwo = await Jimp.read(await circle(avatarTwo));
    pair_img.composite(circleOne.resize(330, 330), 111, 175).composite(circleTwo.resize(330, 330), 1018, 173);

    let raw = await pair_img.getBufferAsync(Jimp.MIME_PNG);

    fs.writeFileSync(pathImg, raw);
    
    // Check if files exist before deleting them
    if (fs.existsSync(avatarOne)) {
        fs.unlinkSync(avatarOne);
    }
    if (fs.existsSync(avatarTwo)) {
        fs.unlinkSync(avatarTwo);
    }

    return pathImg;
}

async function circle(image) {
    const Jimp = require("jimp");
    image = await Jimp.read(image);
    image.circle();
    return await image.getBufferAsync(Jimp.MIME_PNG);
}

// Helper function to get user name
async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo && userInfo[userID] ? userInfo[userID].name : "Unknown User";
  } catch (error) {
    return "Unknown User";
  }
}

module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;
    
    try {
        var id1 = event.senderID;
        // Get user name with proper error handling
        let name1;
        try {
            let dataa = await api.getUserInfo(event.senderID);
            if (dataa && dataa[event.senderID] && dataa[event.senderID].name) {
                name1 = dataa[event.senderID].name;
            } else {
                // Try to get from Users database as fallback
                const userData = await Users.getData(event.senderID);
                if (userData && userData.name) {
                    name1 = userData.name;
                }
            }
        } catch (error) {
            console.log("Error getting sender info:", error.message);
            name1 = "Unknown User";
        }

        if (!name1) {
            return api.sendMessage(
                "❌ Unable to retrieve your user information. Please try again.",
                event.threadID,
                event.messageID
            );
        }

        var ThreadInfo = await api.getThreadInfo(event.threadID);

        if (!ThreadInfo || !ThreadInfo.userInfo || ThreadInfo.userInfo.length < 2) {
            return api.sendMessage(
                "❌ Unable to retrieve group information or not enough members for pairing.",
                event.threadID,
                event.messageID
            );
        }

        var all = ThreadInfo.userInfo;
        for (let c of all) {
            if (c.id == id1) var gender1 = c.gender;
        }
        const botID = api.getCurrentUserID();
        let ungvien = [];
        if (gender1 == "FEMALE") {
            for (let u of all) {
                if (u.gender == "MALE") {
                    if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
                }
            }
        } else if (gender1 == "MALE") {
            for (let u of all) {
                if (u.gender == "FEMALE") {
                    if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
                }
            }
        } else {
            for (let u of all) {
                if (u.id !== id1 && u.id !== botID) ungvien.push(u.id);
            }
        }
        if (ungvien.length === 0) {
            return api.sendMessage(
                "❌ No suitable pairing candidates found in this group!",
                event.threadID,
                event.messageID
            );
        }

        var id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
        // Get paired user name with proper error handling
        let name2;
        try {
            let data = await api.getUserInfo(id2);
            if (data && data[id2] && data[id2].name) {
                name2 = data[id2].name;
            } else {
                // Try to get from Users database as fallback
                const userData = await Users.getData(id2);
                if (userData && userData.name) {
                    name2 = userData.name;
                }
            }
        } catch (error) {
            console.log("Error getting paired user info:", error.message);
            name2 = "Unknown User";
        }

        if (!name2) {
            return api.sendMessage(
                "❌ Unable to retrieve pairing candidate information. Please try again.",
                event.threadID,
                event.messageID
            );
        }

        var rd1 = Math.floor(Math.random() * 100) + 1;
        var cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
        var rd2 = cc[Math.floor(Math.random() * cc.length)];
        var djtme = [
            `${rd1}`,
            `${rd1}`,
            `${rd1}`,
            `${rd1}`,
            `${rd1}`,
            `${rd2}`,
            `${rd1}`,
            `${rd1}`,
            `${rd1}`,
            `${rd1}`,
        ];

        var tile = djtme[Math.floor(Math.random() * djtme.length)];

        var arraytag = [];
        arraytag.push({id: event.senderID, tag: name1});
        arraytag.push({id: id2, tag: name2});

        var one = senderID, two = id2;
        return makeImage({ one, two }).then(path => api.sendMessage({ 
            body: `『💗』Congratulations ${name1}『💗』\n『❤️』Looks like your destiny brought you together with ${name2}『❤️』\n『🔗』Your link percentage is ${tile}%『🔗』`, 
            mentions: arraytag, 
            attachment: fs.createReadStream(path) 
        }, threadID, () => fs.unlinkSync(path), messageID));

    } catch (error) {
        console.error("Error in pair command:", error);
        return api.sendMessage(
            "❌ An error occurred while processing the pair command. Please try again later.",
            event.threadID,
            event.messageID
        );
    }
}
