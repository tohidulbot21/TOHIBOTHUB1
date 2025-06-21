
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "botAddNotification",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "TOHI-BOT-HUB",
  description: "Notify admins when bot is added to new groups"
};

module.exports.run = async function({ api, event }) {
  try {
    const { threadID, logMessageData } = event;
    
    // Check if bot was added
    const botID = api.getCurrentUserID();
    if (!logMessageData || !logMessageData.addedParticipants) return;
    
    const botAdded = logMessageData.addedParticipants.find(participant => 
      participant.userFbId === botID
    );
    
    if (!botAdded) return;
    
    console.log(`🤖 Bot added to new group: ${threadID}`);
    
    // Get group information
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (error) {
      console.error('Error getting thread info:', error);
      threadInfo = { threadName: 'Unknown Group', participantIDs: [] };
    }
    
    const groupName = threadInfo.threadName || 'Unknown Group';
    const memberCount = threadInfo.participantIDs?.length || 0;
    const currentTime = new Date().toLocaleString('bn-BD', { 
      timeZone: 'Asia/Dhaka',
      hour12: false 
    });
    
    // Create admin notification message
    const adminNotification = `
╔══════════════════════════════╗
    🔔 নতুন গ্রুপ NOTIFICATION 🔔
╚══════════════════════════════╝

🤖 Bot একটি নতুন গ্রুপে add হয়েছে!

┌─── 📊 গ্রুপ তথ্য ───┐
│ 📝 Name: ${groupName}
│ 🆔 ID: ${threadID}
│ 👥 Members: ${memberCount} জন
│ ⏰ Added: ${currentTime}
└─────────────────────────────┘

┌─── ⚡ Actions ───┐
│ ✅ Approve: ${global.config.PREFIX || '.'}approve ${threadID}
│ ❌ Reject: ${global.config.PREFIX || '.'}approve reject ${threadID}
│ 📋 Check: ${global.config.PREFIX || '.'}approve pending
└─────────────────────────────┘

⚠️ গ্রুপটি approved না হওয়া পর্যন্ত bot commands কাজ করবে না।

🚩 TOHI-BOT ADMIN PANEL`;

    // Send notification to all admins
    if (global.config.ADMINBOT && Array.isArray(global.config.ADMINBOT)) {
      let successCount = 0;
      let failCount = 0;
      
      for (const adminID of global.config.ADMINBOT) {
        try {
          await api.sendMessage(adminNotification, adminID);
          successCount++;
          console.log(`✓ Admin notification sent successfully to: ${adminID}`);
        } catch (error) {
          failCount++;
          console.error(`✗ Failed to send notification to admin ${adminID}:`, error.message);
          
          // Try alternative notification method
          try {
            const shortMsg = `🔔 Bot নতুন গ্রুপে add: ${groupName} (${threadID})\n✅ Approve: ${global.config.PREFIX || '.'}approve ${threadID}`;
            await api.sendMessage(shortMsg, adminID);
            console.log(`✓ Fallback notification sent to: ${adminID}`);
          } catch (fallbackError) {
            console.error(`✗ Fallback notification also failed for ${adminID}:`, fallbackError.message);
          }
        }
        
        // Add small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`📊 Admin notifications: ${successCount} successful, ${failCount} failed`);
    } else {
      console.log('⚠️ No admin IDs configured in config.json ADMINBOT array');
    }
    
  } catch (error) {
    console.error('Error in botAddNotification event:', error);
  }
};
