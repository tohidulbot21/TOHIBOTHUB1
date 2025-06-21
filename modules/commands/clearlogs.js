
module.exports.config = {
  name: "clearlogs",
  version: "1.0.0",
  hasPermssion: 2, // Admin only
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Clear all command execution logs",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
  try {
    if (!global.commandMonitor) {
      return api.sendMessage("❌ Command monitor not initialized!", event.threadID);
    }

    const beforeCount = global.commandMonitor.getStats().total;
    global.commandMonitor.clearLogs();

    return api.sendMessage(
      `🗑️ Command logs cleared!\n\n` +
      `📊 Cleared ${beforeCount} log entries\n` +
      `✅ Fresh start for command monitoring`,
      event.threadID
    );

  } catch (error) {
    console.log(`ClearLogs error: ${error.message}`);
    return api.sendMessage("❌ Error clearing command logs!", event.threadID);
  }
};
