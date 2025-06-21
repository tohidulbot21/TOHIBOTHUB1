const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "quiz",
    version: "1.2",
    credits: "Dipto, styled by TOHIDUL",
    cooldowns: 0,
    hasPermssion: 0,
    commandCategory: "game",
    usePrefix: true,
    prefix: true,
    usages: "{p}quiz\n{pn}quiz bn\n{p}quiz en",
  },

  run: async function ({ api, event, args }) {
    const input = args.join('').toLowerCase() || "bn";
    let timeout = 300;
    let category = "bangla";
    if (input === "bn" || input === "bangla") category = "bangla";
    else if (input === "en" || input === "english") category = "english";

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/quiz?category=${category}&q=random`
      );
      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const uid = event.senderID;

      // Safe user name retrieval with fallback
      let namePlayerReact;
      try {
        const userInfo = await api.getUserInfo(uid);
        namePlayerReact = userInfo && userInfo[uid] && userInfo[uid].name ? userInfo[uid].name : `User-${uid.slice(-6)}`;
      } catch (error) {
        console.log(`Error getting user info for ${uid}: ${error.message}`);
        namePlayerReact = `User-${uid.slice(-6)}`;
      }

      const quizMsg = {
        body:
`╭─❖━━❖[ 𝑸𝑼𝑰𝒁 𝑻𝑰𝑴𝑬 ]❖━━❖─╮
🔮  প্রশ্ন: ${question}

1️⃣) ${a}
2️⃣) ${b}
3️⃣) ${c}
4️⃣) ${d}
╰───────────────────────╯

📩 উত্তর দিতে এই মেসেজে রিপ্লাই দিন! (1/2/3/4)
⏳ সময়: ${timeout} সেকেন্ড

👤 খেলোয়াড়: @${namePlayerReact}
✨ শুভকামনা!
`,
        mentions: [{
          tag: `@${namePlayerReact}`,
          id: uid
        }]
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          if (error) {
            console.log("Error sending quiz message:", error);
            return;
          }
          global.client.handleReply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer,
            nameUser: namePlayerReact,
            attempts: 0
          });
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, timeout * 1000);
        },
        event.messageID,
      );
    } catch (error) {
      console.log("❌ | Error occurred:", error);
      api.sendMessage("কুইজ আনতে সমস্যা হচ্ছে! পরে চেষ্টা করুন।", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ event, api, handleReply, Users }) {
    const { correctAnswer, nameUser, author } = handleReply;
    const prefix = global.config.PREFIX || "/";

    if (event.senderID !== author)
      return api.sendMessage(
        "⛔ শুধু কুইজ শুরু করা ইউজারই উত্তর দিতে পারবে!", event.threadID, event.messageID
      );

    const maxAttempts = 2;

    switch (handleReply.type) {
      case "reply": {
        let userReply = event.body.trim();

        // Convert numbers to corresponding letters for API compatibility
        const numberToLetter = { "1": "a", "2": "b", "3": "c", "4": "d" };

        if (["1", "2", "3", "4"].includes(userReply)) {
          userReply = numberToLetter[userReply];
        } else {
          // If user still uses letters, convert to lowercase
          userReply = userReply.toLowerCase();
          let normalized = userReply[0];
          if (["a","b","c","d"].includes(normalized)) userReply = normalized;
          // Also allow Bengali equivalents
          else if (["এ", "বি", "সি", "ডি"].includes(userReply[0])) {
            userReply = { "এ": "a", "বি": "b", "সি": "c", "ডি": "d" }[userReply[0]];
          }
        }

        if (handleReply.attempts >= maxAttempts) {
          await api.unsendMessage(handleReply.messageID);
          // Convert correct answer letter to number for display
          const letterToNumber = { "a": "1", "b": "2", "c": "3", "d": "4" };
          const correctNumber = letterToNumber[correctAnswer.toLowerCase()] || correctAnswer;

          const incorrectMsg =
`⛔ @${nameUser}, তুমি সর্বোচ্চ চেষ্টা (${maxAttempts}) করে ফেলেছো!
✅ সঠিক উত্তর ছিল: ${correctNumber}

🔁 নতুন কুইজ নিতে ${prefix}quiz লিখো!`;
          return api.sendMessage({
            body: incorrectMsg,
            mentions: [{
              tag: `@${nameUser}`,
              id: author
            }]
          }, event.threadID, event.messageID);
        }

        if (userReply === correctAnswer.toLowerCase()) {
          api.unsendMessage(handleReply.messageID).catch(console.error);
          let rewardCoins = 200;
          let rewardExp = 100;

          try {
            let userData = await Users.getData(author);
            if (userData) {
              await Users.setData(author, {
                money: (userData.money || 0) + rewardCoins,
                exp: (userData.exp || 0) + rewardExp,
                data: userData.data || {},
              });
            }
          } catch (error) {
            console.log("Error updating user data:", error);
          }

          let correctMsg =
`🎉 অভিনন্দন, @${nameUser}! 🌟
✅ একদম ঠিক উত্তর! তুমি কুইজ চ্যাম্পিয়ন! 🏆

💰 পুরস্কার: ${rewardCoins} কয়েন
⚡ অভিজ্ঞতা: ${rewardExp} XP

নতুন কুইজের জন্য: ${prefix}quiz
`;
          api.sendMessage({
            body: correctMsg,
            mentions: [{
              tag: `@${nameUser}`,
              id: author
            }]
          }, event.threadID, event.messageID);
        } else {
          handleReply.attempts += 1;
          api.sendMessage(
`❌ ভুল উত্তর! 
🔁 আরও ${maxAttempts - handleReply.attempts} বার চেষ্টা করতে পারো। 
আবার চেষ্টা করো!`, event.threadID, event.messageID
          );
        }
        break;
      }
      default:
        break;
    }
  },
};