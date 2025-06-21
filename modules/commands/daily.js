
const fs = require("fs");
const axios = require('axios');

module.exports.config = {
  name: "daily",
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "দৈনিক বোনাস নিন",
  commandCategory: "Economy",
  cooldowns: 5,
  envConfig: {
    cooldownTime: 43200000 // 12 hours
  }
};

module.exports.run = async ({ event, api, Currencies }) => {
  const { threadID, messageID, senderID } = event;
  
  try {
    const cooldown = 43200000; // 12 hours in milliseconds
    let userData = await Currencies.getData(senderID);
    
    // Check if user data exists
    if (!userData.data) userData.data = {};
    
    // Check cooldown
    if (userData.data.workTime && cooldown - (Date.now() - userData.data.workTime) > 0) {
      const timeLeft = cooldown - (Date.now() - userData.data.workTime);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return api.sendMessage(
        `⏰ Daily bonus এর জন্য অপেক্ষা করুন!\n` +
        `⌛ সময় বাকি: ${hours}ঘ ${minutes}মি ${seconds}সে`,
        threadID, messageID
      );
    }
    
    // Give daily bonus
    const dailyAmount = 500;
    await Currencies.increaseMoney(senderID, dailyAmount);
    
    // Update work time
    userData.data.workTime = Date.now();
    await Currencies.setData(senderID, userData);
    
    // Get random image
    let attachment = null;
    try {
      const res = await axios.get("https://apimyjrt.jrt-official.repl.co/naughty.php");
      const imageUrl = res.data.data;
      const download = (await axios.get(imageUrl, { responseType: "stream" })).data;
      attachment = download;
    } catch (error) {
      // If image fails, continue without image
      console.log("Image loading failed:", error.message);
    }
    
    const successMessage = 
      `💰 Daily Bonus সংগ্রহ করা হয়েছে!\n` +
      `💵 পরিমাণ: ${dailyAmount.toLocaleString()}$\n` +
      `⏰ পরবর্তী bonus: 12 ঘন্টা পরে\n` +
      `🎉 ধন্যবাদ!`;
    
    return api.sendMessage({
      body: successMessage,
      attachment: attachment
    }, threadID, messageID);
    
  } catch (error) {
    console.error("Daily command error:", error);
    return api.sendMessage(
      "❌ একটি ত্রুটি ঘটেছে। পরে আবার চেষ্টা করুন।",
      threadID, messageID
    );
  }
};
