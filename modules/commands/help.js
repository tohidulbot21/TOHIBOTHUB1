module.exports.config = {
    name: "help",
    version: "1.0.6",
    hasPermssion: 0,
    usePrefix: true,
    credits: "TOHI-BOT",
    description: "Get all command list or module info in a stylish way",
    commandCategory: "system",
    usages: "[command name/page/all]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `
╔═────── ★ ★ ─────═╗
        💫 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 𝙈𝙊𝘿𝙐𝙇𝙀 𝙄𝙉𝙁𝙊 💫
╚═────── ★ ★ ─────═╝
🔹 𝗡𝗮𝗺𝗲         : %1
🔸 𝗨𝘀𝗮𝗴𝗲        : %3
📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻   : %2
🌈 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆     : %4
⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻     : %5s
🔑 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻   : %6

⚡️ 𝙈𝙖𝙙𝙚 𝙗𝙮 𝙏𝙊𝙃𝙄𝘿𝙐𝙇 | 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 ⚡️`,
        "helpList": `✨ 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏-এ মোট %1টি কমান্ড আছে!
🔍 𝙏𝙄𝙋: %2help [কমান্ডনাম] লিখে বিস্তারিত জানুন!`,
        "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
    }
};

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    const permissionText = (command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin Group" : "Admin Bot";
        return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, permissionText, command.config.credits), threadID, messageID);
}

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    // --------- all command group view ----------
    if (args[0] == "all") {
        const cmds = commands.values();
        var group = [], msg = "";
        for (const commandConfig of cmds) {
            if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()))
                group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
            else
                group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
        }
        group.forEach(commandGroup =>
            msg += `\n✦ 𝑪𝑨𝑻𝑬𝑮𝑶𝑹𝒀: 『 ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} 』\n${commandGroup.cmds.map(cmd=>`   ⫸ TBH ➤ 『 ${cmd.toUpperCase()} 』`).join('\n')}\n`
        );

        const fancy = `╔═━━━━━━ ◈ ━━━━━═╗
    🪐 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 𝙃𝙀𝙇𝙋 𝙈𝙀𝙉𝙐 🪐
╚═━━━━━━ ◈ ━━━━━═╝\n`;
        const info = `━━━━━━━━━━━━━━━━━━
📝 মোট কমান্ড : ${commands.size}
👑 𝙊𝙒𝙉𝙀𝙍: 𝙏𝙊𝙃𝙄𝘿𝙐𝙇
ℹ️ ${prefix}help [নাম] লিখে কমান্ড ডিটেইল দেখুন!
━━━━━━━━━━━━━━━━━━`;

        api.sendMessage(fancy + msg + info, threadID, (err, info) => {
            if (autoUnsend == false) {
                setTimeout(() => {
                    return api.unsendMessage(info.messageID);
                }, delayUnsend * 1000);
            }
        }, messageID);
        return;
    }

    // ---------- list or module/page help view ----------
    if (!command) {
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 15;
        let msg = "";

        for (var [name] of (commands)) {
            arrayInfo.push(name);
        }

        arrayInfo.sort();
        const first = numberOfOnePage * page - numberOfOnePage;
        const helpView = arrayInfo.slice(first, first + numberOfOnePage);

        for (let cmds of helpView) msg += `⫸ TBH ➤ 『 ${cmds.toUpperCase()} 』\n`;
        const fancy = `╔╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╗
  ✨ 𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝙇𝙄𝙎𝙏 ✨
╚╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╝\n`;
        const info = `━━━━━━━━━━━━━━━━━━━
📃 পেইজ : [${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}]
📝 মোট কমান্ড : ${arrayInfo.length}
ℹ️ ${prefix}help [নাম] লিখে কমান্ড ডিটেইল দেখুন!
━━━━━━━━━━━━━━━━━━━`;

        api.sendMessage(fancy + msg + info, threadID, (err, info) => {
            if (autoUnsend == false) {
                setTimeout(() => {
                    return api.unsendMessage(info.messageID);
                }, delayUnsend * 1000);
            }
        }, messageID);
        return;
    }

    // ---------- single module info ----------
    const permissionText = (command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin Group" : "Admin Bot";
    const leiamname = getText("moduleInfo",
        command.config.name,
        command.config.description || "𝙏𝙊𝙃𝙄-𝘽𝙊𝙏 𝙝𝙖𝙧 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙖𝙧𝙚 𝙢𝙖𝙜𝙞𝙘𝙖𝙡, 𝙚𝙖𝙨𝙮 𝙖𝙣𝙙 𝙨𝙢𝙖𝙧𝙩! 𝘾𝙝𝙖𝙩, 𝙛𝙪𝙣, 𝙪𝙩𝙞𝙡𝙞𝙩𝙮, 𝙖𝙣𝙙 𝙢𝙤𝙧𝙚 – 𝙖𝙡𝙬𝙖𝙮𝙨 𝙤𝙣 𝙮𝙤𝙪𝙧 𝙨𝙞𝙙𝙚. 💎",
        `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        permissionText,
        command.config.credits
    );

    api.sendMessage(leiamname, threadID, (err, info) => {
        if (autoUnsend == false) {
            setTimeout(() => {
                return api.unsendMessage(info.messageID);
            }, delayUnsend * 1000);
        }
    }, messageID);
};