const axios = require("axios");

module.exports.config = {
    usePrefix: true,
  name: "album",
  version: "1.0.1",
  hasPermission: 0,
  credits: "TOHI-BOT-HUB",
  description: "Send a random stylish video from various categories",
  commandCategory: "media",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ event, api, args }) {
  if (!args[0]) {
    return api.sendMessage(
`╭─⭑─────     ───────⭑─╮
   🎬 𝑨𝑳𝑩𝑼𝑴 𝑽𝑰𝑫𝑬𝑶 𝑴𝑬𝑵𝑼 🎬
╰─⭑────      ────────⭑─╯

[ 1️⃣ ]  𝙄𝙨𝙡𝙖𝙢𝙞𝙘 𝙑𝙞𝙙𝙚𝙤
[ 2️⃣ ]  𝘼𝙣𝙞𝙢𝙚 𝙑𝙞𝙙𝙚𝙤
[ 3️⃣ ]  𝙎𝙝𝙖𝙞𝙧𝙞 𝙑𝙞𝙙𝙚𝙤
[ 4️⃣ ]  𝙎𝙝𝙤𝙧𝙩 𝙑𝙞𝙙𝙚𝙤
[ 5️⃣ ]  𝙎𝙖𝙙 𝙑𝙞𝙙𝙚𝙤
[ 6️⃣ ]  𝙎𝙩𝙖𝙩𝙪𝙨 𝙑𝙞𝙙𝙚𝙤
[ 7️⃣ ]  𝙁𝙤𝙤𝙩𝙗𝙖𝙡𝙡 𝙑𝙞𝙙𝙚𝙤
[ 8️⃣ ]  𝙁𝙪𝙣𝙣𝙮 𝙑𝙞𝙙𝙚𝙤
[ 9️⃣ ]  𝙇𝙤𝙫𝙚 𝙑𝙞𝙙𝙚𝙤
[ 🔟 ]  𝘾𝙋𝙇 𝙑𝙞𝙙𝙚𝙤
[ 1️⃣1️⃣ ]  𝘽𝙖𝙗𝙮 𝙑𝙞𝙙𝙚𝙤
[ 1️⃣2️⃣ ]  𝙁𝙧𝙚𝙚 𝙁𝙞𝙧𝙚 𝙑𝙞𝙙𝙚𝙤
[ 1️⃣3️⃣ ]  𝙇𝙤𝙛𝙞 𝙑𝙞𝙙𝙚𝙤
[ 1️⃣4️⃣ ]  𝙃𝙖𝙥𝙥𝙮 𝙑𝙞𝙙𝙚𝙤
[ 1️⃣5️⃣ ]  𝙃𝙪𝙢𝙖𝙮𝙪𝙣 𝙎𝙞𝙧 𝙑𝙞𝙙𝙚𝙤

━━━━━━━━━━━━━━━━━━━
📝 *নোট:* সাময়িক বিনোদনের জন্য ভিডিও, নিজের ভালো লাগার জন্য প্লে করুন।

👤 *OWNER*: TOHIDUL
━━━━━━━━━━━━━━━━━━━

🔰 রিপ্লাই করে শুধু ভিডিও নাম্বার দিন!`, 
      event.threadID, 
      (_err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "create"
        });
      }, 
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({
  api,
  event,
  client,
  handleReply
}) {
  if (handleReply.type === "create") {
    try {
      const { p: axiosInstance, h: videoUrl } = await linkanh(event.body);
      const res = await axiosInstance.get(videoUrl);
      const videoLink = res.data.data;
      const category = res.data.shaon;
      const total = res.data.count;
      let videoStream = (await axiosInstance.get(videoLink, { responseType: "stream" })).data;
      // বাংলা, স্টাইলিশ, ইমোজি সহ রিপ্লাই
      return api.sendMessage({
        body: `╭─⭑──────--------────────⭑─╮
🎬 𝙑𝙄𝘿𝙀𝙊 𝙍𝙀𝘼𝘿𝙔 𝙁𝙊𝙍 𝙔𝙊𝙐!
╰─⭑─────--------─────────⭑─╯

🌸 𝓒𝓪𝓽𝓮𝓰𝓸𝓻𝔂:  ${category}
🎥 𝓜𝓸𝓽 𝓥𝓲𝓭𝓮𝓸:  ${total} টি

✨ 𝑨𝒔𝒉𝒐 𝒆𝒌𝒕𝒊 𝒗𝒊𝒅𝒆𝒐 𝒆𝒏𝒋𝒐𝒚 𝒌𝒐𝒓𝒊!

━━━━━━━━━━━━━━━
💌 *ভালো লাগলে জানিও!*
👑 𝑷𝒓𝒆𝒔𝒆𝒏𝒕𝒆𝒅 𝒃𝒚: 𝑻𝑶𝑯𝑰𝑫𝑼𝑳
━━━━━━━━━━━━━━━`,
        attachment: videoStream
      }, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage(
        "❌😔 দুঃখিত ভাই/বোন, ভিডিও আনতে সমস্যা হয়েছে!\n\n🔁 সঠিক নাম্বার দিন বা একটু পরে চেষ্টা করুন।\n\n✨ ধৈর্য্য ধরুন, আপনার জন্য সুন্দর কিছু অপেক্ষা করছে!",
        event.threadID,
        event.messageID
      );
    }
  }
};

async function linkanh(inputNumber) {
  const axiosInstance = require("axios");
  const apiData = await axiosInstance.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
  const apiBase = apiData.data.api;
  // ক্যাটাগরি নাম্বার ও রুট
  const categoryMap = {
    '1': "/video/islam",
    '2': "/video/anime",
    '3': "/video/shairi",
    '4': "/video/short",
    '5': "/video/sad",
    '6': "/video/status",
    '7': "/video/football",
    '8': "/video/funny",
    '9': "/video/love",
    '10': "/video/cpl",
    '11': "/video/baby",
    '12': "/video/kosto",
    '13': "/video/lofi",
    '14': "/video/happy",
    '15': "/video/humaiyun"
  };
  const url = apiBase + categoryMap[inputNumber];
  return { p: axiosInstance, h: url };
}
