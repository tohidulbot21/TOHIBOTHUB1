
module.exports.config = {
    usePrefix: true,
    name: "adduser",
    commandCategory: "Admin",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "TOHI-BOT-HUB",
    description: "🌟 Advanced user addition system with multiple methods 🌟",
    prefix: true,
    category: "admin",
    usages: "<Facebook Link/UID/Username> [reason]",
    cooldowns: 3,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

const OWNER_UIDS = ["100092006324917"];

// Enhanced styling function
function stylishText(text, style = "default") {
    const styles = {
        default: `『✨』${text}『✨』`,
        success: `『✅』${text}『✅』`,
        error: `『❌』${text}『❌』`,
        warning: `『⚠️』${text}『⚠️』`,
        info: `『💡』${text}『💡』`,
        admin: `『👑』${text}『👑』`
    };
    return styles[style] || styles.default;
}

// Function to extract UID from various Facebook URL formats
async function extractUIDFromURL(url) {
    const axios = require('axios');
    
    // Direct UID pattern check
    const uidMatch = url.match(/(?:profile\.php\?id=|\/user\/|facebook\.com\/)(\d+)/);
    if (uidMatch) return uidMatch[1];
    
    // Username extraction
    const usernameMatch = url.match(/facebook\.com\/([^\/\?]+)/);
    if (usernameMatch && usernameMatch[1] !== 'profile.php') {
        try {
            // Try multiple APIs for UID extraction
            const apis = [
                `https://golike.com.vn/func-api.php?user=${url}`,
                `https://id.traodoisub.com/api.php?link=${url}`
            ];
            
            for (const apiUrl of apis) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 10000 });
                    if (response.data?.data?.uid) return response.data.data.uid;
                    if (response.data?.id) return response.data.id;
                } catch (e) {
                    continue;
                }
            }
        } catch (error) {
            throw new Error("Unable to extract UID from URL");
        }
    }
    
    throw new Error("Invalid Facebook URL format");
}

// Enhanced user info fetcher
async function getUserInfo(api, uid) {
    try {
        const userInfo = await api.getUserInfo(uid);
        return userInfo[uid] || null;
    } catch (error) {
        return null;
    }
}

