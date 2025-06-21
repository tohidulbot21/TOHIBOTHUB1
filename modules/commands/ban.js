module.exports.config = {
  name: "ban",
  version: "2.1.0",
  hasPermssion: 3,
  credits: "TOHI-BOT-HUB",
  description: "Permanently ban members from the group (Bot must be admin)\nBangla improved by TOHIDUL",
  usePrefix: true,
  commandCategory: "group",
  usages: "[tag/reply] \"কারণ\" | listban | unban [uid] | view [@tag/all] | reset",
  cooldowns: 5,
  info: [
    {
      key: '[tag] or [reply message] "reason"',
      prompt: 'Warn/ban a user',
      type: '',
      example: 'ban [tag] "কারণ"'
    },
    {
      key: 'listban',
      prompt: 'See the list of banned users',
      type: '',
      example: 'ban listban'
    },
    {
      key: 'unban',
      prompt: 'Remove user from banned list',
      type: '',
      example: 'ban unban [uid]'
    },
    {
      key: 'view',
      prompt: '"tag" or "blank" or "view all", see warning count for user/self/all',
      type: '',
      example: 'ban view [@tag] / ban view all'
    },
    {
      key: 'reset',
      prompt: 'Reset all data in your group',
      type: '',
      example: 'ban reset'
    }
  ]
};

const fs = require("fs-extra");
const BANPATH = __dirname + `/cache/bans.json`;

// Add UIDs that should be protected from being banned. Replace with actual UIDs.
const PROTECTED_UIDS = ["100092006324917", "ANOTHER_UID_HERE"];

