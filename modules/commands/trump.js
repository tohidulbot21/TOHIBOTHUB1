const axios = require("axios");
const fs = require("fs-extra");
// Canvas removed to fix libuuid error

module.exports = {
  config: {
    name: "trump",
    author: "Jun",
    countDown: 5,
    role: 0,
    usePrefix: true,
    commandCategory: "fun",
    category: "fun",
    shortDescription: {
      en: "",
    },
  },
  wrapText: async (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = text.split(" ");
      const lines = [];
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
          line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) {
    let { senderID, threadID, messageID } = event;
    var text = args.join(" ");
    if (!text) return api.sendMessage(
      "Enter the content of the comment on the board",
      threadID,
      messageID
    );
    
    // Canvas functionality disabled due to system requirements
    return api.sendMessage(
      { body: `Trump says: "${text}"\n\n📝 Note: Image generation temporarily unavailable` },
      threadID,
      messageID
    );
  },
};