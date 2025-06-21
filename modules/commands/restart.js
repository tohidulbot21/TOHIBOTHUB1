module.exports.config = {
	name: "restart",
	version: "7.0.0",
	permission: 2,
	credits: "TOHI-BOT-HUB",
	usePrefix: false,
	description: "restart bot system",
	commandCategory: "admin",
	usages: "",
	cooldowns: 0,
	dependencies: {
		"process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const process = require("process");
  const { threadID, messageID, senderID } = event;
  
  // Check if user is admin (permission level 2)
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ You don't have permission to restart the bot. Only admins can use this command.", threadID, messageID);
  }
  
  api.sendMessage(`🔄 Restarting ${global.config.BOTNAME}... Please wait!`, threadID, () => {
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  });
}
