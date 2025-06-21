module.exports.config = {
  name: "menu",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Made by Tohidul",
  description: "Guide for new users; shows all available bot commands.",
  commandCategory: "Command List",
  usages: "[Module name]",
  cooldowns: 5,
  usePrefix: true,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Cooldown: %5 seconds\n❯ Permission: %6\n\n» Module code by %7 «",
    "helpAll": "≻──── • MENU • ────≺\n✅ Currently, there are %1 commands available on this bot.\n📩 Use %2menu + [command name] to view detailed usage instructions.\n📢 The menu will auto-delete after 60 seconds.",
    "helpList": "📩⚜️ BOT MENU ⚜️📩\n◆━━━━━━━━━━━◆\n%2\n◆━━━━━━━━━━━◆\n✅ Currently, there are %3 commands available on this bot.\n🎃 Reply with the number to view detailed usage for that command.\n📌 Use %4menu all to see all commands.\n📩 Enjoy using the bot!",
    "helpeply": "🍁 BOT MENU 🍂\nHere's the command group:\n➢ %2 ✘\n✘━━━━━━━━━━━✘\n%3\n➢ Reply with the number to see detailed usage for that command ❤",
    "user": "User",
    "adminGroup": "Group Admin",
    "adminBot": "Bot Admin"
  }
};

module.exports.run = async function({ api, event, args, getText, Threads }) {
  const commands = global.client.commands;
  const { threadID, messageID } = event;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = global.config.PREFIX || "/";

  // Show info for a specific command
  if (args[0] && args[0].toLowerCase() !== "all") {
    const commandName = args[0].toLowerCase();
    if (!commands.has(commandName)) {
      return api.sendMessage(`❌ Command "${commandName}" not found.`, threadID, messageID);
    }
    const command = commands.get(commandName);
    const permText = command.config.hasPermssion === 0 ? getText('user')
      : command.config.hasPermssion === 1 ? getText('adminGroup')
      : getText('adminBot');
    return api.sendMessage(
      getText('moduleInfo',
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages ? command.config.usages : ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        permText,
        command.config.credits
      ),
      threadID,
      messageID
    );
  }

  // Show all commands grouped by category
  if (args[0] && args[0].toLowerCase() === "all") {
    const allCmds = Array.from(commands.values());
    const groups = {};
    allCmds.forEach(cmd => {
      const cat = cmd.config.commandCategory;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(cmd.config.name);
    });
    let msg = "";
    let i = 1;
    for (const [cat, cmds] of Object.entries(groups)) {
      msg += `≻──── ${cat.toUpperCase()} ────≺\n🎃 ${cmds.join(" • ")}\n\n`;
      i++;
    }
    msg += getText("helpAll", commands.size, prefix);
    return api.sendMessage(msg, threadID, async (err, info) => {
      if (autoUnsend) {
        await new Promise(res => setTimeout(res, delayUnsend * 1000));
        api.unsendMessage(info.messageID);
      }
    });
  }

  // Show groups for reply selection
  const allCmds = Array.from(commands.values());
  const groups = {};
  allCmds.forEach(cmd => {
    const cat = cmd.config.commandCategory;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(cmd.config.name);
  });
  let msg = "";
  let groupNames = [];
  let groupIndexes = [];
  let idx = 1;
  for (const cat in groups) {
    msg += `${idx}. ${cat}\n`;
    groupNames.push(cat);
    groupIndexes.push(idx);
    idx++;
  }
  msg = getText("helpList", commands.size, msg, commands.size, prefix);

  return api.sendMessage(msg, threadID, (err, info) => {
    if (autoUnsend) {
      setTimeout(() => api.unsendMessage(info.messageID), delayUnsend * 1000);
    }
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "replyhelp",
      groupNames,
      groupIndexes
    });
  });
};

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
  if (handleReply.author != event.senderID) return;
  const commands = global.client.commands;
  const prefix = global.config.PREFIX || "/";
  
  // Fallback getText function if not provided
  const safeGetText = getText || function(key, ...args) {
    const fallbackMessages = {
      "helpeply": "🍁 BOT MENU 🍂\nHere's the command group:\n➢ %2 ✘\n✘━━━━━━━━━━━✘\n%3\n➢ Reply with the number to see detailed usage for that command ❤",
      "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Cooldown: %5 seconds\n❯ Permission: %6\n\n» Module code by %7 «",
      "user": "User",
      "adminGroup": "Group Admin", 
      "adminBot": "Bot Admin"
    };
    
    if (fallbackMessages[key]) {
      let message = fallbackMessages[key];
      for (let i = 0; i < args.length; i++) {
        message = message.replace(new RegExp(`%${i + 1}`, 'g'), args[i] || '');
      }
      return message;
    }
    return key;
  };
  
  switch (handleReply.type) {
    case "replyhelp": {
      const groupIdx = parseInt(event.body) - 1;
      const groupName = handleReply.groupNames[groupIdx];
      if (!groupName) return;
      // List commands in the selected group
      const cmds = Array.from(commands.values()).filter(cmd => cmd.config.commandCategory === groupName);
      let msg = "";
      cmds.forEach((cmd, idx) => {
        msg += `${idx + 1}. ${prefix}${cmd.config.name}\n`;
      });
      return api.sendMessage(
        safeGetText("helpeply", global.config.BOTNAME, groupName, msg),
        event.threadID,
        (err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "replydetail",
            cmds
          });
        }
      );
    }
    case "replydetail": {
      const idx = parseInt(event.body) - 1;
      const cmds = handleReply.cmds;
      if (!cmds[idx]) return;
      const cmd = cmds[idx];
      const permText = cmd.config.hasPermssion === 0 ? safeGetText('user')
        : cmd.config.hasPermssion === 1 ? safeGetText('adminGroup')
        : safeGetText('adminBot');
      return api.sendMessage(
        safeGetText('moduleInfo',
          cmd.config.name,
          cmd.config.description,
          `${global.config.PREFIX || "/"}${cmd.config.name} ${cmd.config.usages ? cmd.config.usages : ""}`,
          cmd.config.commandCategory,
          cmd.config.cooldowns,
          permText,
          cmd.config.credits
        ),
        event.threadID,
        event.messageID
      );
    }
  }
};