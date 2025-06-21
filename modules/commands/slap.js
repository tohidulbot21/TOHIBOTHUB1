module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Slap the friend tag",
  commandCategory: "general",
  usages: "slap [Tag someone you want to slap]",
  cooldowns: 5,
};


module.exports.run = async ({ api, event, args }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  
  // Protected UIDs - Add your UID here
  const PROTECTED_UIDS = ["100092006324917"]; // Add more UIDs if needed
  
  if (!args.join("")) return out("Please tag someone");
  
  // Check if trying to slap a protected user
  const mentionedUID = Object.keys(event.mentions)[0];
  if (mentionedUID && PROTECTED_UIDS.includes(mentionedUID)) {
    return api.sendMessage("😂 হালা তুই বাপ রে slap দিবি? 🤣\n\n🔥 Boss Level Protection Activated! 💪\n\n👑 এই ইউজারকে slap করা যাবে না!\n\n😎 Try করলেও হবে না! 🚫", event.threadID, event.messageID);
  }
  
  return axios.get('https://api.waifu.pics/sfw/slap').then(res => {
        let getURL = res.data.url;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
        var mention = Object.keys(event.mentions)[0];
                  let tag = event.mentions[mention].replace("@", "");    
        
 let callback = function () {
            api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        api.sendMessage({
						        body: "Slapped! " + tag + "\n\n*sorry, i thought there's mosquito*",
                                          mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
						attachment: fs.createReadStream(__dirname + `/cache/slap.${ext}`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/slap.${ext}`), event.messageID)
				};
 //   }
        request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/slap.${ext}`)).on("close", callback);
			})
    .catch(err => {
                     api.sendMessage("Failed to generate gif, be sure that you've tag someone!", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
                  })     
}
