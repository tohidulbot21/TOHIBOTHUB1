module.exports.config = {
  name: "inbox",
  version: "",
  permssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "admin",
  usages: "inbox",
  usePrefix: true,
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = async function({ api, event }) {
  const userId = event.senderID;
  api.sendMessage(
    "✅ আপনার ইনবক্সে মেসেজ পাঠানো হয়েছে!\n\nআপনি যা জানতে চান, বা সাহায্য লাগলে রিপ্লাই দিন।",
    userId
  );
};
