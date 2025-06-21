module.exports = {
  config: {
    name: "ronaldo",
    aliases: ["cr7"],
    version: "1.1",
    usePrefix: true,
    author: "Otineyyyy your dadddy👾😉",
    countDown: 5,
    role: 0,
    shortDescription: "⚽ Cristiano Ronaldo - random photo",
    longDescription: "Sends a random stylish photo of Cristiano Ronaldo.",
    category: "football",
    commandCategory: "football",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const links = [
      "https://i.imgur.com/gwAuLMT.jpg",
      "https://i.imgur.com/MuuhaJ4.jpg",
      "https://i.imgur.com/6t0R8fs.jpg",
      "https://i.imgur.com/7RTC4W5.jpg",
      "https://i.imgur.com/VTi2dTP.jpg",
      "https://i.imgur.com/gdXJaK9.jpg",
      "https://i.imgur.com/VqZp7IU.jpg",
      "https://i.imgur.com/9pio8Lb.jpg",
      "https://i.imgur.com/iw714Ym.jpg",
      "https://i.imgur.com/zFbcrjs.jpg",
      "https://i.imgur.com/e0td0K9.jpg",
      "https://i.imgur.com/gsJWOmA.jpg",
      "https://i.imgur.com/lU8CaT0.jpg",
      "https://i.imgur.com/mmZXEYl.jpg",
      "https://i.imgur.com/d2Ot9pW.jpg",
      "https://i.imgur.com/iJ1ZGwZ.jpg",
      "https://i.imgur.com/isqQhNQ.jpg",
      "https://i.imgur.com/GoKEy4g.jpg",
      "https://i.imgur.com/TjxTUsl.jpg",
      "https://i.imgur.com/VwPPL03.jpg",
      "https://i.imgur.com/45zAhI7.jpg",
      "https://i.imgur.com/n3agkNi.jpg",
      "https://i.imgur.com/F2mynhI.jpg",
      "https://i.imgur.com/XekHaDO.jpg"
    ];

    // Send message immediately to acknowledge command
    const messageBody = '🐐 Here Comes The Goat! Cristiano Ronaldo 🐐';
    
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
      
      const imagePath = path.join(__dirname, 'tmp', `ronaldo_${Date.now()}.jpg`);
      
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
        console.log('Error writing Ronaldo image:', error.message);
        api.sendMessage(messageBody, threadID, messageID);
      });
      
    } catch (error) {
      // Handle specific error types
      if (error.response && error.response.status === 429) {
        console.log('Imgur rate limit reached, sending text only');
      } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log('Network timeout, sending text only');
      } else {
        console.log('Ronaldo command error:', error.message);
      }
      
      // Always send the text message as fallback
      api.sendMessage(messageBody, threadID, messageID);
    }
  }
};