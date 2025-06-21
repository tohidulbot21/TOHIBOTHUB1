
module.exports.config = {
	name: "setmoney",
	version: "1.0.0",
	permission: 2,
	credits: "TOHI-BOT-HUB",
	usePrefix: true,
	description: "Set money for a user (Admin only)",
	commandCategory: "admin",
	usages: "setmoney [amount] @[user] or setmoney [amount] (for yourself)",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"setSuccess": "Đã đặt tiền cho %1 thành %2$",
		"setSelfSuccess": "Đã đặt tiền của bạn thành %1$",
		"setInvalid": "Số tiền không hợp lệ",
		"setUsage": "Sử dụng: setmoney [số tiền] @[người dùng] hoặc setmoney [số tiền] (cho bản thân)",
		"noMention": "Vui lòng tag người dùng cần đặt tiền"
	},
	"en": {
		"setSuccess": "Successfully set %1's money to %2$",
		"setSelfSuccess": "Successfully set your money to %1$",
		"setInvalid": "Invalid amount",
		"setUsage": "Usage: setmoney [amount] @[user] or setmoney [amount] (for yourself)",
		"noMention": "Please mention a user to set money for"
	}
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
	const {
		threadID,
		messageID,
		senderID,
		mentions
	} = event;

	const amount = parseInt(args[0]);
	
	// Validate amount
	if (isNaN(amount) || amount < 0) {
		return api.sendMessage(getText("setInvalid"), threadID, messageID);
	}
	
	// Check if user mentioned someone or setting for themselves
	if (Object.keys(mentions).length === 1) {
		// Setting money for mentioned user
		const targetID = Object.keys(mentions)[0];
		
		// Set the money amount
		await Currencies.setData(targetID, { money: amount });
		
		return api.sendMessage({
			body: getText("setSuccess", mentions[targetID].replace(/\@/g, ""), amount),
			mentions: [{
				tag: mentions[targetID].replace(/\@/g, ""),
				id: targetID
			}]
		}, threadID, messageID);
		
	} else if (Object.keys(mentions).length === 0) {
		// Setting money for themselves
		await Currencies.setData(senderID, { money: amount });
		
		return api.sendMessage(getText("setSelfSuccess", amount), threadID, messageID);
		
	} else {
		// Invalid usage
		return api.sendMessage(getText("setUsage"), threadID, messageID);
	}
};