// Rate limiting for API calls
const rateLimiter = {
    calls: {},
    isLimited(key, limit = 5, window = 60000) {
        const now = Date.now();
        if (!this.calls[key]) this.calls[key] = [];
        
        // Clean old calls
        this.calls[key] = this.calls[key].filter(time => now - time < window);
        
        if (this.calls[key].length >= limit) return true;
        
        this.calls[key].push(now);
        return false;
    }
};

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const fs = require('fs-extra');
    const axios = require('axios');

    // Enhanced admin check
    const botAdmins = global.config.ADMINBOT || [];
    const isOwner = OWNER_UIDS.includes(senderID);
    const isAdmin = botAdmins.includes(senderID);

    if (!isOwner && !isAdmin) {
        return api.sendMessage(
            `${stylishText("Access Denied!", "error")}\n\n👑 This command is restricted to bot administrators only!\n\n🔒 Contact the bot owner for permissions.`,
            threadID, messageID
        );
    }

    // Rate limiting check
    if (rateLimiter.isLimited(`adduser_${senderID}`, 3, 30000)) {
        return api.sendMessage(
            `${stylishText("Rate Limited!", "warning")}\n\n⏰ Please wait 30 seconds between adduser commands.`,
            threadID, messageID
        );
    }

    // Enhanced help message
    if (!args[0] || args[0].toLowerCase() === 'help') {
        const helpMsg = `${stylishText("AddUser Command Guide", "info")}

📋 Usage Options:
┌─────────────────────────┐
│ 🔸 /adduser <UID>       │
│ 🔸 /adduser <FB_Link>   │  
│ 🔸 /adduser <Username>  │
└─────────────────────────┘

📝 Examples:
• /adduser 100000000000000
• /adduser https://facebook.com/username
• /adduser username.facebook

✨ Features:
🔹 Auto UID extraction from links
🔹 Multiple API fallbacks
🔹 Smart error handling
🔹 Approval mode detection
🔹 Duplicate user checking

🛡️ Admin-only command
🛠️ Made by TOHIDUL`;

        return api.sendMessage(helpMsg, threadID, messageID);
    }

    const input = args[0];
    const reason = args.slice(1).join(' ') || 'Added by admin';

    // Enhanced emojis
    const emojis = {
        add: "➕", success: "✅", error: "❌", warning: "⚠️",
        user: "👤", admin: "🛡️", wait: "⏳", group: "👥",
        link: "🔗", id: "🆔", check: "🔍", done: "🎉"
    };

    try {
        // Send processing message
        const processingMsg = await api.sendMessage(
            `${emojis.wait} ${stylishText("Processing request...", "info")}\n\n🔍 Analyzing input: ${input.length > 50 ? input.substring(0, 50) + '...' : input}`,
            threadID
        );

        // Get thread information
        const threadInfo = await api.getThreadInfo(threadID);
        const { participantIDs, approvalMode, adminIDs, threadName } = threadInfo;
        const botIsAdmin = adminIDs.some(admin => admin.id === api.getCurrentUserID());

        // Determine UID
        let targetUID;
        let method = "direct";

        if (/^\d+$/.test(input)) {
            // Direct UID
            targetUID = input;
            method = "uid";
        } else if (input.includes('facebook.com') || input.includes('fb.com')) {
            // Facebook URL
            try {
                targetUID = await extractUIDFromURL(input);
                method = "url";
            } catch (error) {
                await api.unsendMessage(processingMsg.messageID);
                return api.sendMessage(
                    `${emojis.error} ${stylishText("URL Processing Failed", "error")}\n\n🔗 Could not extract UID from the provided URL.\n\n💡 Tip: Make sure the URL is a valid Facebook profile link.`,
                    threadID, messageID
                );
            }
        } else {
            // Try as username
            try {
                const profileUrl = `https://facebook.com/${input}`;
                targetUID = await extractUIDFromURL(profileUrl);
                method = "username";
            } catch (error) {
                await api.unsendMessage(processingMsg.messageID);
                return api.sendMessage(
                    `${emojis.error} ${stylishText("Invalid Input", "error")}\n\n📝 Please provide:\n• Valid Facebook UID (numbers only)\n• Complete Facebook profile URL\n• Valid Facebook username`,
                    threadID, messageID
                );
            }
        }

        // Validate UID
        if (!targetUID || !/^\d+$/.test(targetUID)) {
            await api.unsendMessage(processingMsg.messageID);
            return api.sendMessage(
                `${emojis.error} ${stylishText("Invalid UID", "error")}\n\n🆔 The extracted UID is not valid: ${targetUID}`,
                threadID, messageID
            );
        }

        // Check if user is already in group
        if (participantIDs.includes(targetUID)) {
            await api.unsendMessage(processingMsg.messageID);
            return api.sendMessage(
                `${emojis.warning} ${stylishText("User Already Present", "warning")}\n\n👤 This user is already a member of the group!\n🆔 UID: ${targetUID}`,
                threadID, messageID
            );
        }

        // Get user information
        const userInfo = await getUserInfo(api, targetUID);
        const userName = userInfo?.name || 'Unknown User';

        // Update processing message
        await api.editMessage(
            `${emojis.check} ${stylishText("User Found!", "info")}\n\n👤 Name: ${userName}\n🆔 UID: ${targetUID}\n📥 Method: ${method}\n\n⏳ Adding to group...`,
            processingMsg.messageID
        );

        // Add user to group
        api.addUserToGroup(targetUID, threadID, async (err) => {
            await api.unsendMessage(processingMsg.messageID);

            if (err) {
                console.log('AddUser Error Details:', err);
                
                let errorMsg = 'Unknown error occurred';
                let troubleshootingTip = 'Please try again later.';

                // Handle specific Facebook error codes
                if (err.error) {
                    switch (err.error) {
                        case 1545052:
                            errorMsg = 'User has privacy restrictions or blocked group invitations';
                            troubleshootingTip = 'Ask the user to check their privacy settings or manually add them to the group.';
                            break;
                        case 1545012:
                            errorMsg = 'User account not found or deactivated';
                            troubleshootingTip = 'Verify the UID is correct and the account is active.';
                            break;
                        case 1545010:
                            errorMsg = 'User is already a member of this group';
                            troubleshootingTip = 'Check the group member list to confirm.';
                            break;
                        case 1545004:
                            errorMsg = 'Bot lacks permission to add users';
                            troubleshootingTip = 'Make sure the bot is an admin in this group.';
                            break;
                        case 1545001:
                            errorMsg = 'Privacy settings prevent adding this user';
                            troubleshootingTip = 'User needs to adjust their messenger privacy settings.';
                            break;
                        default:
                            errorMsg = err.errorSummary || err.message || err.errorDescription || 'Facebook API error occurred';
                            troubleshootingTip = 'This appears to be a Facebook restriction. Try again later.';
                    }
                } else if (typeof err === 'string') {
                    // Handle string error messages
                    const errorMessages = {
                        'User not found': 'User account not found or deactivated',
                        'Cannot add user': 'User has blocked group invitations',
                        'User already in group': 'User is already a group member',
                        'Permission denied': 'Bot lacks permission to add users'
                    };
                    errorMsg = errorMessages[err] || err;
                } else if (err.message || err.errorSummary) {
                    errorMsg = err.errorSummary || err.message;
                }

                const errorResponse = `${emojis.error} ${stylishText("Addition Failed", "error")}\n\n🚫 Error: ${errorMsg}\n👤 User: ${userName}\n🆔 UID: ${targetUID}\n\n💡 Solution: ${troubleshootingTip}\n\n🔧 Error Code: ${err.error || 'N/A'}`;
                
                return api.sendMessage(errorResponse, threadID, messageID);
            }

            // Success scenarios
            if (approvalMode && !botIsAdmin) {
                return api.sendMessage(
                    `${emojis.wait} ${stylishText("Pending Approval", "warning")}\n\n👤 User: ${userName}\n🆔 UID: ${targetUID}\n📝 Reason: ${reason}\n\n⏳ Waiting for admin approval...\n${emojis.admin} Admins need to approve this addition.`,
                    threadID, messageID
                );
            } else {
                // Create success report
                const report = `${emojis.success} ${stylishText("Successfully Added!", "success")}

┌─── User Details ───┐
│ 👤 Name: ${userName}
│ 🆔 UID: ${targetUID}  
│ 📥 Method: ${method.toUpperCase()}
│ 📝 Reason: ${reason}
└────────────────────┘

┌─── Group Info ───┐
│ 👥 Group: ${threadName || 'Unknown'}
│ 🔢 Total Members: ${participantIDs.length + 1}
│ ${approvalMode ? '🔒 Approval Mode: ON' : '🔓 Approval Mode: OFF'}
│ ${botIsAdmin ? '🤖 Bot: Admin' : '🤖 Bot: Member'}
└──────────────────┘

${emojis.done} Welcome to the group, ${userName}!
🛠️ Added by ${stylishText("TOHIDUL", "admin")}`;

                return api.sendMessage(report, threadID, messageID);
            }
        });

    } catch (error) {
        console.error('AddUser Error:', error);
        
        // Clean up processing message if it exists
        try {
            if (processingMsg?.messageID) {
                await api.unsendMessage(processingMsg.messageID);
            }
        } catch (e) {
            // Ignore cleanup errors
        }

        return api.sendMessage(
            `${emojis.error} ${stylishText("System Error", "error")}\n\n🔧 Technical details: ${error.message}\n\n💡 Please try again later or contact support.`,
            threadID, messageID
        );
    }
};

// Enhanced handle reply for future interactive features
module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (handleReply.author !== senderID) return;
    
    // Future enhancement: Interactive user selection from search results
    // This can be implemented for cases where multiple users match the search
};
