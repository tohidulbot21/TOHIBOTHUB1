
module.exports.config = {
  name: "commandlogs",
  version: "1.0.0",
  hasPermssion: 2, // Admin only
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "View recent command execution logs with detailed information",
  commandCategory: "Admin",
  usages: "[count]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!global.commandMonitor) {
      return api.sendMessage("❌ Command monitor not initialized!", event.threadID);
    }

    const count = parseInt(args[0]) || 10;
    const maxCount = Math.min(count, 50); // Limit to 50 entries max

    const recentLogs = global.commandMonitor.getRecentLogs(maxCount);
    const stats = global.commandMonitor.getStats();

    if (recentLogs.length === 0) {
      return api.sendMessage("📝 No command logs available yet.", event.threadID);
    }

    let message = `📊 COMMAND EXECUTION LOGS\n`;
    message += `═══════════════════════════\n`;
    message += `📈 Statistics:\n`;
    message += `• Total Commands: ${stats.total}\n`;
    message += `• Successful: ${stats.successful}\n`;
    message += `• Failed: ${stats.failed}\n`;
    message += `• Success Rate: ${stats.successRate}%\n`;
    message += `• Bot Uptime: ${stats.uptime} minutes\n\n`;

    message += `📋 Recent Commands (${maxCount}):\n`;
    message += `═══════════════════════════\n`;

    recentLogs.forEach((log, index) => {
      const statusIcon = log.status === "success" ? "✅" : "❌";
      const groupStatusIcon = log.groupStatus === "approved" ? "🟢" : 
                             log.groupStatus === "pending" ? "🟡" : "🔴";
      
      message += `${index + 1}. ${statusIcon} ${log.command}\n`;
      message += `   👤 User: ${log.user}\n`;
      message += `   🏠 Group: ${log.group}\n`;
      message += `   ${groupStatusIcon} Status: ${log.groupStatus}\n`;
      message += `   ⏱️ Time: ${log.executionTime}ms\n`;
      
      if (log.error) {
        message += `   ❌ Error: ${log.error.slice(0, 50)}...\n`;
      }
      
      const timeAgo = Math.floor((Date.now() - new Date(log.timestamp).getTime()) / 1000);
      message += `   🕐 ${timeAgo < 60 ? timeAgo + 's' : Math.floor(timeAgo/60) + 'm'} ago\n\n`;
    });

    message += `💡 Use: ${global.config.PREFIX}commandlogs [number] to see more logs`;

    return api.sendMessage(message, event.threadID);

  } catch (error) {
    console.log(`CommandLogs error: ${error.message}`);
    return api.sendMessage("❌ Error retrieving command logs!", event.threadID);
  }
};
