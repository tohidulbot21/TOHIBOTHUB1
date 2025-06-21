const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports.config = {
  name: "fluxpro",
  version: "2.0",
  hasPermssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "Generate images with Flux.1 Pro",
  commandCategory: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  preimum: true,
  usePrefix: true,
  usages: "{pn} [prompt] --ratio 1024x1024\n{pn} [prompt]",
  cooldowns: 15,
};

module.exports.run = async ({ event, args, api }) => {
  try {
    const prompt = args.join(" ");
    
    if (!prompt) {
      return api.sendMessage("❌ Please provide a prompt for image generation!\nExample: /fluxpro a beautiful sunset", event.threadID, event.messageID);
    }

    const startTime = new Date().getTime();
    const loadingMsg = await api.sendMessage('🎨 Generating your image with Flux.1 Pro... Please wait! ⏳', event.threadID, event.messageID);
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);

    // Try multiple backup APIs
    const fluxApis = [
      `https://api.kenliejugarap.com/flux/?prompt=${encodeURIComponent(prompt)}`,
      `https://openapi-idk8.onrender.com/flux?prompt=${encodeURIComponent(prompt)}`,
      `https://joshweb.click/api/flux?prompt=${encodeURIComponent(prompt)}`,
      `https://markdevs-last-api.onrender.com/flux?prompt=${encodeURIComponent(prompt)}`
    ];

    let imageUrl = null;
    let apiUsed = null;

    // Try each API until one works
    for (let i = 0; i < fluxApis.length; i++) {
      try {
        console.log(`Trying Flux API ${i + 1}: ${fluxApis[i]}`);
        
        const response = await axios.get(fluxApis[i], { 
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.data && (response.data.url || response.data.image || response.data.result)) {
          imageUrl = response.data.url || response.data.image || response.data.result;
          apiUsed = i + 1;
          console.log(`Flux API ${i + 1} successful, image URL: ${imageUrl}`);
          break;
        }
      } catch (apiError) {
        console.log(`Flux API ${i + 1} failed:`, apiError.message);
        continue;
      }
    }

    if (!imageUrl) {
      await api.unsendMessage(loadingMsg.messageID);
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      return api.sendMessage("❌ Sorry, all Flux.1 Pro APIs are currently unavailable. Please try again later!", event.threadID, event.messageID);
    }

    // Download and send the image
    try {
      const imageResponse = await axios.get(imageUrl, { 
        responseType: "stream",
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      await api.unsendMessage(loadingMsg.messageID);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      
      const endTime = new Date().getTime();
      await api.sendMessage({
        body: `🎨 Here's your Flux.1 Pro generated image!\n\n📝 Prompt: ${prompt}\n🤖 Model: Flux.1 Pro\n⏱️ Time Taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds\n🔗 API Used: ${apiUsed}`, 
        attachment: imageResponse.data
      }, event.threadID, event.messageID);

    } catch (downloadError) {
      console.log("Image download error:", downloadError.message);
      await api.unsendMessage(loadingMsg.messageID);
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      return api.sendMessage("❌ Failed to download the generated image. Please try again!", event.threadID, event.messageID);
    }

  } catch (error) {
    console.log("FluxPro command error:", error.message);
    try {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    } catch (e) {}
    
    return api.sendMessage("❌ An unexpected error occurred while generating the image. Please try again later!", event.threadID, event.messageID);
  }
};