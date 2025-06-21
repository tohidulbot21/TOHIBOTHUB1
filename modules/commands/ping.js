module.exports.config = {
	name: "ping",
	version: "1.0.4",
	permssion: 0,
	credits: "TOHI-BOT-HUB",
	description: "Tag all members",
  usePrefix: true,
	commandCategory: "group",
	usages: "[Text]",
	cooldowns: 1
};

module.exports.run = async function({ api, event, args }) {
	try {
		const botID = api.getCurrentUserID();
		const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
		var body = (args.length != 0) ? args.join(" ") : "@everyone", mentions = [], index = 0;
		
		for(const idUser of listUserID) {
			body = "‎" + body;
			mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
			index -= 1;
		}

		return api.sendMessage({ body, mentions }, event.threadID, event.messageID);

	}
	catch (e) { return console.log(e); }
}