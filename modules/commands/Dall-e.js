const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "dalle",
    version: "1.1",
    credits: "TOHI-BOT-HUB",
    hasPermssion: 0,
    usePrefix: true,
    prefix: true,
    description: "🎨 DALL·E 3 AI দিয়ে কল্পনার ছবি বানান!",
    commandCategory: "command",
    category: "command",
    usages:
      "[টেক্সট]\nযেমন:17/18 years old boy/girl watching football match on TV with 'tohidul' and '10' written on the back of their dress, 4k",
    cooldowns: 5,
  },
  run: async ({ api, event, args }) => {
    const stylishError = "❌ 『𝑾𝒓𝒐𝒏𝒈 𝑭𝒐𝒓𝒎𝒂𝒕!』\n\n" +
      "🎨 𝑼𝒔𝒆:17/18 years old boy/girl watching football match on TV with 'tohidul' and '10' written on the back of their dress, 4k\n" +
      "🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍";
    const prompt = (event.messageReply?.body.split("dalle")[1] || args.join(" ")).trim();
    if (!prompt) return api.sendMessage(stylishError, event.threadID, event.messageID);
    try {
      const cookies = [
        "1WMSMa5rJ9Jikxsu_KvCxWmb0m4AwilqsJhlkC1whxRDp2StLDR-oJBnLWpoppENES3sBh9_OeFE6BT-Kzzk_46_g_z_NPr7Du63M92maZmXZYR91ymjlxE6askzY9hMCdtX-9LK09sUsoqokbOwi3ldOlm0blR_0VLM3OjdHWcczWjvJ78LSUT7MWrdfdplScZbtHfNyOFlDIGkOKHI7Bg"
      ];
      const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];
      const wait = await api.sendMessage("⏳ 『𝑾𝒂𝒊𝒕 𝒌𝒐𝒓𝒐 𝒃𝒂𝒃𝒚 😽』", event.threadID);
      const response = await axios.get(`${await baseApiUrl()}/dalle?prompt=${encodeURIComponent(prompt)}&key=dipto008&cookies=${randomCookie}`);
      const imageUrls = response.data.imgUrls || [];
      if (!imageUrls.length) {
        api.unsendMessage(wait.messageID);
        return api.sendMessage("⚠️ 『𝑬𝒎𝒑𝒕𝒚 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒐𝒓 𝒏𝒐 𝒊𝒎𝒂𝒈𝒆𝒔 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅!』\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍", event.threadID, event.messageID);
      }
      const images = await Promise.all(
        imageUrls.map(url => axios.get(url, { responseType: 'stream' }).then(res => res.data))
      );
      api.unsendMessage(wait.messageID);
      api.sendMessage({
        body: "✅ 『𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝑷𝒉𝒐𝒕𝒐 😘』\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍",
        attachment: images
      }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(
        `❌ 『𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝑭𝒂𝒊𝒍𝒆𝒅!』\n🔎 𝑬𝒓𝒓𝒐𝒓: ${error.message}\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
