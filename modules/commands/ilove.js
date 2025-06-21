const fs = require("fs");
module.exports.config = {
  commandCategory: "fun",
  name: "iloveu",
  version: "2.0.0",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  usePrefix: false,
  category: "user",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body && (event.body.indexOf("I love you")==0 || (event.body.indexOf("i love you")==0 || (event.body.indexOf("I love u")==0 || (event.body.indexOf("I love you")==0))))) {
		var msg = {
				body: "Hmm... TOHIDUL BOSS TOMARE VALOPASE😇😻 :))"
    }
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
