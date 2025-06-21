module.exports = {
  config: {
    usePrefix: true,
    name: "ai",
    commandCategory: "AI",
    version: "1.0.1",
    permission: 0,
    credits: "TOHI-BOT-HUB",
    description: "🤖 𝑨𝑰 𝑪𝒉𝒂𝒕: প্রশ্ন করুন, AI উত্তর দেবে!",
    prefix: true,
    category: "command",
    usages: "ai [আপনার প্রশ্ন]",
    cooldowns: 5,
    dependencies: {}
  },

  start: async function({ nayan, events, args, Users, NAYAN }) {
    const axios = require("axios");
    const id = nayan.getCurrentUserID();
    const uid = events.senderID;
    const userName = await Users.getNameUser(uid);
    const prompt = args.join(" ");
    if (!prompt)
      return NAYAN.sendContact(
        "⚠️ 『𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒚𝒐𝒖𝒓 𝒒𝒖𝒆𝒓𝒚!』\n\nউদাহরণ:\n/ai আজকের আবহাওয়া কেমন?\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍",
        id,
        events.threadID
      );

    try {
      const apis = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json"
      );
      const apiss = apis.data.api;
      const response = await axios.get(
        `${apiss}/nayan/gpt3?prompt=${encodeURIComponent(prompt)}`
      );
      const aiResponse =
        response.data.response ||
        "❌ 『𝑰 𝒂𝒎 𝒖𝒏𝒂𝒃𝒍𝒆 𝒕𝒐 𝒑𝒓𝒐𝒄𝒆𝒔𝒔 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕 𝒂𝒕 𝒕𝒉𝒆 𝒎𝒐𝒎𝒆𝒏𝒕.』";

      await NAYAN.sendContact(
        `🤖 『𝑨𝑰 𝑹𝒆𝒔𝒑𝒐𝒏𝒔𝒆』\n━━━━━━━━━━━━━━━\n👤 ইউজার: ${userName}\n\n💬 প্রশ্ন: ${prompt}\n\n🔎 উত্তর:\n${aiResponse}\n━━━━━━━━━━━━━━━\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`,
        id,
        events.threadID
      );
    } catch (error) {
      await NAYAN.sendContact(
        `❌ 『𝑬𝒓𝒓𝒐𝒓: 𝑨𝑰 𝑠𝑒𝑟𝑣𝑒𝑟 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑝𝑟𝑜𝑏𝑙𝑒𝑚!』\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`,
        id,
        events.threadID
      );
    }
  }
};