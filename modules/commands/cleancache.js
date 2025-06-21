
const cacheManager = require('../../utils/cacheManager');

module.exports.config = {
    name: "cleancache",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "TOHI-BOT-HUB",
    description: "Manually clean cache files or check auto-cleanup status",
    usePrefix: true,
    commandCategory: "Admin",
    usages: "[all|status]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    
    try {
        const action = args[0]?.toLowerCase();
        
        if (action === "status") {
            return api.sendMessage(
                `🔧 Cache Auto-Cleanup Status:\n` +
                `✅ Auto-cleanup: ENABLED\n` +
                `⏰ Cleanup interval: Every 2 minutes\n` +
                `📁 Max file age: 5 minutes\n` +
                `💾 Max cache size: 100MB\n` +
                `🧹 Files are automatically deleted after each command`,
                threadID, messageID
            );
        }
        
        // Manual cleanup
        const deletedCount = await cacheManager.cleanAll();
        
        if (deletedCount > 0) {
            api.sendMessage(
                `🧹 Manual Cache Cleanup Complete!\n` +
                `📁 Files deleted: ${deletedCount}\n` +
                `✨ Cache directory cleaned successfully!\n` +
                `ℹ️ Auto-cleanup is running in background`,
                threadID, messageID
            );
        } else {
            api.sendMessage(
                `✅ Cache is already clean! No files to delete.\n` +
                `🔄 Auto-cleanup is working properly.\n` +
                `💡 Use '/cleancache status' to check auto-cleanup info`,
                threadID, messageID
            );
        }
        
    } catch (error) {
        console.error("Cache cleanup error:", error);
        api.sendMessage("❌ Error occurred during cache cleanup: " + error.message, threadID, messageID);
    }
};
