module.exports.config = {
    commandCategory: "Admin",
    name: 'admins',
    version: '1.0.1',
    permission: 0,
    credits: 'tohidul',
    usePrefix: false,
    description: '🎖️ গ্রুপ অ্যাডমিনদের স্টাইলিশ তালিকা দেখুন!',
    category: 'command',
    usages: 'admins',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, Users }) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const adminIDs = threadInfo.adminIDs;
    let listad = '';
    let count = 1;

    for (const admin of adminIDs) {
        const info = await api.getUserInfo(admin.id);
        const name = info[admin.id].name;
        listad += `✨ ${count++}. ${name}\n`;
    }

    const msg = `👑 𝑮𝒓𝒐𝒖𝒑 𝑨𝒅𝒎𝒊𝒏 𝑳𝒊𝒔𝒕 👑\n━━━━━━━━━━━━━━━\n` +
                `${listad}` +
                `━━━━━━━━━━━━━━━\n` +
                `🔢 মোট অ্যাডমিন: ${adminIDs.length}\n\n` +
                `🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`;

    api.sendMessage(msg, event.threadID, event.messageID);
};
