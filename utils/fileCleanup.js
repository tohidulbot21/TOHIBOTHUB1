
const fs = require('fs');
const path = require('path');

class FileCleanup {
  static safeDelete(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
        return true;
      } else {
        console.log(`⚠️ File not found: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error deleting file ${filePath}:`, error.message);
      return false;
    }
  }

  static safeDeleteMultiple(filePaths) {
    let successCount = 0;
    filePaths.forEach(filePath => {
      if (this.safeDelete(filePath)) {
        successCount++;
      }
    });
    return successCount;
  }

  static cleanCacheFolder(cacheDir) {
    try {
      if (!fs.existsSync(cacheDir)) {
        return 0;
      }

      const files = fs.readdirSync(cacheDir);
      let cleanedCount = 0;

      files.forEach(file => {
        const filePath = path.join(cacheDir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 1 hour
        if (Date.now() - stats.mtime.getTime() > 3600000) {
          if (this.safeDelete(filePath)) {
            cleanedCount++;
          }
        }
      });

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning cache folder:', error.message);
      return 0;
    }
  }
}

module.exports = FileCleanup;
