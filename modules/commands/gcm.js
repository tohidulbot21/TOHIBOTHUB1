
module.exports.config = {
    usePrefix: true,
    name: "gcm",
    commandCategory: "Admin",
    version: "1.0.0",
    hasPermssion: 1, // Group admin required
    credits: "TOHI-BOT-HUB",
    description: "🛡️ গ্রুপ মেম্বার ম্যানেজমেন্ট (দ্রুত অ্যাক্সেস)",
    prefix: true,
    category: "admin",
    usages: "[list/kick]",
    cooldowns: 5,
    dependencies: {
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

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;

    try {
        // Get thread info to check admin status
        const threadInfo = await api.getThreadInfo(threadID);
        const { participantIDs, adminIDs, threadName } = threadInfo;
        
        // Check if user is admin or owner
        const isOwner = OWNER_UIDS.includes(senderID);
        const isThreadAdmin = adminIDs.some(admin => admin.id === senderID);
        const isBotAdmin = global.config.ADMINBOT.includes(senderID);

        if (!isOwner && !isThreadAdmin && !isBotAdmin) {
            return api.sendMessage(
                `${stylishText("Access Denied!", "error")}\n\n🚫 শুধুমাত্র গ্রুপ অ্যাডমিনরা এই কমান্ড ব্যবহার করতে পারবেন!`,
                threadID, messageID
            );
        }

        const command = args[0]?.toLowerCase();

        // Show help if no arguments
        if (!command) {
            const helpMsg = `${stylishText("GCM - Group Control Manager", "info")}

📋 **দ্রুত কমান্ডসমূহ:**
┌─────────────────────────┐
│ 🔹 /gcm list            │
│ 🔹 /gcm kick [number]   │
│ 🔹 /gcm kick [uid]      │
└─────────────────────────┘

📝 **ব্যবহারের উদাহরণ:**
• **/gcm list** → সব মেম্বার দেখুন
• **/gcm kick 5** → ৫ নাম্বার মেম্বারকে কিক  
• **/gcm kick 1000...** → নির্দিষ্ট UID কিক

⚡ **দ্রুততার জন্য তৈরি!**
🛠️ **Made by TOHI-BOT-HUB**`;

            return api.sendMessage(helpMsg, threadID, messageID);
        }

        // List all members
        if (command === "list") {
            let membersList = `${stylishText("📋 Member List", "admin")}\n\n`;
            membersList += `👥 **গ্রুপ:** ${threadName || 'Unknown'}\n`;
            membersList += `🔢 **মোট:** ${participantIDs.length} জন\n`;
            membersList += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

            // Get member details
            const memberDetails = [];
            for (let i = 0; i < participantIDs.length; i++) {
                const userID = participantIDs[i];
                try {
                    const userName = await Users.getNameUser(userID) || 'Unknown User';
                    const isAdmin = adminIDs.some(admin => admin.id === userID);
                    const isOwnerCheck = OWNER_UIDS.includes(userID);
                    
                    memberDetails.push({
                        index: i + 1,
                        name: userName,
                        uid: userID,
                        isAdmin: isAdmin,
                        isOwner: isOwnerCheck
                    });
                } catch (error) {
                    memberDetails.push({
                        index: i + 1,
                        name: 'Unknown User',
                        uid: userID,
                        isAdmin: false,
                        isOwner: false
                    });
                }
            }

            // Format member list (compact version)
            for (const member of memberDetails) {
                let statusIcon = '';
                if (member.isOwner) statusIcon = '👑';
                else if (member.isAdmin) statusIcon = '🛡️';
                else statusIcon = '👤';

                membersList += `${statusIcon} **${member.index}.** ${member.name}\n`;
                membersList += `🆔 ${member.uid}\n\n`;
            }

            membersList += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            membersList += `💡 **কিক করতে:** /gcm kick [number/uid]`;

            return api.sendMessage(membersList, threadID, messageID);
        }

        // Kick member
        if (command === "kick") {
            // Check if bot is admin first
            const botID = api.getCurrentUserID();
            const isBotAdmin = adminIDs.some(admin => admin.id === botID);
            
            if (!isBotAdmin) {
                return api.sendMessage(
                    `${stylishText("কিরে হালা! 😂", "error")}\n\n🤖 **আগে আমাকে অ্যাডমিন দে তারপর না কিক দিবো বে!** 😎\n\n🛡️ **অ্যাডমিন ছাড়া কিভাবে কিক দিমু?** 🤔\n\n💡 **সমাধান:**\n• গ্রুপে আমাকে অ্যাডমিন বানাও\n• তারপর আবার কমান্ড দাও\n\n😏 **না দিলে আমি কিচ্ছু করতে পারবো না!** 🤷‍♂️`,
                    threadID, messageID
                );
            }

            const target = args[1];
            
            if (!target) {
                return api.sendMessage(
                    `${stylishText("❗ Target Missing", "error")}\n\n📝 **উদাহরণ:**\n• /gcm kick 5\n• /gcm kick 100000000000000`,
                    threadID, messageID
                );
            }

            let targetUID;

            // Check if target is a number (list index) or UID
            if (/^\d+$/.test(target)) {
                if (target.length <= 3) {
                    // It's probably a list number
                    const listIndex = parseInt(target) - 1;
                    if (listIndex >= 0 && listIndex < participantIDs.length) {
                        targetUID = participantIDs[listIndex];
                    } else {
                        return api.sendMessage(
                            `${stylishText("Invalid Number", "error")}\n\n❗ তালিকায় ${target} নাম্বার নেই!\n\n💡 /gcm list দিয়ে চেক করুন`,
                            threadID, messageID
                        );
                    }
                } else {
                    // It's probably a UID
                    targetUID = target;
                }
            } else {
                return api.sendMessage(
                    `${stylishText("Wrong Format", "error")}\n\n📝 সঠিক ফরম্যাট:\n• /gcm kick 5 (নাম্বার)\n• /gcm kick 100000000000000 (UID)`,
                    threadID, messageID
                );
            }

            // Check if target is in the group
            if (!participantIDs.includes(targetUID)) {
                return api.sendMessage(
                    `${stylishText("User Not Found", "error")}\n\n❗ এই ইউজার গ্রুপে নেই!\n🆔 UID: ${targetUID}`,
                    threadID, messageID
                );
            }

            // Prevent kicking owner or admins - Multiple Owner Protection
            const PROTECTED_UIDS = ["100092006324917", "61576508582003"]; // Add your UID here
            
            if (PROTECTED_UIDS.includes(targetUID)) {
                return api.sendMessage(
                    `${stylishText("Cannot Kick Protected User", "error")}\n\n👑 এই ইউজারকে কিক করা যাবে না! 😎\n\n🛡️ **Protected UID:** ${targetUID}\n\n🔒 **Boss Level Protection Activated!** 💪`,
                    threadID, messageID
                );
            }

            const isTargetAdmin = adminIDs.some(admin => admin.id === targetUID);
            if (isTargetAdmin && !isOwner) {
                return api.sendMessage(
                    `${stylishText("Cannot Kick Admin", "warning")}\n\n🛡️ অ্যাডমিনকে কিক করা যাবে না!`,
                    threadID, messageID
                );
            }

            // Get target user info
            const targetName = await Users.getNameUser(targetUID) || 'Unknown User';

            // Send processing message
            const processingMsg = await api.sendMessage(
                `⏳ ${targetName} কে কিক করা হচ্ছে...`,
                threadID
            );

            // Kick the user
            api.removeUserFromGroup(targetUID, threadID, async (err) => {
                await api.unsendMessage(processingMsg.messageID);

                if (err) {
                    console.log('GCM Kick Error:', err);
                    return api.sendMessage(
                        `${stylishText("Kick Failed", "error")}\n\n❌ ${targetName} কে কিক করতে ব্যর্থ!\n\n🔧 Error: ${err.message || err}`,
                        threadID, messageID
                    );
                }

                // Success message (compact)
                const successMsg = `${stylishText("✅ Kicked Successfully", "success")}

👤 **Name:** ${targetName}
🆔 **UID:** ${targetUID}
👮‍♂️ **By:** ${await Users.getNameUser(senderID)}

📊 **গ্রুপে বাকি:** ${participantIDs.length - 1} জন

🛠️ **GCM by TOHI-BOT-HUB**`;

                return api.sendMessage(successMsg, threadID, messageID);
            });

            return;
        }

        // Invalid command
        return api.sendMessage(
            `${stylishText("Invalid Command", "error")}\n\n❗ অজানা কমান্ড: "${command}"\n\n💡 সাহায্যের জন্য: /gcm`,
            threadID, messageID
        );

    } catch (error) {
        console.error('GCM Error:', error);
        return api.sendMessage(
            `${stylishText("System Error", "error")}\n\n🔧 এরর হয়েছে!\n\n📝 Details: ${error.message}`,
            threadID, messageID
        );
    }
};

// Handle reply for future interactive features
module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (handleReply.author !== senderID) return;
    
    // Future enhancement: Interactive member management
};
