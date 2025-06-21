module.exports.config = {
  name: "imgur",
  version: "1.0.0",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  usePrefix: true,
  commandCategory: "utility",
  usages: "reply to image/video",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = global.nodemodule['axios'];

  let linkanh = event.messageReply?.attachments[0]?.url || args.join(" ");
  if (!linkanh) {
    return api.sendMessage('[⚜️]➜ Please provide an image or video link.', event.threadID, event.messageID);
  }

  // Helper function to delay execution
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to retry with exponential backoff
  const retryWithBackoff = async (fn, maxRetries = 5, baseDelay = 5000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (error.response?.status === 429) {
          if (attempt === maxRetries) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          }
          // Use retry-after header if available, otherwise use exponential backoff
          const retryAfter = error.response.headers['retry-after'];
          const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt - 1);
          console.log(`Rate limited. Retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`);
          await delay(delayMs);
        } else {
          throw error;
        }
      }
    }
  };

  try {
    linkanh = linkanh.replace(/\s/g, '');

    if (!/^https?:\/\//.test(linkanh)) {
      return api.sendMessage('[⚜️]➜ Invalid URL: URL must start with http:// or https://', event.threadID, event.messageID);
    }

    const attachments = event.messageReply?.attachments || [{
      url: linkanh
    }];

    // Send initial processing message
    const processingMsg = await api.sendMessage('[⚜️]➜ Processing your upload request...', event.threadID);

    try {
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const n = apis.data.api;
      
      const imgurLinks = [];
      
      // Process attachments one by one to avoid overwhelming the API
      for (const item of attachments) {
        try {
          const encodedItemUrl = encodeURIComponent(item.url);
          const result = await retryWithBackoff(async () => {
            return await axios.get(`${n}/imgur?url=${encodedItemUrl}`, {
              timeout: 45000, // 45 second timeout
              headers: {
                'User-Agent': 'TOHI-BOT-HUB/1.0'
              }
            });
          });
          
          if (result.data.success) {
            imgurLinks.push(result.data.link);
          } else {
            imgurLinks.push('Upload failed: ' + (result.data.message || 'Unknown error'));
          }
        } catch (itemError) {
          console.error('Item upload error:', itemError.message);
          imgurLinks.push('Upload failed: ' + itemError.message);
        }
        
        // Add longer delay between requests to avoid rate limits
        if (attachments.length > 1) {
          await delay(3000);
        }
      }

      // Unsend processing message
      api.unsendMessage(processingMsg.messageID);

      if (imgurLinks.length === 0) {
        return api.sendMessage('[⚜️]➜ No images could be uploaded. Please try again later.', event.threadID, event.messageID);
      }

      const successCount = imgurLinks.filter(link => link.startsWith('http')).length;
      const message = `[⚜️]➜ Upload Results (${successCount}/${imgurLinks.length} successful):\n\n${imgurLinks.join('\n')}`;
      
      return api.sendMessage(message, event.threadID, event.messageID);

    } catch (apiError) {
      api.unsendMessage(processingMsg.messageID);
      throw apiError;
    }

  } catch (e) {
    console.error('Imgur upload error:', e);
    
    if (e.message.includes('Rate limit exceeded') || e.response?.status === 429) {
      return api.sendMessage('[⚜️]➜ Imgur is currently rate limiting requests. Please wait 5-10 minutes before trying again.', event.threadID, event.messageID);
    } else if (e.code === 'ECONNABORTED' || e.message.includes('timeout')) {
      return api.sendMessage('[⚜️]➜ Upload timeout. Please try with a smaller file or try again later.', event.threadID, event.messageID);
    } else if (e.response?.status === 500) {
      return api.sendMessage('[⚜️]➜ Server error. Please try again later.', event.threadID, event.messageID);
    } else {
      return api.sendMessage('[⚜️]➜ An error occurred while uploading. Please try again later.', event.threadID, event.messageID);
    }
  }
};