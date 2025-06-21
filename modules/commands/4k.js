const axios = require('axios');
const fs = require('fs');

const xyz = "ArYANAHMEDRUDRO";

module.exports = {
  config: {
    name: "4k",
    version: "1.0.0",
    hasPermssion: 0,
    usePrefix: true,
    credits: "ArYAN",
    premium: false,
    description: "Enhance Photo - Image Generator",
    commandCategory: "Image Editing Tools",
    usages: "Reply to an image or provide image URL",
    cooldowns: 5,
    dependencies: {
      path: "",
      'fs-extra': ""
    }
  },

  run: async function({ api, event, args }) {
    const tempImagePath = __dirname + '/cache/enhanced_image.jpg';
    const { threadID, messageID } = event;

    const imageUrl = event.messageReply ? 
      event.messageReply.attachments[0].url : 
      args.join(' ');

    if (!imageUrl) {
      api.sendMessage("Please reply to an image or provide an image URL", threadID, messageID);
      return;
    }

    try {
      // Step 1: Start loading (25%)
      const processingMsg = await api.sendMessage("🔄 4K Enhancement শুরু হচ্ছে...\n\n[▓▓░░░░░░░░░░] 25%", threadID);

      // Step 2: Processing image (50%)
      setTimeout(() => {
        api.editMessage("🔄 Image Processing চলছে...\n\n[▓▓▓▓▓▓░░░░░░] 50%", processingMsg.messageID, threadID);
      }, 1000);

      // Step 3: Enhancing quality (75%)
      setTimeout(() => {
        api.editMessage("✨ Quality Enhancement করা হচ্ছে...\n\n[▓▓▓▓▓▓▓▓▓░░░] 75%", processingMsg.messageID, threadID);
      }, 2000);

      // Step 4: Almost done (100%)
      setTimeout(() => {
        api.editMessage("🎯 Final Processing...\n\n[▓▓▓▓▓▓▓▓▓▓▓▓] 100%", processingMsg.messageID, threadID);
      }, 3000);

      // Wait for UI updates before API call
      await new Promise(resolve => setTimeout(resolve, 3500));

      const apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${xyz}`;

      const enhancementResponse = await axios.get(apiUrl);
      const enhancedImageUrl = enhancementResponse.data?.resultImageUrl;

      if (!enhancedImageUrl) {
        throw new Error("Failed to get enhanced image URL.");
      }

      const enhancedImage = (await axios.get(enhancedImageUrl, { responseType: 'arraybuffer' })).data;

      fs.writeFileSync(tempImagePath, Buffer.from(enhancedImage, 'binary'));

      // Send enhanced image with success message
      await api.sendMessage({
        body: "✅ 4K Enhancement সম্পূর্ণ!\n\n🎨 আপনার image সফলভাবে enhance করা হয়েছে!\n🔥 Quality significantly improved!",
        attachment: fs.createReadStream(tempImagePath)
      }, threadID, () => {
        // Clean up file after sending
        try {
          fs.unlinkSync(tempImagePath);
        } catch (e) {}
      }, messageID);

      // Remove loading message
      try {
        await api.unsendMessage(processingMsg.messageID);
      } catch (e) {}

    } catch (error) {
      console.error("4K Enhancement error:", error.message);
      try {
        // Try to remove loading message if it exists
        if (processingMsg && processingMsg.messageID) {
          await api.unsendMessage(processingMsg.messageID);
        }
      } catch (e) {}
      
      api.sendMessage(`❌ 4K Enhancement করতে সমস্যা হয়েছে!\n\n🔧 Error: ${error.message}\n💡 আবার try করুন বা অন্য image ব্যবহার করুন।`, threadID, messageID);
    }
  }
};