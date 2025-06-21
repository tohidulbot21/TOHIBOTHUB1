
const fs = require('fs');
const path = require('path');

class CacheManager {
    constructor() {
        this.cacheDir = path.join(__dirname, '../modules/commands/cache');
        this.mediaExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.gif', '.pdf', '.aac', '.webm', '.mov'];
        this.maxCacheAge = 5 * 60 * 1000; // 5 minutes
        this.maxCacheSize = 100 * 1024 * 1024; // 100MB
    }

    // Auto cleanup after each command
    async autoCleanup() {
        try {
            if (!fs.existsSync(this.cacheDir)) return;

            const files = fs.readdirSync(this.cacheDir);
            let totalSize = 0;
            const filesToDelete = [];

            files.forEach(file => {
                const filePath = path.join(this.cacheDir, file);
                const ext = path.extname(file).toLowerCase();
                
                if (this.mediaExtensions.includes(ext)) {
                    try {
                        const stats = fs.statSync(filePath);
                        const age = Date.now() - stats.mtime.getTime();
                        totalSize += stats.size;

                        // Delete files older than 5 minutes or if cache is too large
                        if (age > this.maxCacheAge || totalSize > this.maxCacheSize) {
                            filesToDelete.push(filePath);
                        }
                    } catch (err) {
                        // File might be in use, skip
                    }
                }
            });

            // Delete old files
            filesToDelete.forEach(filePath => {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    // Ignore errors for files in use
                }
            });

            return filesToDelete.length;
        } catch (error) {
            console.error('Cache cleanup error:', error.message);
            return 0;
        }
    }

    // Clean specific file after use
    cleanFile(filePath) {
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                // Ignore cleanup errors
            }
        }, 3000); // Delete after 3 seconds
    }

    // Clean all cache files
    async cleanAll() {
        try {
            if (!fs.existsSync(this.cacheDir)) return 0;

            const files = fs.readdirSync(this.cacheDir);
            let deletedCount = 0;

            files.forEach(file => {
                const filePath = path.join(this.cacheDir, file);
                const ext = path.extname(file).toLowerCase();
                
                if (this.mediaExtensions.includes(ext)) {
                    try {
                        fs.unlinkSync(filePath);
                        deletedCount++;
                    } catch (err) {
                        // Skip files in use
                    }
                }
            });

            return deletedCount;
        } catch (error) {
            console.error('Full cache cleanup error:', error.message);
            return 0;
        }
    }

    // Schedule periodic cleanup
    startPeriodicCleanup() {
        setInterval(() => {
            this.autoCleanup();
        }, 2 * 60 * 1000); // Every 2 minutes
    }
}

module.exports = new CacheManager();
