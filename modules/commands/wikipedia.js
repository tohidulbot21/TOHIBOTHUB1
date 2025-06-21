
const wiki = require("wikijs").default;

module.exports.config = {
	name: "wiki",
	version: "1.0.1",
	permission: 0,
	credits: "TOHI-BOT-HUB",
	usePrefix: true,
	description: "wikipedia search",
	commandCategory: "without prefix",
	usages: "[en] [question]",
	cooldowns: 1,
	dependencies: {
        "wikijs": ""
    }
}

module.exports.languages = {
    "vi": {
        "missingInput": "Nội dung cần tìm kiếm không được để trống!",
        "returnNotFound": "Không tìm thấy nội dung %1"
    },
    "en": {
        "missingInput": "enter what you need to search for.",
        "returnNotFound": "can't find %1"
    }
}

module.exports.run = ({ event, args, api, getText }) => {
    let content = args.join(" ");
    let url = 'https://en.wikipedia.org/w/api.php';
    
    if (args[0] == "en") {
        url = 'https://en.wikipedia.org/w/api.php'; 
        content = args.slice(1, args.length).join(" ");
    }
    
    if (!content) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
    
    return wiki({ apiUrl: url })
        .page(content)
        .catch(() => api.sendMessage(getText("returnNotFound", content), event.threadID, event.messageID))
        .then(page => {
            if (typeof page != 'undefined') {
                return Promise.resolve(page.summary()).then(val => 
                    api.sendMessage(val, event.threadID, event.messageID)
                );
            }
            return '';
        });
}
