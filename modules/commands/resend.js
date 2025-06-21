const main = "100092006324917";

module.exports.config = {
  name: "resend",
  version: "2.0.0",
  permssion: 1,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "admin",
  usePrefix: true,
  usages: "resend",
  cooldowns: 0,
  hide: true,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

// Message cache for unsend detection
if (!global.resendCache) global.resendCache = new Map();

module.exports.handleEvent = async function({ event, api, Users }) {
  const { messageID, senderID, threadID, body, attachments = [], type } = event;

  // Get thread data
  if (!global.data) global.data = {};
  if (!global.data.botID) global.data.botID = api.getCurrentUserID();
  if (!global.data.threadData) global.data.threadData = new Map();

  // Per-thread resend setting
  const threadData = global.data.threadData.get(parseInt(threadID)) || {};

  // If resend is off for this thread, skip
  if (typeof threadData.resend === "boolean" && threadData.resend === false) return;

  // Don't cache bot's own messages
  if (senderID == global.data.botID) return;

  // Store message info for later
  if (type === "message") {
    global.resendCache.set(messageID, {
      msgBody: body,
      attachment: attachments
    });
  }

  // On unsend
  if (type === "message_unsend") {
    const cached = global.resendCache.get(messageID);
    if (!cached) return;

    const senderName = await Users.getNameUser(senderID);
    
    // Send to both group and main admin
    const sendTo = [threadID, main];
    
    for (const target of sendTo) {
      try {
        // If no attachment, just send text
        if (!cached.attachment || cached.attachment.length === 0) {
          await api.sendMessage(
            `🔄 ${senderName} unsent a message!\n\n📝 Content:\n${cached.msgBody || "No text content"}`,
            target
          );
        } else {
          // Re-send all attachments
          let files = [];
          let i = 0;
          for (const att of cached.attachment) {
            i++;
            // Download attachment
            let fileExt = (att.type === "photo") ? "jpg" :
                          (att.type === "video") ? "mp4" :
                          (att.type === "audio") ? "mp3" :
                          (att.type === "file") ? "bin" : "dat";
            let attPath = path.join(__dirname, `/cache/resend_${Date.now()}_${i}.${fileExt}`);

            try {
              // Download file
              const response = await axios.get(att.url, { responseType: "arraybuffer" });
              fs.writeFileSync(attPath, Buffer.from(response.data));
              files.push(fs.createReadStream(attPath));
            } catch (downloadError) {
              console.log(`[RESEND] Failed to download attachment: ${downloadError.message}`);
            }
          }
          
          if (files.length > 0) {
            await api.sendMessage(
              {
                body: `🔄 ${senderName} unsent a message!\n\n📝 Content:\n${cached.msgBody || "No text content"}\n\n📎 Attachment(s) below:`,
                attachment: files
              },
              target
            );
            
            // Clean up downloaded files
            setTimeout(() => {
              for (const file of files) {
                try {
                  if (file.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                  }
                } catch (cleanupError) {
                  console.log(`[RESEND] Cleanup error: ${cleanupError.message}`);
                }
              }
            }, 5000);
          } else {
            // If files failed to download, send text only
            await api.sendMessage(
              `🔄 ${senderName} unsent a message with attachments!\n\n📝 Content:\n${cached.msgBody || "No text content"}\n\n❌ Attachments could not be recovered.`,
              target
            );
          }
        }
      } catch (sendError) {
        console.log(`[RESEND] Send error to ${target}: ${sendError.message}`);
      }
    }
    
    // Clean up cache after processing
    global.resendCache.delete(messageID);
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const { threadID, messageID } = event;
  const threadData = (await Threads.getData(threadID)).data;
  // Toggle
  threadData.resend = !threadData.resend;
  await Threads.setData(parseInt(threadID), { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);
  api.sendMessage(
    `Resend is now ${threadData.resend ? "ON" : "OFF"} for this thread!\nUse again to toggle.`,
    threadID,
    messageID
  );
};
