const fs = require("fs");
module.exports = {
  config: {
    name: "😒",
    version: "1.0.1",
    usePrefix: false,
    permssion: 0,
    credits: "TOHI-BOT-HUB",
    description: "Fun",
    commandCategory: "fun",
    usages: "😒",
    cooldowns: 5,
  },

  handleEvent: function({ api, event }) {
    var { threadID, messageID } = event;
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    if (
      body.indexOf(" ") == 0 ||
      body.indexOf("😒") == 0 ||
      body.indexOf("😑") == 0 ||
      body.indexOf("😐") == 0 ||
      body.indexOf("🙄") == 0 ||
      body.indexOf("😶") == 0
    ) {
      var msg = {
        body: "😒 এমন মুখ করে লাভ নাই! একটু হাসো, জীবন সুন্দর! 😊🌸"
      };
      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("😁", event.messageID, (err) => {}, true);
    }
  },

  start: function({ nayan }) {
    // No operation
  }
};
