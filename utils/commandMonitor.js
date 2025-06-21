
/**
 * Enhanced Command Monitor for TOHI-BOT
 * Monitors and logs only commands with bot prefix
 */

class CommandMonitor {
  constructor() {
    this.commandLogs = [];
    this.maxLogs = 100;
    this.startTime = Date.now();
  }

  // Log command with enhanced details
  logCommand(commandData) {
    const {
      commandName,
      userName,
      groupName,
      threadID,
      senderID,
      status,
      groupStatus,
      executionTime,
      error
    } = commandData;

    const prefix = global.config.PREFIX || "%";
    
    // Only log commands that start with our prefix
    if (!commandName.startsWith(prefix)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      command: commandName,
      user: userName || `User-${senderID?.slice(-6)}`,
      group: groupName || "Private Chat",
      threadID: threadID,
      status: status || "unknown",
      groupStatus: groupStatus || "unknown",
      executionTime: executionTime || 0,
      error: error || null
    };

    // Add to logs array
    this.commandLogs.unshift(logEntry);
    
    // Keep only recent logs
    if (this.commandLogs.length > this.maxLogs) {
      this.commandLogs = this.commandLogs.slice(0, this.maxLogs);
    }

    // Display enhanced console output
    this.displayCommandLog(logEntry);
  }

  // Display formatted command log
  displayCommandLog(entry) {
    const statusIcon = entry.status === "success" ? "✅" : "❌";
    const groupStatusIcon = entry.groupStatus === "approved" ? "🟢" : 
                           entry.groupStatus === "pending" ? "🟡" : "🔴";

    console.log(`
╭─────────────────────────────────╮
│ ${statusIcon} COMMAND EXECUTION LOG        │
├─────────────────────────────────┤
│ Group: ${entry.group.slice(0, 25).padEnd(25)} │
│ User: ${entry.user.slice(0, 26).padEnd(26)} │
│ Command: ${entry.command.padEnd(22)} │
│ Status: ${entry.status.padEnd(23)} │
│ Group Status: ${groupStatusIcon} ${entry.groupStatus.padEnd(15)} │
│ Time: ${entry.executionTime}ms${' '.repeat(20 - entry.executionTime.toString().length)}│
${entry.error ? `│ Error: ${entry.error.slice(0, 24).padEnd(24)} │` : ''}
╰─────────────────────────────────╯`);
  }

  // Get recent command logs
  getRecentLogs(count = 10) {
    return this.commandLogs.slice(0, count);
  }

  // Clear logs
  clearLogs() {
    this.commandLogs = [];
  }

  // Get statistics
  getStats() {
    const total = this.commandLogs.length;
    const successful = this.commandLogs.filter(log => log.status === "success").length;
    const failed = this.commandLogs.filter(log => log.status === "failed").length;
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? ((successful / total) * 100).toFixed(2) : 0,
      uptime: ((Date.now() - this.startTime) / 1000 / 60).toFixed(2) // minutes
    };
  }
}

module.exports = new CommandMonitor();
