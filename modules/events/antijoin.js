
module.exports.config = {
  name: "antijoin",
  eventType: ["log:subscribe"],
  version: "1.3.0",
  credits: "TOHIDUL (Enhanced by TOHI-BOT-HUB)",
  description: "Enhanced Anti Join mode - Auto remove new members with stylish notifications"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  try {
    const { threadID } = event;
    let data = (await Threads.getData(threadID)).data || {};
    
    // Check if anti join is enabled
    if (data.newMember !== true) return;
    
    // Don't remove bot itself
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
    let successCount = 0;
    let failCount = 0;
    let removedUsers = [];

    // Remove each new member
    for (let idUser of memJoin) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        
        // Get user info before removal
        const userInfo = await Users.getNameUser(idUser);
        
        await new Promise((resolve, reject) => {
          api.removeUserFromGroup(idUser, threadID, function (err) {
            if (err) {
              failCount++;
              console.error(`Failed to remove user ${idUser}:`, err);
              // If removal fails, disable anti join mode
              data["newMember"] = false;
              reject(err);
            } else {
              successCount++;
              removedUsers.push(userInfo || "Unknown User");
              resolve();
            }
          });
        });
      } catch (removalError) {
        console.error(`Error removing user ${idUser}:`, removalError);
        failCount++;
      }
    }

    // Update thread data
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    // Send stylish notification
    const currentTime = new Date().toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      hour12: false
    });

    let notificationMsg;
    
    if (successCount > 0) {
      notificationMsg = `
╔════════════════════════════╗
  🛡️ 𝘼𝙉𝙏𝙄 𝙅𝙊𝙄𝙉 𝘼𝘾𝙏𝙄𝙑𝙀 🛡️
╚════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ অটো রিমুভ সম্পন্ন হয়েছে!
┃
┃  👤 রিমুভকৃত সদস্য: ${removedUsers.join(', ')}
┃  📊 মোট রিমুভ: ${successCount} জন
${failCount > 0 ? `┃  ❌ ব্যর্থ: ${failCount} জন` : ''}
┃
┃  ⚠️ Anti Join মোড সক্রিয় আছে!
┃  💡 বন্ধ করতে এডমিনের সাহায্য নিন।
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🕒 সময়: ${currentTime}
🚩 𝙈𝙖𝙙𝙚 𝙗𝙮 𝙏𝙊𝙃𝙄𝘿𝙐𝙇
`;
    } else {
      notificationMsg = `
╔════════════════════════════╗
  🚫 𝘼𝙉𝙏𝙄 𝙅𝙊𝙄𝙉 𝙒𝘼𝙍𝙉𝙄𝙉𝙂 🚫
╚════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🛡️ গ্রুপে Anti Join মোড চালু রয়েছে!
┃
┃  👤 নতুন সদস্য অ্যাড করা যাবে না।
┃  ❌ রিমুভ করতে ব্যর্থ হয়েছে।
┃  
┃  ⚠️ দয়া করে আগে Anti Join মোড বন্ধ করুন,
┃     তারপর সদস্য অ্যাড করুন।
┃
┃  💡 Anti Join এখন অটো বন্ধ হয়ে গেছে।
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🕒 সময়: ${currentTime}
🚩 𝙈𝙖𝙙𝙚 𝙗𝙮 𝙏𝙊𝙃𝙄𝘿𝙐𝙇
`;
    }

    return api.sendMessage(notificationMsg, threadID);

  } catch (error) {
    console.error('AntiJoin Error:', error);
    
    // Send error notification
    const errorMsg = `
╔════════════════════════════╗
  ❌ 𝘼𝙉𝙏𝙄 𝙅𝙊𝙄𝙉 𝙀𝙍𝙍𝙊𝙍 ❌
╚════════════════════════════╝

⚠️ Anti Join প্রসেসিং এ সমস্যা হয়েছে।
🔧 এডমিনকে জানান বা আবার চেষ্টা করুন।

🚩 𝙈𝙖𝙙𝙚 𝙗𝙮 𝙏𝙊𝙃𝙄𝘿𝙐𝙇
`;
    
    return api.sendMessage(errorMsg, event.threadID);
  }
}
