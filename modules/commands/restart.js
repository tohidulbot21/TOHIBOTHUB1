module.exports.config = {
	name: "restart",
	version: "7.0.0",
	permission: 2,
	credits: "TOHI-BOT-HUB",
	usePrefix: false,
	description: "restart bot system",
	commandCategory: "admin",
	usages: "",
	cooldowns: 0,
	dependencies: {
		"process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const { spawn } = require("child_process");
  const process = require("process");
  const { threadID, messageID, senderID } = event;
  
  // Check if user is admin (permission level 2)
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ You don't have permission to restart the bot. Only admins can use this command.", threadID, messageID);
  }
  
  try {
    // Send restart message
    const restartMsg = await api.sendMessage(`🔄 Bot restart শুরু হচ্ছে...\n⏳ সম্পূর্ণ system restart করা হচ্ছে...`, threadID);
    
    // Save current process info
    const isRender = process.env.RENDER || process.env.RENDER_SERVICE_ID || process.env.RENDER_EXTERNAL_URL;
    
    setTimeout(async () => {
      try {
        // Update message before restart
        await api.editMessage("✅ Bot restart সম্পূর্ণ! নতুন process শুরু হচ্ছে...", restartMsg.messageID, threadID);
        
        if (isRender) {
          // For Render environment - force restart
          console.log("[RESTART] Restarting bot on Render...");
          process.exit(0); // Exit cleanly, let Render restart
        } else {
          // For other environments - spawn new process
          console.log("[RESTART] Spawning new bot process...");
          
          const child = spawn("node", ["main.js"], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
            shell: true
          });
          
          // Detach the child process
          child.unref();
          
          // Exit current process after delay
          setTimeout(() => {
            process.exit(0);
          }, 1000);
        }
        
      } catch (error) {
        console.error("[RESTART] Error during restart:", error.message);
        // Fallback restart
        process.exit(1);
      }
    }, 2000);
    
  } catch (error) {
    console.error("[RESTART] Restart command error:", error.message);
    api.sendMessage(`❌ Restart করতে error হয়েছে: ${error.message}`, threadID, messageID);
  }
}
