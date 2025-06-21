
module.exports.config = {
  name: "restart",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "Enhanced restart command for TOHI-BOT",
  usePrefix: true,
  commandCategory: "Admin",
  usages: "restart [reason]",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID, senderID } = event;
  const { execSync } = require('child_process');
  const chalk = require('chalk');
  const moment = require('moment-timezone');

  try {
    const reason = args.join(' ') || 'Manual restart by admin';
    const restartTime = moment().tz('Asia/Dhaka').format('DD/MM/YYYY HH:mm:ss');
    
    // Send restart notification
    const restartMsg = `
╔══════════════════════════════════════╗
║          🔄 BOT RESTARTING 🔄         ║
╚══════════════════════════════════════╝

⚙️ **TOHI-BOT Enhanced v2.0.0**
🔄 **Status:** Restarting System...
👤 **Admin:** ${await api.getUserInfo(senderID)[senderID]?.name || 'Admin'}
📝 **Reason:** ${reason}
⏰ **Time:** ${restartTime}

⌛ **Please wait 10-15 seconds...**
✅ **Bot will be back online shortly!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 TOHI-BOT-HUB Enhanced Framework v2.0.0
`;

    api.sendMessage(restartMsg, threadID, async (err, info) => {
      if (err) return console.log(err);
      
      console.log(chalk.yellow('━'.repeat(50)));
      console.log(chalk.red.bold('🔄 ENHANCED BOT RESTART INITIATED'));
      console.log(chalk.yellow('━'.repeat(50)));
      console.log(chalk.cyan(`👤 Admin: ${senderID}`));
      console.log(chalk.cyan(`📝 Reason: ${reason}`));
      console.log(chalk.cyan(`⏰ Time: ${restartTime}`));
      console.log(chalk.yellow('━'.repeat(50)));
      console.log(chalk.green('🚀 Restarting Enhanced TOHI-BOT System...'));
      console.log(chalk.yellow('━'.repeat(50)));

      // Enhanced restart with cleanup
      setTimeout(() => {
        try {
          // Clear require cache for clean restart
          Object.keys(require.cache).forEach(key => {
            if (!key.includes('node_modules')) {
              delete require.cache[key];
            }
          });

          // Clear global data
          if (global.client) {
            global.client.commands.clear();
            global.client.events.clear();
            global.client.cooldowns.clear();
          }

          // Save restart info
          const fs = require('fs-extra');
          const restartInfo = {
            timestamp: Date.now(),
            admin: senderID,
            reason: reason,
            threadID: threadID,
            messageID: info.messageID
          };
          
          fs.writeFileSync('./includes/database/data/lastRestart.json', JSON.stringify(restartInfo, null, 2));

          // Force process restart
          process.exit(0);
          
        } catch (error) {
          console.log(chalk.red('❌ Restart failed:', error.message));
          api.sendMessage('❌ Enhanced restart failed. Please try again.', threadID);
        }
      }, 3000);
    });

  } catch (error) {
    console.log(chalk.red('❌ Enhanced restart command error:', error));
    api.sendMessage('❌ Enhanced restart failed. Please check logs.', threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  // Handle post-restart notification
  const fs = require('fs-extra');
  const restartInfoPath = './includes/database/data/lastRestart.json';
  
  if (fs.existsSync(restartInfoPath)) {
    try {
      const restartInfo = JSON.parse(fs.readFileSync(restartInfoPath, 'utf8'));
      
      // Check if this is a fresh restart (within 30 seconds)
      if (Date.now() - restartInfo.timestamp < 30000) {
        const moment = require('moment-timezone');
        const completeTime = moment().tz('Asia/Dhaka').format('DD/MM/YYYY HH:mm:ss');
        
        const successMsg = `
╔══════════════════════════════════════╗
║         ✅ BOT RESTART COMPLETE ✅     ║
╚══════════════════════════════════════╝

🎉 **TOHI-BOT Enhanced v2.0.0**
✅ **Status:** Online & Ready!
🔄 **Restart Time:** ${completeTime}
⚡ **Commands:** ${global.client?.commands?.size || 0}
🎯 **Events:** ${global.client?.events?.size || 0}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 Enhanced system ready for commands!
`;

        await api.sendMessage(successMsg, restartInfo.threadID);
        
        // Remove restart info file
        fs.unlinkSync(restartInfoPath);
      }
    } catch (error) {
      // Silent error handling
    }
  }
};
