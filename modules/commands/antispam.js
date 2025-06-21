const num = 9; // Number of times spam leads to a ban (9 means 10 times)
const timee = 10; // Time window (in seconds) for detecting spam

module.exports.config = {
    name: "antispam",
    version: "1.0.2",
    permission: 1, // Only admins can use this command
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "Automatically bans users who spam 10 times within a time window.",
    commandCategory: "Admin",
    usages: "none",
    cooldowns: 0
};

module.exports.languages = {
    "vi": {},
    "en": {}
};

module.exports.run = async function ({ api, event }) {
    const { senderID, threadID, messageID } = event;
    
    // Check if the user is a bot admin or group admin
    const isBotAdmin = global.config.ADMINBOT.includes(senderID.toString());
    const isGroupAdmin = (await api.getThreadInfo(threadID)).adminIDs.some(admin => admin.id === senderID);
    
    if (!isBotAdmin && !isGroupAdmin) {
        return api.sendMessage("🚫 **Access Denied!** Only bot admins or group admins can use this command! 😎", threadID, messageID);
    }

    try {
        const msg = `╭───✨ **Anti-Spam System** ✨───╮\n` +
                    `│  🛡️ **Spam Detection Settings**  │\n` +
                    `╰──────────────────────────╯\n\n` +
                    `🌟 **Rule**: Users will be banned if they spam 10 times within ${timee} seconds.\n` +
                    `╭───💡 **Crafted by Tohidul** 💡───╮\n` +
                    `╰─────────────────────────╯`;
        return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
        return api.sendMessage("❌ **Oops! Something went wrong!** 😓\nFailed to display anti-spam settings. Please try again later! 🚨", event.threadID, event.messageID);
    }
};

module.exports.handleEvent = async function ({ Users, Threads, api, event }) {
    let { senderID, messageID, threadID } = event;

    // Check if the user is a bot admin or group admin (skip spam detection for admins)
    const isBotAdmin = global.config.ADMINBOT.includes(senderID.toString());
    let isGroupAdmin = false;
    
    try {
        const apiHelper = require('../../utils/apiHelper');
        const threadInfo = await apiHelper.rateLimitedCall(() => api.getThreadInfo(event.threadID));
        isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
    } catch (error) {
        const is429 = error.toString().includes('429') || error.toString().includes('Rate limited');
        if (is429) {
            console.log('Rate limited while checking admin status, skipping check');
            return;
        }
        isGroupAdmin = false;
    }
    
    if (isBotAdmin || isGroupAdmin) return;

    try {
        let datathread = (await Threads.getData(event.threadID)).threadInfo;

        if (!global.client.autoban) global.client.autoban = {};

        if (!global.client.autoban[senderID]) {
            global.client.autoban[senderID] = {
                timeStart: Date.now(),
                number: 0
            };
        }

        const threadSetting = global.data.threadData.get(threadID) || {};
        const prefix = threadSetting.PREFIX || global.config.PREFIX;
        if (!event.body || event.body.indexOf(prefix) != 0) return;

        if ((global.client.autoban[senderID].timeStart + (timee * 1000)) <= Date.now()) {
            global.client.autoban[senderID] = {
                timeStart: Date.now(),
                number: 0
            };
        } else {
            global.client.autoban[senderID].number++;
            if (global.client.autoban[senderID].number >= num) {
                const moment = require("moment-timezone");
                const timeDate = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
                let dataUser = await Users.getData(senderID) || {};
                let data = dataUser.data || {};
                if (data && data.banned == true) return;

                data.banned = true;
                data.reason = `Spammed 10 times in ${timee} seconds` || null;
                data.dateAdded = timeDate;
                await Users.setData(senderID, { data });
                global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });

                global.client.autoban[senderID] = {
                    timeStart: Date.now(),
                    number: 0
                };

                const banMsg = `╭───🚨 **User Banned** 🚨───╮\n` +
                               `│  🛑 **User ID**: ${senderID}  │\n` +
                               `│  📛 **Name**: ${dataUser.name}  │\n` +
                               `│  📝 **Reason**: Spammed 10 times in ${timee}s  │\n` +
                               `│  ⏰ **Auto-Unban**: After ${timee} seconds  │\n` +
                               `╰────────────────────────╯\n` +
                               `╭───💡 **Crafted by Tohidul** 💡───╮\n` +
                               `╰─────────────────────────╯`;

                api.sendMessage(banMsg, threadID, messageID);

                // Notify admins
                const adminMsg = `╭───🚨 **Spam Ban Notification** 🚨───╮\n` +
                                `│  🛑 **Offender**: ${dataUser.name}  │\n` +
                                `│  🆔 **User ID**: ${senderID}  │\n` +
                                `│  📍 **Group ID**: ${threadID}  │\n` +
                                `│  📌 **Group Name**: ${datathread.threadName}  │\n` +
                                `│  📝 **Reason**: Spammed 10 times in ${timee}s  │\n` +
                                `│  ⏰ **Time**: ${timeDate}  │\n` +
                                `╰────────────────────────╯\n` +
                                `╭───💡 **Crafted by Tohidul** 💡───╮\n` +
                                `╰─────────────────────────╯`;

                const idad = global.config.ADMINBOT;
                for (let ad of idad) {
                    api.sendMessage(adminMsg, ad);
                }
            }
        }
    } catch (error) {
        api.sendMessage("❌ **Oops! Something went wrong!** 😓\nFailed to process anti-spam logic. Please try again later! 🚨", threadID, messageID);
    }
};
