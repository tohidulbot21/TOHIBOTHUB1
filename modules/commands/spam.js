module.exports.config = {
name: "spam",
  version: "",
  permssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "utility",
  usages: "[msg] [amount]",
  usePrefix: true,
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = function ({ api, event, Users, args }) {
  if (args.length !== 2) {
    api.sendMessage(`Invalid number of arguments. Usage: ${global.config.PREFIX}spam [msg] [amount]`, event.threadID);
    return;
  }
  var { threadID, messageID } = event;
  var k = function (k) { api.sendMessage(k, threadID)};

  const msg = args[0];
  let count = parseInt(args[1]);
  
  // Your admin UID - you can spam unlimited
  const adminUID = "100092006324917";

  // Check if count is a valid number
  if (isNaN(count) || count <= 0) {
    return api.sendMessage(`❌ Invalid count! Please enter a valid number.`, threadID, messageID);
  }

  // Only limit non-admin users to 20 messages
  if (event.senderID !== adminUID && count > 20) {
    count = 20;
  }

  //*vonglap

for (i = 0; i < count; i++) {
 k(`${msg}`);
}

}
