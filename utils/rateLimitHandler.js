const fs = require("fs");

module.exports = {
  downloadWithRetry: async function(url, filePath, axios, fsModule, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Progressive delay: 2s, 4s, 8s, 16s, 32s
        const delay = Math.min(2000 * Math.pow(2, attempt - 1), 32000);
        if (attempt > 1) {
          console.log(`Retrying download attempt ${attempt}/${maxRetries} after ${delay}ms delay...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await axios({
          url: url,
          method: 'GET',
          responseType: 'stream',
          timeout: 20000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        const writer = fsModule.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`Download successful for ${url} on attempt ${attempt}`);
        return true;
      } catch (error) {
        console.log(`Download attempt ${attempt}/${maxRetries} failed for ${url}:`, error.message);

        if (attempt === maxRetries) {
          console.log(`All download attempts failed for ${url}`);
          return false;
        }
      }
    }
    return false;
  }
};