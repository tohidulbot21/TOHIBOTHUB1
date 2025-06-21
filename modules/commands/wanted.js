module.exports.config = {
  name: "wanted",
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "tdunguwu",
  description: "use money units like $, €",
  commandCategory: "edit-img",
  usages: "wanted",
  cooldowns: 5,
  dependencies: {"fs-extra": "","discord.js": "","discord-image-generation" :"","node-superfetch": ""}
};

module.exports.run = async ({ event, api, args, Users }) => {
  const DIG = global.nodemodule["discord-image-generation"];
  const Discord = global.nodemodule['discord.js'];
  const request = global.nodemodule["node-superfetch"];
  const fs = global.nodemodule["fs-extra"];
  
  if (this.config.credits != 'tdunguwu') {
        console.log('\x1b[33m[ WARN ]\x1b[37m » Change credits to your mothers dick, bitch:))'+ global.config.BOTNAME + ' đổi credits modules "' + this.config.name + '"');
        return api.sendMessage('[ WARN ] Detect bot operator ' , event.threadID, event.messageID);
      }
      
   let { senderID, threadID, messageID } = event;
   
  // Handle mentions properly
  var id = Object.keys(event.mentions)[0] || event.senderID;
  
  // Filter out mention from args to get currency
  var currency = '$'; // Default currency
  if (args.length > 0) {
    // Remove mention tags from args and join the rest
    var filteredArgs = args.filter(arg => !arg.includes('@'));
    if (filteredArgs.length > 0) {
      var currencyInput = filteredArgs.join(' ').trim();
      // Take only the first character as currency
      if (currencyInput.length > 0) {
        currency = currencyInput.charAt(0);
      }
    }
  }
  
  // Ensure currency is a single character
  if (!currency || currency.length !== 1) {
    currency = '$';
  }
  
  try {
    var avatar = (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

    let img = await new DIG.Wanted().getImage(avatar, currency);
    var path_wanted = __dirname + "/cache/wetd_" + Date.now() + ".png";
    
    if (img && img instanceof Buffer) {
      fs.writeFileSync(path_wanted, img);
      return api.sendMessage({
        body: `🚨 WANTED 🚨\nReward: ${currency}`,
        attachment: fs.createReadStream(path_wanted)
      }, event.threadID, () => fs.unlinkSync(path_wanted), event.messageID);
    } else {
      return api.sendMessage("❌ Failed to generate wanted image", event.threadID, event.messageID);
    }
  } catch (error) {
    console.log("Wanted command error:", error);
    return api.sendMessage("❌ Error occurred while generating wanted poster", event.threadID, event.messageID);
  }
}