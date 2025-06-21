module.exports.config = {
	name: "shairi", 
  version: "1.0.0", 
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "Random shairi video",
  usePrefix: true,
  commandCategory: "Media", 
  usages: "", 
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":""
  }
};

const videoDATA = "https://5025dd35-d3b6-4e53-8f7e-b40e5488f9dc-00-2xr6zjnwy871b.global.replit.dev/video/shairi";

module.exports.onLoad = ({}) => {
  const fs = require('fs');
  if (!fs.existsSync(__dirname + '/nayan')) {
    fs.mkdirSync(__dirname + '/nayan');
  }
  fs.readdirSync(__dirname + '/nayan').forEach(file => {
    fs.unlinkSync(__dirname + `/nayan/${file}`);
  })
}

module.exports.run = async ({ api, event }) => {
  global.nodemodule["axios"]
    .get(videoDATA)
    .then(res => {
      global.nodemodule["axios"]
        .get(encodeURI(res.data.data), { responseType: "arraybuffer" })
        .then(ress => {
          let path = __dirname + `/nayan/${Date.now()}.mp4`;
          global.nodemodule["fs"].writeFileSync(path, Buffer.from(ress.data, 'utf-8'));
          api.sendMessage({
            body: "☆《SHAIRI》☆",
            attachment: global.nodemodule["fs"].createReadStream(path)
          }, event.threadID, () => global.nodemodule["fs"].unlinkSync(path), event.messageID);
          return;
        })
        .catch(e => {
          api.sendMessage("Something went wrong...", event.threadID, event.messageID);
          return;
        });
    })
  .catch(e => {
    api.sendMessage("Something went wrong...", event.threadID, event.messageID);
    return;
  });

  return;
}