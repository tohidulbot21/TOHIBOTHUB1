module.exports = {
  config: {
    name: "neymar",
    aliases: ["njr"],
    version: "1.1",
    usePrefix: true,
    author: "Made by Tohidul",
    countDown: 5,
    role: 0,
    shortDescription: "⚽ Neymar Jr - random photo",
    longDescription: "Sends a random stylish photo of Neymar Jr.",
    category: "football",
    commandCategory: "football",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const links = [
      "https://i.imgur.com/arWjsNg.jpg",
      "https://i.imgur.com/uJYvMR0.jpg",
      "https://i.imgur.com/A3MktQ4.jpg",
      "https://i.imgur.com/wV8YHHp.jpg",
      "https://i.imgur.com/14sAFjM.jpg",
      "https://i.imgur.com/EeAi2G6.jpg",
      "https://i.imgur.com/fUZbzhJ.jpg",
      "https://i.imgur.com/bUjGSCX.jpg",
      "https://i.imgur.com/4KZvLbO.jpg",
      "https://i.imgur.com/gBEAsYZ.jpg",
      "https://i.imgur.com/baKOat0.jpg",
      "https://i.imgur.com/4Z0ERpD.jpg",
      "https://i.imgur.com/h2ReDUe.jpg",
      "https://i.imgur.com/KQPalvi.jpg",
      "https://i.imgur.com/VRALDic.jpg",
      "https://i.imgur.com/Z3qGkZa.jpg",
      "https://i.imgur.com/etyPi7B.jpg",
      "https://i.imgur.com/tMxLEwl.jpg",
      "https://i.imgur.com/OwEdlZo.jpg",
      "https://i.imgur.com/UHAo39t.jpg",
      "https://i.imgur.com/aV4EVT9.jpg",
      "https://i.imgur.com/zdC8yiG.jpg",
      "https://i.imgur.com/JI7tjsr.jpg",
      "https://i.imgur.com/fFuPCrM.jpg",
      "https://i.imgur.com/XIaAXju.jpg",
      "https://i.imgur.com/yyIJwPH.jpg",
      "https://i.imgur.com/MyGcsJM.jpg",
      "https://i.imgur.com/UXjh4R1.jpg",
      "https://i.imgur.com/QGrvMZL.jpg"
    ];

    // Send message immediately to acknowledge command
    const messageBody = '✨ Here comes the Magician! 🐐 Neymar Jr ✨';
    
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
      
      const imagePath = path.join(__dirname, 'tmp', `neymar_${Date.now()}.jpg`);
      
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
        console.log('Error writing Neymar image:', error.message);
        api.sendMessage(messageBody, threadID, messageID);
      });
      
    } catch (error) {
      // Handle specific error types
      if (error.response && error.response.status === 429) {
        console.log('Imgur rate limit reached, sending text only');
      } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log('Network timeout, sending text only');
      } else {
        console.log('Neymar command error:', error.message);
      }
      
      // Always send the text message as fallback
      api.sendMessage(messageBody, threadID, messageID);
    }
  }
};