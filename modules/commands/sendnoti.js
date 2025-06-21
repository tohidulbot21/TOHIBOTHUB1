module.exports.config = {
    name: "sendnoti",
    version: "1.1.0",
    hasPermssion: 2,
    credits: "TOHI-BOT-HUB",
    description: "Stylish broadcast to all groups (admin only). Replies come back to you.",
    usePrefix: true,
    commandCategory: "message",
    usages: "[Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const threadList = await api.getThreadList(50, null, ['INBOX']);
    let sentCount = 0;
    const custom = args.join(' ') || "🔔 (কোনো মেসেজ দেওয়া হয়নি)";
    const adminID = event.senderID;

    // Stylish, emoji & font (Unicode) layout
    const mainMsg = 
`╭─❖━━━❖━[ 𝑨𝑫𝑴𝑰𝑵 𝑵𝑶𝑻𝑰 ]━❖━━━❖─╮

${custom}

───────────────✦───────────────
✉️ এই মেসেজটি এডমিন কর্তৃক পাঠানো হয়েছে!
🚩 Made by TOHIDUL
╰─────────────────────────────╯

🔄 রিপ্লাই দিলে এডমিনের ইনবক্সে পৌঁছাবে।
`;

    // Send message to groups (max 20 for safety)
    for (const thread of threadList) {
        if (sentCount >= 20) break;
        if (thread.isGroup && thread.threadID != event.threadID) {
            try {
                await api.sendMessage(
                    { body: mainMsg }, 
                    thread.threadID, 
                    (err, info) => {
                        if (!err) {
                            // Each sent message becomes a handleReply for return to admin
                            global.client.handleReply.push({
                                name: module.exports.config.name,
                                messageID: info.messageID,
                                adminID,
                                groupName: thread.name || thread.threadID,
                                groupID: thread.threadID,
                                type: "fromGroup"
                            });
                        }
                    }
                );
                sentCount++;
            } catch (error) {
                // Ignore error, continue
            }
        }
    }
    if (sentCount > 0) {
        api.sendMessage(`✅ 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 ${sentCount}টি গ্রুপে পাঠানো হয়েছে!`, event.threadID);
    } else {
        api.sendMessage("⚠️ কোনো গ্রুপে পাঠানো যায়নি!", event.threadID);
    }
};

// Replies from group go to admin inbox
module.exports.handleReply = async ({ api, event, handleReply }) => {
    if (handleReply.type !== "fromGroup") return;
    if (!event.body) return;
    // Forward reply to the admin
    const replyMsg =
`╭─❖━━━❖━[ 𝑮𝑹𝑶𝑼𝑷 𝑹𝑬𝑷𝑳𝒀 ]━❖━━━❖─╮

💬 𝗚𝗿𝗼𝘂𝗽: ${handleReply.groupName}
🆔 𝗚𝗿𝗼𝘂𝗽 ID: ${handleReply.groupID}
👤 𝗨𝘀𝗲𝗿: ${(await api.getUserInfo(event.senderID))[event.senderID].name}

-------------------------
${event.body}
-------------------------

📩 এই রিপ্লাইটি এসেছে গ্রুপ থেকে।
╰────────────────────────╯`;

    // Send to admin's inbox
    await api.sendMessage({ body: replyMsg }, handleReply.adminID);
};