module.exports.config = {
  name: "age2",
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "Made by Tohidul ✨",
  description: "Calculate your age in detail with style and emojis.",
  commandCategory: "Date Calculation",
  usages: "<day/month/year of birth>",
  cooldowns: 0
};

module.exports.run = function ({ event, args, api }) {
  const input = args[0];
  if (!input) {
    return api.sendMessage(
      `💡 Please enter your birth date in the correct format:\n\n➤ age <day/month/year> 🗓️\n\nExample: age 12/10/2000`,
      event.threadID,
      event.messageID
    );
  } else {
    const moment = require("moment-timezone");
    const today = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
    
    // Validate input format
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
      return api.sendMessage(
        "❌ Invalid date format! Please use DD/MM/YYYY format.\n\nExample: 12/10/2000",
        event.threadID,
        event.messageID
      );
    }
    try {
      // Parse the birth date
      const [day, month, year] = input.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const currentDate = moment.tz("Asia/Ho_Chi_Minh").toDate();
      
      // Validate the birth date
      if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
        return api.sendMessage(
          "❌ Invalid birth date! Please use the format DD/MM/YYYY with a valid past date.",
          event.threadID,
          event.messageID
        );
      }
      
      // Calculate differences
      const diffMs = currentDate - birthDate;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      
      // Calculate years and months more accurately
      let years = currentDate.getFullYear() - birthDate.getFullYear();
      let months = currentDate.getMonth() - birthDate.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (currentDate.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
          years--;
          months += 12;
        }
      }
      
      const msg = `
╔═════════════ ⏳ ═════════════╗
   𝓢𝓣𝓨𝓛𝓘𝓢𝓗 𝓐𝓖𝓔 𝓒𝓐𝓛𝓒𝓤𝓛𝓐𝓣𝓞𝓡
╚═════════════════════════════╝

🎂 Date of Birth:  ${input}

🗓️ Until Today:  ${today}

━━━━━━━━━━━━━━━━━━━━━━
⏳ Years:      ${years}
⏳ Months:     ${months}
⏳ Weeks:      ${diffWeeks}
⏳ Days:       ${diffDays}
⏳ Hours:      ${diffHours}
⏳ Minutes:    ${diffMinutes}
⏳ Seconds:    ${diffSeconds}
━━━━━━━━━━━━━━━━━━━━━━
✨ Made by Tohidul ✨
`;
      return api.sendMessage(msg, event.threadID, event.messageID);
      
    } catch (error) {
      console.log(`[AGE2] Calculation error: ${error.message}`);
      return api.sendMessage(
        "❌ Error calculating age! Please check your date format (DD/MM/YYYY) and try again.",
        event.threadID,
        event.messageID
      );
    }
  }
};