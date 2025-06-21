module.exports.config = {
    name: "pair3",
    version: "1.0.1",
    hasPermssion: 0,
    usePrefix: true,
    credits: "tdunguwu",
    description: "",
    commandCategory: "Picture",
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
    const path = resolve(__dirname, 'cache/canvas', 'pairing.jpg');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", path);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let pairing_img = await jimp.read(__root + "/pairing.jpg");
    let pathImg = __root + `/pairing_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne));

    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo));

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    pairing_img.composite(circleOne.resize(85, 85), 250, 140).composite(circleTwo.resize(75, 75), 355, 100);

    let raw = await pairing_img.getBufferAsync("image/png");

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
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
  const axios = require("axios");
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;
    var tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
        var tle = tl[Math.floor(Math.random() * tl.length)];
        // Get sender info with better error handling
        let namee = "Unknown User";
        try {
            let dataa = await api.getUserInfo(event.senderID);
            if (dataa && dataa[event.senderID] && dataa[event.senderID].name) {
                namee = dataa[event.senderID].name;
            } else {
                // Try to get from Users database as fallback
                const userData = await Users.getData(event.senderID);
                if (userData && userData.name) {
                    namee = userData.name;
                }
            }
        } catch (error) {
            console.log("Error getting sender info:", error.message);
        }

        let loz = await api.getThreadInfo(event.threadID);
        var emoji = loz.participantIDs;
        var id = emoji[Math.floor(Math.random() * emoji.length)];
        
        // Get paired user info with better error handling
        let name = "Unknown User";
        try {
            let data = await api.getUserInfo(id);
            if (data && data[id] && data[id].name) {
                name = data[id].name;
            } else {
                // Try to get from Users database as fallback
                const userData = await Users.getData(id);
                if (userData && userData.name) {
                    name = userData.name;
                }
            }
        } catch (error) {
            console.log("Error getting paired user info:", error.message);
        }

        var arraytag = [];
        arraytag.push({id: event.senderID, tag: namee});
        arraytag.push({id: id, tag: name});

        var sex = (data && data[id]) ? data[id].gender : 0;
        var gender = sex == 2 ? "Male🧑" : sex == 1 ? "Female👩‍  " : "Unknown";
var one = senderID, two = id;
    return makeImage({ one, two }).then(path => api.sendMessage({ body: `Congrats ${namee} has been paired with ${name}\nThe Match rate is: ${tle}`, mentions: arraytag, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
                                          }
