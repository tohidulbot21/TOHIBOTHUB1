
const { loadImage, createCanvas, registerFont } = require('canvas');
const fs = require('fs-extra');
const axios = require('axios');

class CanvasHelper {
  /**
   * Download image with retry logic
   */
  static async downloadImage(url, path, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const delay = Math.min(2000 * Math.pow(2, attempt - 1), 8000);
        
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/*,*/*;q=0.8'
          }
        });

        fs.writeFileSync(path, Buffer.from(response.data));
        return true;
        
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
    return false;
  }

  /**
   * Create circular avatar
   */
  static drawCircularAvatar(ctx, image, x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, x, y, size, size);
    ctx.restore();
  }

  /**
   * Add text with outline
   */
  static drawTextWithOutline(ctx, text, x, y, fillColor = '#FFFFFF', strokeColor = '#000000', strokeWidth = 2) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  /**
   * Create gradient background
   */
  static createGradientBackground(ctx, width, height, colors = ['#667eea', '#764ba2']) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Download Facebook avatar
   */
  static async downloadFacebookAvatar(userID, outputPath) {
    try {
      const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      return await this.downloadImage(avatarUrl, outputPath);
    } catch (error) {
      console.log(`[CANVAS] Failed to download avatar for ${userID}:`, error.message);
      return false;
    }
  }

  /**
   * Resize image while maintaining aspect ratio
   */
  static resizeImage(ctx, image, targetWidth, targetHeight, x = 0, y = 0) {
    const aspectRatio = image.width / image.height;
    let newWidth = targetWidth;
    let newHeight = targetHeight;

    if (aspectRatio > 1) {
      newHeight = targetWidth / aspectRatio;
    } else {
      newWidth = targetHeight * aspectRatio;
    }

    const offsetX = x + (targetWidth - newWidth) / 2;
    const offsetY = y + (targetHeight - newHeight) / 2;

    ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);
  }

  /**
   * Create rounded rectangle
   */
  static roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Wrap text to fit within width
   */
  static wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      
      const words = text.split(' ');
      const lines = [];
      let line = '';
      
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  }
}

module.exports = CanvasHelper;
