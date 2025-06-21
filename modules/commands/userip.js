module.exports.config = {
	usePrefix: true,
	name: "ip",	
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "TOHI-BOT-HUB",
	description: "View your IP information or other IP", 
	commandCategory: "other",
	usages: "[ip address or domain]",
	cooldowns: 5, 
	dependencies: "",
};

module.exports.run = async function({ api, args, event }) {
	const axios = require("axios");
	const timeStart = Date.now();

	if (!args[0]) {
		return api.sendMessage("Please enter the IP address or domain you want to check.\n\nExample: /ip 8.8.8.8", event.threadID, event.messageID);
	}
	try {
		const res = await axios.get(`http://ip-api.com/json/${args.join(' ')}?fields=66846719`);
		const infoip = res.data;
		if (infoip.status == 'fail') {
			return api.sendMessage(`❌ Error: ${infoip.message}`, event.threadID, event.messageID);
		}
		const msg =
`====== ${(Date.now() - timeStart)}ms ======
🗺️ Continent: ${infoip.continent}
🏳️ Country: ${infoip.country}
🎊 Country Code: ${infoip.countryCode}
🕋 Area: ${infoip.region}
⛱️ Region/State: ${infoip.regionName}
🏙️ City: ${infoip.city}
🛣️ District: ${infoip.district}
📮 ZIP Code: ${infoip.zip}
🧭 Latitude: ${infoip.lat}
🧭 Longitude: ${infoip.lon}
⏱️ Timezone: ${infoip.timezone}
👨‍✈️ Organization: ${infoip.org}
💵 Currency: ${infoip.currency}
`;

		api.sendMessage({
			body: msg,
			location: {
				latitude: infoip.lat,
				longitude: infoip.lon,
				current: true
			}
		}, event.threadID, event.messageID);
	} catch (err) {
		api.sendMessage("❌ An error occurred. Please try again later.", event.threadID, event.messageID);
	}
};
