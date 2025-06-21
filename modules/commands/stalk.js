// Canvas removed to fix libuuid error
const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "stalk",
    version: "1.0.0",
    hasPermision: 0,
    credits: `Deku & Yan Maglinte`, //Added Canvas Design by Yan
    description: "get info using uid/mention/reply to a message",
    usePrefix: true,
    usages: "[reply/uid/@mention/url]",
    commandCategory: "info",
    cooldowns: 0,
};

const background = "https://i.imgur.com/zQ7JY17.jpg";
const fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download';

module.exports.run = async function({api, event, args, utils, Users, Threads}) {
    try {
        let {
            threadID,
            senderID,
            messageID
        } = event;

        var id;
        if (args.join().indexOf('@') !== -1) {
            id = Object.keys(event.mentions);
        } else if (args[0]) {
            id = args[0];
        } else {
            id = event.senderID;
        }

        if (event.type == "message_reply") {
            id = event.messageReply.senderID;
        } else if (args.join().indexOf(".com/") !== -1) {
            const res = await axios.get(`https://api.reikomods.repl.co/sus/fuid?link=${args.join(" ")}`);
            id = res.data.result;
        }

        let name = (await api.getUserInfo(id))[id].name;
        let username = (await api.getUserInfo(id))[id].vanity === "unknown" ? "Not Found" : id;
        let url = (await api.getUserInfo(id))[id].profileUrl;

        let callback = async function() {
            // Canvas functionality disabled due to system requirements
            return api.sendMessage({
                body: `❍━[INFORMATION]━❍\n\nName: ${name}\nFacebook URL: https://facebook.com/${username}\nUID: ${id}\n\n📝 Note: Image generation temporarily unavailable\n\n❍━━━━━━━━━━━━❍`
            }, event.threadID, event.messageID);
        };

        return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + `/cache/avt.png`))
            .on("close", callback);
    } catch (err) {
        console.log(err);
        return api.sendMessage(`Error`, event.threadID);
    }
};