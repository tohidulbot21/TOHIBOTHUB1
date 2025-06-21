
const fs = require("fs-extra");
const path = require("path");
const { apiCallWithRetry } = require("../../utils/apiHelper");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "2.0.0",
    credits: "TOHIDUL (Enhanced by TOHI-BOT-HUB)",
    description: "Enhanced notification system for bot and user joins with random media support",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const joinvideoDir = path.join(__dirname, "cache", "joinvideo");
    const randomGifDir = path.join(joinvideoDir, "randomgif");
    if (!fs.existsSync(joinvideoDir)) fs.mkdirSync(joinvideoDir, { recursive: true });
    if (!fs.existsSync(randomGifDir)) fs.mkdirSync(randomGifDir, { recursive: true });
};

module.exports.run = async function({ api, event, Users }) {
    try {
        const { threadID } = event;

        // Check if group is approved before sending any notifications
        const configPath = require('path').join(__dirname, '../../config.json');
        let config;
        try {
            delete require.cache[require.resolve(configPath)];
            config = require(configPath);
        } catch (error) {
            config = {};
        }

        // Initialize approval system if not exists
        if (!config.APPROVAL) {
            config.APPROVAL = {
                approvedGroups: [],
                pendingGroups: [],
                rejectedGroups: []
            };
        }

        // Check if group is approved
        const isApproved = config.APPROVAL.approvedGroups.includes(String(threadID));
        
        // If group is not approved, don't send any join notifications
        if (!isApproved) {
            console.log(`⏳ Join notification blocked for unapproved group: ${threadID}`);
            return; // Exit early without sending notifications
        }

        // If bot is added
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
            try {
                // Set bot nickname
                const botname = global.config.BOTNAME || "TOHI-BOT";
                await api.changeNickname(`[ ${global.config.PREFIX} ] • ${botname}`, threadID, api.getCurrentUserID());

                // Get thread info
                const threadInfo = await api.getThreadInfo(threadID);
                const threadName = threadInfo.threadName || "Unknown Group";
                const memberCount = threadInfo.participantIDs.length;
                const adminCount = threadInfo.adminIDs.length;

                // Current time
                const currentTime = new Date().toLocaleString("bn-BD", {
                    timeZone: "Asia/Dhaka",
                    hour12: false
                });

                // Enhanced bot welcome message
                const botWelcomeMsg = `
╔══════════════════════════════╗
    🤖 ${stylishText("BOT ACTIVATION COMPLETE")} 🤖
╚══════════════════════════════╝

আসসালামু আলাইকুম সবাই! 🌟

🎉 আমি ${botname} এই গ্রুপে সফলভাবে যুক্ত হয়েছি!

┌─── 📊 গ্রুপ তথ্য ───┐
│ 🏠 গ্রুপ: ${threadName}
│ 👥 মোট সদস্য: ${memberCount} জন
│ 👑 এডমিন: ${adminCount} জন
│ ⚡ আমার প্রিফিক্স: ${global.config.PREFIX}
│ 🎯 মোট কমান্ড: ${global.client.commands.size}+
└─────────────────────────────┘

┌─── 🚀 শুরু করুন ───┐
│ ${global.config.PREFIX}help - সব কমান্ড দেখুন
│ ${global.config.PREFIX}menu - ক্যাটাগরি মেনু
│ ${global.config.PREFIX}info - বট তথ্য
│ ${global.config.PREFIX}admin - এডমিন কমান্ড
└─────────────────────────────┘

┌─── ⭐ বিশেষ ফিচার ───┐
│ 🤖 AI চ্যাট ও ইমেজ জেনারেশন
│ 📱 সোশ্যাল মিডিয়া ডাউনলোডার
│ 🛡️ গ্রুপ ম্যানেজমেন্ট টুলস
│ 🎮 গেমস ও এন্টারটেইনমেন্ট
│ 🎵 মিউজিক ও ভিডিও প্লেয়ার
│ 🌐 ওয়েব সার্চ ও ট্রান্সলেট
└─────────────────────────────┘

⚠️ গুরুত্বপূর্ণ নোট:
┣━ গ্রুপের নিয়ম মেনে চলুন
┣━ স্প্যাম এড়িয়ে চলুন  
┣━ সবার সাথে ভালো ব্যবহার করুন
┗━ যেকোনো সমস্যায় এডমিনদের জানান

🕒 যুক্ত হওয়ার সময়: ${currentTime}

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
🚩 Made by TOHIDUL
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`;

                // Try to send with welcome video/GIF
                const welcomeMediaPaths = [
                    path.join(__dirname, "cache", "ullash.mp4"),
                    path.join(__dirname, "cache", "join", "join.gif"),
                    path.join(__dirname, "cache", "welcome.mp4")
                ];

                let attachment = null;
                for (const mediaPath of welcomeMediaPaths) {
                    if (fs.existsSync(mediaPath)) {
                        attachment = fs.createReadStream(mediaPath);
                        break;
                    }
                }

                return api.sendMessage({ 
                    body: botWelcomeMsg, 
                    attachment: attachment
                }, threadID);

            } catch (botJoinError) {
                console.error('Bot join notification error:', botJoinError);

                // Fallback message
                const fallbackMsg = `🤖 ${global.config.BOTNAME || "TOHI-BOT"} সফলভাবে গ্রুপে যুক্ত হয়েছে!\n\n${global.config.PREFIX}help লিখে কমান্ড দেখুন।\n\n🚩 Made by TOHIDUL`;
                return api.sendMessage(fallbackMsg, threadID);
            }
        }

        // For new member(s)
        try {
            const { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};

            // Enhanced member welcome template
            const memberWelcomeTemplate = (typeof threadData.customJoin == "undefined")
                ? `
╔══════════════════════════════╗
    🎊 ${stylishText("WELCOME NEW MEMBER")} 🎊
╚══════════════════════════════╝

আসসালামু আলাইকুম! 🌟

🎉 স্বাগতম {name}!
🏠 আপনি এখন "{threadName}" গ্রুপের সদস্য!

┌─── 📊 আপনার তথ্য ───┐
│ 🆔 আপনি {memberNumber} নং সদস্য
│ 👥 গ্রুপে মোট: ${participantIDs.length} জন
│ 🤖 বট সুবিধা: ✅ উপলব্ধ
│ ⚡ প্রিফিক্স: ${global.config.PREFIX}
└─────────────────────────────┘

┌─── 🎯 গ্রুপ গাইড ───┐
│ ${global.config.PREFIX}help - কমান্ড তালিকা
│ ${global.config.PREFIX}rules - গ্রুপ নিয়ম
│ ${global.config.PREFIX}info - বট তথ্য
│ ${global.config.PREFIX}menu - ক্যাটাগরি মেনু
└─────────────────────────────┘

⚠️ গুরুত্বপূর্ণ নির্দেশনা:
┣━ গ্রুপের নিয়মাবলী মেনে চলুন
┣━ সবার সাথে ভালো ব্যবহার করুন
┣━ স্প্যাম বা বিজ্ঞাপন এড়িয়ে চলুন
┣━ এডমিনদের সম্মান করুন
┗━ একসাথে মজা করুন! 🎉

আপনাকে আবারও হার্দিক স্বাগতম! ❤️

────────────✦────────────
🚩 TOHI-BOT TEAM
────────────✦────────────`
                : threadData.customJoin;

            const memJoin = event.logMessageData.addedParticipants;
            let nameArray = [], mentions = [];
            let memberNumberArray = [];

            for (let i = 0; i < memJoin.length; i++) {
                const user = memJoin[i];
                nameArray.push(user.fullName);
                mentions.push({ tag: user.fullName, id: user.userFbId });
                memberNumberArray.push(participantIDs.length - memJoin.length + i + 1);
            }

            // Replace template variables
            let welcomeMessage = memberWelcomeTemplate
                .replace(/\{name}/g, nameArray.join(", "))
                .replace(/\{memberNumber}/g, memberNumberArray.join(", "))
                .replace(/\{threadName}/g, threadName);

            // Select random media
            const gifDir = path.join(__dirname, "cache", "joinvideo", "randomgif");
            let welcomeAttachment;
            
            if (fs.existsSync(gifDir)) {
                const files = fs.readdirSync(gifDir).filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.gif', '.mp4', '.jpg', '.jpeg', '.png'].includes(ext);
                });

                if (files.length > 0) {
                    const randomFile = files[Math.floor(Math.random() * files.length)];
                    const filePath = path.join(gifDir, randomFile);
                    if (fs.existsSync(filePath)) {
                        welcomeAttachment = fs.createReadStream(filePath);
                    }
                }
            }

            return api.sendMessage({ 
                body: welcomeMessage, 
                attachment: welcomeAttachment, 
                mentions 
            }, threadID);

        } catch (memberJoinError) {
            console.error('Member join notification error:', memberJoinError);

            // Fallback for new members
            const memJoin = event.logMessageData.addedParticipants;
            const nameArray = memJoin.map(user => user.fullName);

            const fallbackMsg = `🎉 স্বাগতম ${nameArray.join(', ')}!\n\nআমাদের গ্রুপে যোগ দেওয়ার জন্য ধন্যবাদ। ${global.config.PREFIX}help লিখে বট কমান্ড দেখুন।\n\n🚩 Made by TOHIDUL`;

            return api.sendMessage(fallbackMsg, threadID);
        }

    } catch (error) {
        console.error('JoinNoti main error:', error);
    }
};

// Helper function for styling text
function stylishText(text) {
    return `✨ ${text} ✨`;
}