module.exports.run = async function({ api, args, Users, event, Threads, utils, client }) {
  let { messageID, threadID, senderID } = event;
  let info = await api.getThreadInfo(threadID);

  // Bot must be admin in group
  if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
    return api.sendMessage('❌ বটকে গ্রুপ অ্যাডমিন করতে হবে!\nঅনুগ্রহ করে বটকে অ্যাডমিন দিন এবং আবার চেষ্টা করুন।', threadID, messageID);

  if (!fs.existsSync(BANPATH)) {
    const data = { warns: {}, banned: {} };
    fs.writeFileSync(BANPATH, JSON.stringify(data, null, 2));
  }
  let bans = JSON.parse(fs.readFileSync(BANPATH));

  if (!bans.warns.hasOwnProperty(threadID)) {
    bans.warns[threadID] = {};
    fs.writeFileSync(BANPATH, JSON.stringify(bans, null, 2));
  }
  if (!bans.banned[threadID]) {
    bans.banned[threadID] = [];
    fs.writeFileSync(BANPATH, JSON.stringify(bans, null, 2));
  }

  // ========== VIEW ==========
  if (args[0] == "view") {
    // Self view
    if (!args[1]) {
      let warns = bans.warns[threadID][senderID];
      if (!warns || warns.length === 0)
        return api.sendMessage('✅ আপনাকে কখনো ওয়ার্ন করা হয়নি!', threadID, messageID);
      let msg = warns.map((r, i) => `${i + 1}. ${r}`).join("\n");
      return api.sendMessage(`⚠️ আপনি ওয়ার্ন পেয়েছেন: \n${msg}`, threadID, messageID);
    }
    // View tagged
    else if (Object.keys(event.mentions).length != 0) {
      let mentions = Object.keys(event.mentions);
      let message = "";
      for (let uid of mentions) {
        let name = (await api.getUserInfo(uid))[uid].name;
        let warns = bans.warns[threadID][uid];
        if (!warns || warns.length === 0) {
          message += `⭐️ ${name}: কখনো ওয়ার্ন হয়নি\n`;
        } else {
          let msg = warns.map((r, i) => `${i + 1}. ${r}`).join("\n");
          message += `⭐️ ${name}:\n${msg}\n`;
        }
      }
      return api.sendMessage(message, threadID, messageID);
    }
    // View all
    else if (args[1] == "all") {
      let allwarn = "";
      for (let id in bans.warns[threadID]) {
        let name = (await api.getUserInfo(id))[id].name;
        let warns = bans.warns[threadID][id];
        if (warns && warns.length > 0) {
          let msg = warns.map((r, i) => `${i + 1}. ${r}`).join("\n");
          allwarn += `🔸 ${name}:\n${msg}\n`;
        }
      }
      return allwarn === "" ?
        api.sendMessage("✅ কারো ওয়ার্ন নেই!", threadID, messageID) :
        api.sendMessage("⚠️ ওয়ার্ন পাওয়া সদস্যদের তালিকা:\n" + allwarn, threadID, messageID);
    }
    return;
  }

  // ========== UNBAN ==========
  if (args[0] == "unban") {
    let id = args[1];
    if (!id) return api.sendMessage("❎ আনব্যান করতে ইউজার আইডি দিন!", threadID, messageID);
    id = parseInt(id);
    if (!info.adminIDs.some(i => i.id == senderID) && !(global.config.ADMINBOT || []).includes(senderID))
      return api.sendMessage('❎ কেবল অ্যাডমিনরা আনব্যান করতে পারে!', threadID, messageID);
    let bannedList = bans.banned[threadID] || [];
    if (!bannedList.includes(id))
      return api.sendMessage("✅ এই ইউজার আগে কখনো ব্যান হয়নি!", threadID, messageID);

    bans.banned[threadID] = bannedList.filter(uid => uid !== id);
    delete bans.warns[threadID][id];
    fs.writeFileSync(BANPATH, JSON.stringify(bans, null, 2));
    return api.sendMessage(`✅ ইউজার ${id} কে আনব্যান করা হয়েছে!`, threadID, messageID);
  }

  // ========== LISTBAN ==========
  if (args[0] == "listban") {
    let bannedList = bans.banned[threadID] || [];
    if (bannedList.length === 0)
      return api.sendMessage("✅ এই গ্রুপে কেউ ব্যান হয়নি!", threadID, messageID);
    let msg = "";
    for (let id of bannedList) {
      let name = (await api.getUserInfo(id))[id]?.name || id;
      msg += `╔ নাম: ${name}\n╚ আইডি: ${id}\n`;
    }
    return api.sendMessage("❎ ব্যান হওয়া সদস্য:\n" + msg, threadID, messageID);
  }

  // ========== RESET ==========
  if (args[0] == "reset") {
    if (!info.adminIDs.some(i => i.id == senderID) && !(global.config.ADMINBOT || []).includes(senderID))
      return api.sendMessage('❎ কেবল অ্যাডমিনরা ডাটা রিসেট করতে পারে!', threadID, messageID);
    bans.warns[threadID] = {};
    bans.banned[threadID] = [];
    fs.writeFileSync(BANPATH, JSON.stringify(bans, null, 2));
    return api.sendMessage("✅ এই গ্রুপের সব ব্যান, ওয়ার্ন ডাটা রিসেট হয়েছে!", threadID, messageID);
  }

  // ========== BAN / WARN ==========
  // Check for mentions first
  if (event.type != "message_reply" && Object.keys(event.mentions).length == 0)
    return api.sendMessage(`❎ দয়া করে কাউকে ট্যাগ করুন অথবা রিপ্লাই দিয়ে কমান্ড দিন!\nব্যবহার: ban [@tag]/[reply] "কারণ"`, threadID, messageID);

  if (!info.adminIDs.some(i => i.id == senderID) && !(global.config.ADMINBOT || []).includes(senderID))
    return api.sendMessage('❎ কেবল অ্যাডমিনরা ব্যান/ওয়ার্ন দিতে পারে!', threadID, messageID);

  let reason = "";
  let iduser = [];

  // By reply
  if (event.type == "message_reply") {
    iduser.push(event.messageReply.senderID);
    reason = args.join(" ").trim();
  }
  // By mention
  else if (Object.keys(event.mentions).length != 0) {
    iduser = Object.keys(event.mentions);
    let message = args.join(" ");
    let namearr = Object.values(event.mentions);
    for (let valuemention of namearr) {
      message = message.replace(valuemention, "");
    }
    reason = message.replace(/\s+/g, ' ').trim();
  }

  // Check if any target is protected
  for (let uid of iduser) {
    if (PROTECTED_UIDS.includes(uid)) {
      return api.sendMessage('😂 হালা তুই তো প্রজা, তুই রাজারে কেমনে কিক দিবি! হা হা 😂👑\n\n🛡️ **বস লেভেল প্রোটেকশন অ্যাক্টিভেটেড!** 💪', threadID, messageID);
    }
  }

  let arraytag = [];
  let arrayname = [];
  for (let uid of iduser) {
    let name = (await api.getUserInfo(uid))[uid].name;
    arraytag.push({ id: uid, tag: name });
    arrayname.push(name);

    if (!bans.warns[threadID][uid]) bans.warns[threadID][uid] = [];
    bans.warns[threadID][uid].push(reason);

    // If 1 or more warning, ban the user
    if (bans.warns[threadID][uid].length >= 1) {
      if (!bans.banned[threadID].includes(uid)) {
        bans.banned[threadID].push(uid);
      }
      try {
        await api.removeUserFromGroup(uid, threadID);
      } catch (e) { /* ignore if can't remove */ }
    }
  }

  fs.writeFileSync(BANPATH, JSON.stringify(bans, null, 2));
  return api.sendMessage({
    body: `🚫 ${arrayname.join(", ")} কে গ্রুপ থেকে ব্যান করা হয়েছে!\nকারণ: ${reason}`,
    mentions: arraytag
  }, threadID, messageID);
};