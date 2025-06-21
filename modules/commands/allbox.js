const moment = require("moment-timezone");

module.exports.config = {
    usePrefix: true,
  name: 'allbox',
  version: '2.1.0',
  credits: 'TOHIDUL',
  hasPermssion: 2,
  description: 'বট যুক্ত সব গ্রুপ লিস্ট + Ban/Unban/Del/Out/AddMe!',
  commandCategory: 'Admin',
  usages: '[page number/all]',
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID, senderID } = event;
  if (parseInt(senderID) !== parseInt(handleReply.author)) return;

  const arg = event.body.trim().split(" ");
  const order = parseInt(arg[1]) - 1;
  const idgr = handleReply.groupid[order];
  const groupName = handleReply.groupName[order];

  switch (handleReply.type) {
    case "reply": {
      if (/^ban$/i.test(arg[0])) {
        const time = moment.tz("Asia/Dhaka").format("HH:mm:ss, DD/MM/YYYY");
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        data.dateAdded = time;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });

        api.sendMessage(
          `🔴 [OWNER ACTION]\n\n⚠️ *${groupName}* গ্রুপটি বট থেকে BAN করা হয়েছে!`,
          idgr,
          () => api.sendMessage(
            `✅ BAN Success!\nগ্রুপ: ${groupName}\nTID: ${idgr}`,
            threadID,
            () => api.unsendMessage(handleReply.messageID)
          )
        );
      } else if (/^(unban|ub)$/i.test(arg[0])) {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 0;
        data.dateAdded = null;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.delete(idgr);

        api.sendMessage(
          `🟢 [OWNER ACTION]\n\n🌟 *${groupName}* গ্রুপটি BAN থেকে মুক্ত করা হয়েছে!`,
          idgr,
          () => api.sendMessage(
            `✅ UNBAN Success!\nগ্রুপ: ${groupName}\nTID: ${idgr}`,
            threadID,
            () => api.unsendMessage(handleReply.messageID)
          )
        );
      } else if (/^del$/i.test(arg[0])) {
        await Threads.delData(idgr);
        api.sendMessage(
          `🗑️ DEL Success!\nগ্রুপ: ${groupName}\nTID: ${idgr}\n\nগ্রুপের সকল ডাটা ডিলিট হয়েছে!`,
          threadID,
          messageID
        );
      } else if (/^out$/i.test(arg[0])) {
        // প্রথমে removeUserFromGroup, তারপর success হলে handleReply array থেকে সরাও
        api.sendMessage(
          `🚪 [OWNER ACTION]\n\nবট এই গ্রুপ থেকে বের হয়ে যাচ্ছে!`,
          idgr,
          async () => {
            try {
              await api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
              api.sendMessage(
                `✅ OUT Success!\nগ্রুপ: ${groupName}\nTID: ${idgr}`,
                threadID,
                () => api.unsendMessage(handleReply.messageID)
              );
              // Remove from handleReply arrays (স্মৃতি থেকে)
              handleReply.groupid.splice(order, 1);
              handleReply.groupName.splice(order, 1);
            } catch {
              api.sendMessage(`❌ গ্রুপ থেকে বের হতে সমস্যা হয়েছে!`, threadID, messageID);
            }
          }
        );
      } else if (/^addme$/i.test(arg[0])) {
        try {
          await api.addUserToGroup(senderID, idgr);
          api.sendMessage(
            `✅ আপনি সফলভাবে ${arg[1]} নম্বর গ্রুপ (${groupName}) এ অ্যাড হয়েছেন!`,
            threadID,
            messageID
          );
        } catch {
          api.sendMessage(
            `❌ দুঃখিত, আপনাকে ${arg[1]} নম্বর গ্রুপে অ্যাড করা যাচ্ছে না!`,
            threadID,
            messageID
          );
        }
      }
      break;
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  let groupid = [];
  let groupName = [];

  let data = [];
  try {
    data = await api.getThreadList(100, null, ["INBOX"]);
  } catch (e) {
    return api.sendMessage("❌ গ্রুপের তালিকা আনতে সমস্যা হয়েছে!", threadID, messageID);
  }

  // Pagination
  let page = 1;
  let limit = 10;
  let numPage = Math.ceil(data.filter(g => g.isGroup).length / limit);

  if (args[0] && args[0].toLowerCase() === "all") {
    limit = 100;
    page = 1;
  } else if (args[0] && !isNaN(args[0])) {
    page = parseInt(args[0]);
    if (page < 1) page = 1;
  }

  // Build group details with getThreadInfo for accurate stats
  let msg = `╭── 🎭 𝑩𝑶𝑻 𝑮𝑹𝑶𝑼𝑷 𝑳𝑰𝑺𝑻 🎭 ──╮\n`;
  const groupThreads = data.filter(g => g.isGroup);
  const from = limit * (page - 1);
  const to = Math.min(groupThreads.length, limit * page);

  for (let i = from; i < to; i++) {
    const thread = groupThreads[i];
    // groupid/groupName handleReply জন্য
    groupid.push(thread.threadID);
    groupName.push(thread.name || "Unnamed Group");

    // getThreadInfo দিয়ে সঠিক তথ্য আনা
    let total = 0, male = 0, female = 0, online = 0, offline = 0;
    let messageCount = thread.messageCount || 0;
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(thread.threadID);
      total = threadInfo.participantIDs.length;
      male = threadInfo.userInfo.filter(u => u.gender == "MALE").length;
      female = threadInfo.userInfo.filter(u => u.gender == "FEMALE").length;
      online = threadInfo.userInfo.filter(u => u.isOnline).length;
      offline = total - online;
      messageCount = threadInfo.messageCount || messageCount;
    } catch {
      // fallback
      total = thread.participantIDs ? thread.participantIDs.length : 0;
    }
    msg += `\n${i + 1}. ${thread.name || "Unnamed Group"}
🔰 TID: ${thread.threadID}
👥 সদস্য: ${total} (👦 ${male} | 👧 ${female})
🟢 Online: ${online} | 🔴 Offline: ${offline}
💌 Messages: ${messageCount}\n`;
  }
  msg += `\n-- পেজ ${page}/${numPage} --\n${global.config.PREFIX}allbox [page অথবা all]\n`;
  msg += `\n🎭 রিপ্লাই দিয়ে (Out, Ban, Unban, Del, AddMe) + নাম্বার দিন!
যেমন: addme 4 লিখলে ৪ নম্বর গ্রুপে আপনাকে অ্যাড করবে।
━━━━━━━━━━━━━━━━━━━━━━\nOWNER: TOHIDUL\n`;

  if (groupThreads.length === 0) {
    return api.sendMessage("❌ কোনো গ্রুপ পাওয়া যায়নি!", threadID, messageID);
  }

  return api.sendMessage(msg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      author: senderID,
      messageID: info.messageID,
      groupid,
      groupName,
      type: 'reply'
    });
  }, messageID);
};
