
module.exports = {
  config: {
    name: "messi",
    aliases: ["lm10"],
    version: "1.1",
    usePrefix: true,
    author: "Otineyyyy your dadddy👾😉",
    countDown: 5,
    role: 0,
    shortDescription: "⚽ Lionel Messi - random photo",
    longDescription: "Sends a random stylish photo of Lionel Messi.",
    category: "football",
    commandCategory: "football",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const links = [
      "https://i.imgur.com/ahKcoO3.jpg",
      "https://i.imgur.com/Vsf4rM3.jpg",
      "https://i.imgur.com/ximEjww.jpg",
      "https://i.imgur.com/ukYhm0D.jpg",
      "https://i.imgur.com/Poice6v.jpg",
      "https://i.imgur.com/5yMvy5Z.jpg",
      "https://i.imgur.com/ndyprcd.jpg",
      "https://i.imgur.com/Pm2gC6I.jpg",
      "https://i.imgur.com/wxxHuAG.jpg",
      "https://i.imgur.com/GwOCq59.jpg",
      "https://i.imgur.com/oM0jc4i.jpg",
      "https://i.imgur.com/dJ0OUef.jpg",
      "https://i.imgur.com/iurRGPT.jpg",
      "https://i.imgur.com/jogjche.jpg",
      "https://i.imgur.com/TiyhKjG.jpg",
      "https://i.imgur.com/AwlBM23.jpg",
      "https://i.imgur.com/9OLSXZD.jpg",
      "https://i.imgur.com/itscmiy.jpg",
      "https://i.imgur.com/FsnCelU.jpg",
      "https://i.imgur.com/c7BCwDF.jpg",
      "https://i.imgur.com/3cnR6xh.jpg",
      "https://i.imgur.com/TZqepnU.jpg",
      "https://i.imgur.com/kYxEPrD.jpg",
      "https://i.imgur.com/9ZjD5nX.jpg",
      "https://i.imgur.com/YWyI4hP.jpg"
    ];

    // Send message immediately to acknowledge command
    const messageBody = '🐐 The Goat has arrived! Lionel Messi 🐐';
    
    try {
      const img = links[Math.floor(Math.random() * links.length)];
      const axios = require('axios');
      const fs = require('fs');
      const path = require('path');
      
      // Enhanced axios request with proper error handling
      const response = await axios.get(img, { 
        responseType: 'stream',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });

      // Check if response is rate limited
      if (response.status === 429) {
        console.log('Rate limited by Imgur, sending text message only');
        return api.sendMessage(messageBody, threadID, messageID);
      }

      // Check if response is successful
      if (response.status !== 200) {
        console.log(`Failed to fetch image: ${response.status}`);
        return api.sendMessage(messageBody, threadID, messageID);
      }
      
      const imagePath = path.join(__dirname, 'tmp', `messi_${Date.now()}.jpg`);
      
      // Ensure tmp directory exists
      const tmpDir = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        // Check if file was created successfully
        if (fs.existsSync(imagePath)) {
          api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(imagePath)
          }, threadID, () => {
            // Clean up the file after sending
            try {
              fs.unlinkSync(imagePath);
            } catch (e) {
              console.log('Error cleaning up file:', e.message);
            }
          }, messageID);
        } else {
          api.sendMessage(messageBody, threadID, messageID);
        }
      });
      
      writer.on('error', (error) => {
        console.log('Error writing Messi image:', error.message);
        api.sendMessage(messageBody, threadID, messageID);
      });
      
    } catch (error) {
      // Handle specific error types
      if (error.response && error.response.status === 429) {
        console.log('Imgur rate limit reached, sending text only');
      } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log('Network timeout, sending text only');
      } else {
        console.log('Messi command error:', error.message);
      }
      
      // Always send the text message as fallback
      api.sendMessage(messageBody, threadID, messageID);
    }
  }
};
