module.exports.config = {
    name: "alluser",
    version: "1.0.8",
    permission: 2, // Only admins can use this command
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "Displays all group members with their IDs and names.",
    category: "admin",
    commandCategory: "Info",
    cooldowns: 2
};

module.exports.run = async function ({ api, event, args, Users }) {
    // Helper function to get user name with fallback
    async function getUserName(userId) {
      try {
        // First check usersData.json
        const userData = await Users.getData(userId);
        if (userData && userData.name && userData.name !== 'undefined' && userData.name.trim() && !userData.name.startsWith('User')) {
          return userData.name;
        }
        
        // Try to get name using Users.getNameUser
        try {
          const name = await Users.getNameUser(userId);
          if (name && name !== 'undefined' && !name.startsWith('User-') && name.trim()) {
            return name;
          }
        } catch (userError) {
          console.log(`[ALLUSERS] Users.getNameUser error for ${userId}: ${userError.message}`);
        }
        
        // Fallback with better naming
        const shortId = userId.slice(-6);
        return `User_${shortId}`;
      } catch (error) {
        console.log(`[ALLUSERS] Error getting user name for ${userId}: ${error.message}`);
        const shortId = userId.slice(-6);
        return `User_${shortId}`;
      }
    }

    // Check if the user is a bot admin or group admin
    const isBotAdmin = global.config.ADMINBOT.includes(event.senderID.toString());
    
    if (!isBotAdmin) {
        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === event.senderID);
            
            if (!isGroupAdmin) {
                return api.sendMessage("🚫 **Access Denied!** Only bot admins or group admins can use this command! 😎", event.threadID, event.messageID);
            }
        } catch (error) {
            return api.sendMessage("❌ **Error checking admin status!** Please try again later. 🚨", event.threadID, event.messageID);
        }
    }

    function reply(d) {
        api.sendMessage(d, event.threadID, event.messageID);
    }

    try {
        const ep = event.participantIDs;
        let msg = "╭───✨ **Group Members** ✨───╮\n";
        msg += "│  📋 **List of All Users**  │\n";
        msg += "╰──────────────────────╯\n\n";
        let m = 0;

        for (let i of ep) {
            m += 1;
            const name = await Users.getNameUser(i);
            msg += `🌟 ${m}. **${name}** 🌟\n`;
            msg += `📌 **User ID**: ${i}\n`;
            msg += `🔗 **Profile**: https://facebook.com/${i}\n`;
            msg += `╰─➤ **Status**: Active 🟢\n\n`;
        }

        const finalMsg = `🎉 **Group Members Overview** 🎉\n\n${msg}╭───💡 **Crafted by Tohidul** 💡───╮\n╰─────────────────────────╯`;
        reply(finalMsg);
    } catch (error) {
        reply("❌ **Oops! Something went wrong!** 😓\nPlease try again later or contact the bot admin. 🚨");
    }
};