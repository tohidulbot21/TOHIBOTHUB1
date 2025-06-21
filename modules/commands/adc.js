module.exports.config = {
  name: "adc",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "TOHI-BOT-HUB",
  description: "✏️ নতুন কোড যুক্ত করুন: /adc [নাম] + কোড",
  usePrefix: true,
  commandCategory: "admin",
  usages: "/adc [নাম] + কোড",
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID, messageID, body, senderID } = event;

  // Check if user is admin
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("❌ আপনার এই কমান্ড ব্যবহারের অনুমতি নেই!", threadID, messageID);
  }

  // শুধুমাত্র যদি কোড message-এ paste করা হয়
  // /adc commandName
  // function code here...
  if (!args[0]) {
    return api.sendMessage(
      "❌ দয়া করে কমান্ড নাম লিখুন!\nউদাহরণ: /adc mycmd",
      threadID,
      messageID
    );
  }

  // কোড অংশ বের করা (command নাম বাদে)
  const bodyParts = body.split(" ");
  if (bodyParts.length < 3) {
    return api.sendMessage(
      "❌ দয়া করে কমান্ড কোডটি দিয়েই পাঠান!\nযেমন:\n/adc hello module.exports.config = {...}",
      threadID,
      messageID
    );
  }

  let code = bodyParts.slice(2).join(" ");
  if (!code.trim()) {
    return api.sendMessage(
      "❌ দয়া করে কমান্ড কোডটি দিয়েই পাঠান!\nযেমন:\n/adc hello module.exports.config = {...}",
      threadID,
      messageID
    );
  }

  // ফাইল path ঠিক করা
  const fileName = `${args[0]}.js`;
  const commandFolder = path.join(__dirname);
  const filePath = path.join(commandFolder, fileName);

  // ফাইল যদি আগে থেকেই থাকে
  if (fs.existsSync(filePath)) {
    return api.sendMessage(`⚠️ ${fileName} আগে থেকেই আছে!`, threadID, messageID);
  }

  // ফাইল তৈরি এবং কোড লেখা
  fs.writeFile(filePath, code, "utf-8", (err) => {
    if (err) {
      return api.sendMessage(
        `❌ ফাইল সংরক্ষণে সমস্যা: ${fileName}`,
        threadID,
        messageID
      );
    }
    return api.sendMessage(
      `✅ নতুন কমান্ড যুক্ত হয়েছে: ${fileName}\n\nℹ️ এখন 'load' কমান্ড দিয়ে ব্যবহার করুন!\n\n🛠️ Made by tohidul`,
      threadID,
      messageID
    );
  });
};