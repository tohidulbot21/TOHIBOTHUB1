
module.exports.config = {
    name: "automessage",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "TOHI-BOT-HUB",
    description: "Hourly auto message system (1-24 hours)",
    commandCategory: "Admin",
    usePrefix: true,
    usages: "[on/off/status]",
    cooldowns: 5
};

// Store for hourly messages (you can customize these)
const hourlyMessages = {
    1: "", // 1 AM message
    2: "", // 2 AM message
    3: "", // 3 AM message
    4: "", // 4 AM message
    5: "", // 5 AM message
    6: "", // 6 AM message
    7: "", // 7 AM message
    8: "", // 8 AM message
    9: "", // 9 AM message
    10: "", // 10 AM message
    11: "", // 11 AM message
    12: "", // 12 PM message
    13: "", // 1 PM message
    14: "", // 2 PM message
    15: "", // 3 PM message
    16: "", // 4 PM message
    17: "", // 5 PM message
    18: "", // 6 PM message
    19: "", // 7 PM message
    20: "", // 8 PM message
    21: "", // 9 PM message
    22: "", // 10 PM message
    23: "", // 11 PM message
    24: ""  // 12 AM message
};

let autoMessageInterval = null;
let isAutoMessageActive = false;

async function sendAutoMessage(api) {
    try {
        const currentHour = new Date().getHours();
        const hour24Format = currentHour === 0 ? 24 : currentHour;
        
        const messageToSend = hourlyMessages[hour24Format];
        
        // Only send if message is not empty
        if (messageToSend && messageToSend.trim() !== "") {
            // Get all group threads where bot is approved
            const threadList = await api.getThreadList(100, null, ['INBOX']);
            
            for (const thread of threadList) {
                if (thread.isGroup && thread.canReply) {
                    try {
                        await api.sendMessage(messageToSend, thread.threadID);
                        // Add small delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (error) {
                        console.log(`Failed to send auto message to thread ${thread.threadID}:`, error.message);
                    }
                }
            }
            
            console.log(`Auto message sent for hour ${hour24Format}: ${messageToSend}`);
        }
    } catch (error) {
        console.log("Auto message error:", error.message);
    }
}

function startAutoMessage(api) {
    if (autoMessageInterval) {
        clearInterval(autoMessageInterval);
    }
    
    // Check every minute if it's a new hour
    autoMessageInterval = setInterval(() => {
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Send message at the start of each hour (minute 0, second 0-59)
        if (minutes === 0 && seconds === 0) {
            sendAutoMessage(api);
        }
    }, 1000);
    
    isAutoMessageActive = true;
    console.log("Auto message system started");
}

function stopAutoMessage() {
    if (autoMessageInterval) {
        clearInterval(autoMessageInterval);
        autoMessageInterval = null;
    }
    isAutoMessageActive = false;
    console.log("Auto message system stopped");
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
        return api.sendMessage(
            "🤖 Auto Message System Commands:\n\n" +
            "• automessage on - Start auto messaging\n" +
            "• automessage off - Stop auto messaging\n" +
            "• automessage status - Check current status\n" +
            "• automessage setmsg [hour] [message] - Set message for specific hour\n" +
            "• automessage showmsg - Show all set messages\n\n" +
            "Example: automessage setmsg 12 Good afternoon everyone!",
            threadID, messageID
        );
    }
    
    const command = args[0].toLowerCase();
    
    switch (command) {
        case "on":
        case "start":
            if (isAutoMessageActive) {
                return api.sendMessage("✅ Auto message system is already running!", threadID, messageID);
            }
            startAutoMessage(api);
            return api.sendMessage("✅ Auto message system started! Messages will be sent every hour to all approved groups.", threadID, messageID);
            
        case "off":
        case "stop":
            if (!isAutoMessageActive) {
                return api.sendMessage("❌ Auto message system is not running!", threadID, messageID);
            }
            stopAutoMessage();
            return api.sendMessage("❌ Auto message system stopped!", threadID, messageID);
            
        case "status":
            return api.sendMessage(
                `📊 Auto Message Status: ${isAutoMessageActive ? "🟢 Active" : "🔴 Inactive"}\n` +
                `Current time: ${new Date().toLocaleTimeString()}\n` +
                `Next message time: Top of next hour`,
                threadID, messageID
            );
            
        case "setmsg":
            if (args.length < 3) {
                return api.sendMessage("❌ Usage: automessage setmsg [hour 1-24] [message]", threadID, messageID);
            }
            
            const hour = parseInt(args[1]);
            if (isNaN(hour) || hour < 1 || hour > 24) {
                return api.sendMessage("❌ Hour must be between 1-24!", threadID, messageID);
            }
            
            const message = args.slice(2).join(" ");
            hourlyMessages[hour] = message;
            
            return api.sendMessage(
                `✅ Message set for hour ${hour}:00\n"${message}"`,
                threadID, messageID
            );
            
        case "showmsg":
            let messageList = "📋 Hourly Messages:\n\n";
            for (let i = 1; i <= 24; i++) {
                const msg = hourlyMessages[i];
                const timeFormat = i === 24 ? "12:00 AM" : 
                                 i === 12 ? "12:00 PM" :
                                 i > 12 ? `${i-12}:00 PM` : `${i}:00 AM`;
                messageList += `${timeFormat}: ${msg || "[Empty]"}\n`;
            }
            
            return api.sendMessage(messageList, threadID, messageID);
            
        default:
            return api.sendMessage("❌ Invalid command! Use 'automessage' without arguments to see help.", threadID, messageID);
    }
};

// Auto-start if enabled in config
module.exports.onLoad = function({ api }) {
    console.log("Auto message module loaded");
};
