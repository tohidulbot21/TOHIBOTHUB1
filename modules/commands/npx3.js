const fs = require("fs");
const request = require("request");
module.exports = {
  config: {
    name: "npx3",
    version: "1.0.1",
    usePrefix: false,
    permssion: 0,
    credits: "TOHI-BOT-HUB",
    description: "Fun",
    commandCategory: "fun",
    usages: "😒",
    cooldowns: 5,
  },

  handleEvent: async function({ api, event, client, __GLOBAL }) {
    try {
      if (!event || !event.body) return;
      
      var { threadID, messageID } = event;
      const content = event.body ? event.body : '';
      const body = content.toLowerCase();
      const NAYAN = ['https://i.imgur.com/LLucP15.mp4', 'https://i.imgur.com/DEBRSER.mp4'];
      var rndm = NAYAN[Math.floor(Math.random() * NAYAN.length)];

      
      const media = await new Promise((resolve, reject) => {
        request.get(
          `${rndm}`,
          { encoding: null },
          (error, response, body) => {
            if (error) {
              reject(error);
            } else {
              resolve(body);
            }
          }
        );
      });

    if (
      body.indexOf("🥰") == 0 ||
      body.indexOf("🤩") == 0 ||
      body.indexOf("😍") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0
    ) {
      var msg = {
        body: "🖤🥀",
        attachment: media,
      };
      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("🖤", event.messageID, (err) => {}, true);
    }
    } catch (error) {
      // Silent fail to prevent console errors
      console.log("npx3 error handled:", error.message);
    }
  },
  start: function({ nayan }) {},
};