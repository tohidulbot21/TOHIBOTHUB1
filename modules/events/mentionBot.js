
module.exports.config = {
  name: "mentionBot",
  eventType: ["message", "message_reply"],
  version: "1.0.0",
  credits: "TOHI-BOT-HUB",
  description: "🤖 Bot mention detection and auto response"
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const { threadID, messageID, senderID, mentions, body } = event;
  
  try {
    // Check if bot is mentioned
    const botID = api.getCurrentUserID();
    
    if (mentions && mentions[botID]) {
      // Get user info
      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID].name;
      
      // Random responses when bot is mentioned
      const responses = [
        `🤖 হ্যালো ${userName}! আমাকে ডাকছেন কেন? 😊\n\n📝 সাহায্য চাইলে /help টাইপ করুন\n🚩 Made by TOHIDUL`,
        
        `👋 ${userName}, আমি এখানে আছি! কী দরকার? 🤔\n\n💡 কমান্ড দেখতে: /help\n🚩 Made by TOHIDUL`,
        
        `🙋‍♂️ জি ${userName}? আমাকে mention করেছেন!\n\n🔥 আমি TOHI-BOT, আপনার সেবায় নিয়োজিত\n📋 কমান্ড লিস্ট: /help\n🚩 Made by TOHIDUL`,
        
        `😎 ${userName}, কী খবর? আমাকে ডাকলেন তো! 🎉\n\n⚡ আমি সব সময় active আছি\n🛠️ সাহায্য: /help\n🚩 Made by TOHIDUL`,
        
        `🤗 ${userName}, আমি তো এখানেই আছি! বলুন কী করতে পারি? 💪\n\n🎯 কমান্ড চালু করতে: /help\n🚩 Made by TOHIDUL`,
        
        `👑 ${userName}, Boss আমাকে ডাকছেন? 😄\n\n🔧 আমি TOHI-BOT-HUB এর সদস্য\n📖 গাইড: /help\n🚩 Made by TOHIDUL`,
        
        `🚀 ${userName}, Ready to serve! কী কাজ আছে? 💼\n\n⭐ 180+ কমান্ড available\n📚 দেখুন: /help\n🚩 Made by TOHIDUL`,
        
        `💫 ${userName}, আমি আপনার smart assistant! 🧠\n\n🎨 Music, Video, AI - সব আছে!\n📝 তালিকা: /help\n🚩 Made by TOHIDUL`
      ];
      
      // Select random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Send response with mention
      await api.sendMessage({
        body: randomResponse,
        mentions: [{
          tag: userName,
          id: senderID
        }]
      }, threadID, messageID);
      
      console.log(`[MENTION-BOT] Bot mentioned by ${userName} (${senderID}) in thread ${threadID}`);
    }
    
  } catch (error) {
    console.error('[MENTION-BOT] Error:', error);
    // Don't send error message to avoid spam
  }
};
