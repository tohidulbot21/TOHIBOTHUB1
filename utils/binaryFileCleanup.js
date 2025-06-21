
const fs = require('fs-extra');
const path = require('path');

class BinaryFileCleanup {
  constructor() {
    this.binaryExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff',
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',
      '.mp3', '.wav', '.aac', '.ogg', '.m4a',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.rar', '.7z', '.tar', '.gz'
    ];

    this.problematicPatterns = [
      /WhatsApp/i,
      /Image/i,
      /Video/i,
      /Audio/i,
      /Photo/i,
      /Screenshot/i
    ];
  }

  isBinaryFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    // Check extension
    if (this.binaryExtensions.includes(ext)) {
      return true;
    }

    // Check filename patterns
    return this.problematicPatterns.some(pattern => pattern.test(fileName));
  }

  async cleanupDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }

    let cleanedCount = 0;

    try {
      const items = await fs.readdir(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        
        try {
          const stat = await fs.stat(itemPath);

          if (stat.isDirectory()) {
            cleanedCount += await this.cleanupDirectory(itemPath);
          } else if (stat.isFile() && this.isBinaryFile(itemPath)) {
            await fs.unlink(itemPath);
            cleanedCount++;
          }
        } catch (e) {
          // Silent fail for individual items
        }
      }
    } catch (e) {
      // Silent fail for directory read
    }

    return cleanedCount;
  }

  async startAutoCleanup() {
    const targetDirs = [
      './attached_assets',
      './modules/commands/cache',
      './modules/events/cache',
      './modules/commands/Nayan',
      './modules/commands/nayan',
      './temp',
      './tmp'
    ];

    let totalCleaned = 0;

    for (const dir of targetDirs) {
      try {
        const cleaned = await this.cleanupDirectory(dir);
        totalCleaned += cleaned;
      } catch (e) {
        // Silent fail
      }
    }

    if (totalCleaned > 0) {
      console.log(`🗑️ Cleaned ${totalCleaned} binary files`);
    }

    // Schedule periodic cleanup every 10 minutes
    setInterval(async () => {
      for (const dir of targetDirs) {
        try {
          await this.cleanupDirectory(dir);
        } catch (e) {
          // Silent fail
        }
      }
    }, 600000);
  }
}

module.exports = new BinaryFileCleanup();
