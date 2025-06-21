module.exports.config = {
    commandCategory: "Utility",
  name: "surah",
  version: "0.0.3",
  permission: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Get Quran Surah by number (1-114)",
  category: "user",
  usages: "surah <number 1-114>",
  cooldowns: 5,
};

const axios = require("axios");

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // Check if argument is valid number
  if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > 114) {
    return api.sendMessage(
      "📖 Please provide a valid surah number (1-114).\nUsage: surah <number>",
      threadID,
      messageID
    );
  }

  const surahNum = args[0];

  try {
    // Example public API, you can change to a better one if you want
    const res = await axios.get(`https://api.quran.sutanlab.id/surah/${surahNum}`);

    if (!res.data || !res.data.data) {
      return api.sendMessage("❌ Could not fetch surah information.", threadID, messageID);
    }

    const surah = res.data.data;
    let response =
      `🕌 Surah: ${surah.name.transliteration.en} (${surah.name.short})\n` +
      `🔢 Surah Number: ${surah.number.short}\n` +
      `📝 Meaning: ${surah.name.translation.en}\n` +
      `🔤 Arabic: ${surah.name.long}\n` +
      `📃 Total Verses: ${surah.numberOfVerses}\n` +
      `📖 Revelation Place: ${surah.revelation.en}\n\n` +
      `🌟 Bismillah: ${surah.preBismillah ? surah.preBismillah.text.arab : "N/A"}\n\n` +
      `🔽 First 3 Ayahs:\n`;

    for (let i = 0; i < Math.min(3, surah.numberOfVerses); i++) {
      const ayah = surah.verses[i];
      response += `\n${i + 1}. ${ayah.text.arab}\n   ➡️ ${ayah.translation.en}`;
    }

    response += `\n\n🔗 More: https://quran.com/${surah.number.short}`;

    return api.sendMessage(response, threadID, messageID);
  } catch (err) {
    return api.sendMessage("❌ Error fetching surah. Please try again later.", threadID, messageID);
  }
};
