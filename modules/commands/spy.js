const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "spy",
    version: "1.2.0",
    hasPermission: 0,
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "🔍 Get detailed user information with style 🌟",
    commandCategory: "information",
    cooldowns: 10,
  },

  run: async function ({ event, Users, api, args }) {
    const uidSelf = event.senderID;
    const uidMention = Object.keys(event.mentions)[0];
    let uid;

    // UID extraction logic
    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) uid = match[1];
      }
    }
    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uidMention || uidSelf;
    }

    // Baby teach API
    let babyTeach = 0;
    try {
      const response = await axios.get(`${await baseApiUrl()}/baby?list=all`);
      const dataa = response.data || { teacher: { teacherList: [] } };
      if (dataa?.teacher?.teacherList?.length) {
        babyTeach = dataa.teacher.teacherList.find((t) => t[uid])?.[uid] || 0;
      }
    } catch (e) {
      babyTeach = 0;
    }

    // User info
    const userInfo = await api.getUserInfo(uid);
    const userData = userInfo[uid];
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Gender style
    let genderText = "⚧️ 𝙂𝙚𝙣𝙙𝙚𝙧: 𝙐𝙣𝙠𝙣𝙤𝙬𝙣";
    switch (userData.gender) {
      case 1: genderText = "👩‍🦰 𝙂𝙞𝙧𝙡"; break;
      case 2: genderText = "👨‍🦱 𝘽𝙤𝙮"; break;
      default: genderText = "🌈 𝙊𝙩𝙝𝙚𝙧";
    }
    // Birthday styling
    const birthdayText = userData.birthday
      ? `🎂 𝘽𝙞𝙧𝙩𝙝𝙙𝙖𝙮: ${userData.birthday}`
      : (userData.isBirthday !== false ? `🎂 𝘽𝙞𝙧𝙩𝙝𝙙𝙖𝙮: ${userData.isBirthday}` : "🎂 𝘽𝙞𝙧𝙩𝙝𝙙𝙖𝙮: 𝙋𝙧𝙞𝙫𝙖𝙩𝙚");

    // Money and rank
    const userDb = await Users.getData(uid);
    const allUser = await Users.getAll();
    const rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1;
    const moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;

    // Position
    const position = userData.type ? `👑 ${userData.type.toUpperCase()}` : "🙎‍♂️ 𝙉𝙤𝙧𝙢𝙖𝙡 𝙐𝙨𝙚𝙧";

    // Extra: Account creation date
    let createDate = "⏳ 𝙉𝙤𝙩 𝙋𝙪𝙗𝙡𝙞𝙘";
    try {
      // This endpoint may change or fail if Facebook API restricts
      const infoRes = await axios.get(`https://graph.facebook.com/${uid}?fields=created_time&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
      if (infoRes.data.created_time) {
        createDate = `📅 𝘼𝙘𝙘𝙤𝙪𝙣𝙩 𝘾𝙧𝙚𝙖𝙩𝙚𝙙: ${new Date(infoRes.data.created_time).toLocaleDateString("en-GB")}`;
      }
    } catch (e) { /* ignore if not public */ }

    // Extra: Last post link
    let lastPost = "🔗 𝙉𝙤 𝙥𝙤𝙨𝙩 𝙛𝙤𝙪𝙣𝙙/𝙣𝙤 𝙥𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣";
    try {
      // "posts" edge requires special permissions, may fail
      const postRes = await axios.get(`https://graph.facebook.com/${uid}/posts?limit=1&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
      if (postRes.data?.data?.length > 0) {
        lastPost = `🔗 𝙇𝙖𝙨𝙩 𝙋𝙤𝙨𝙩: https://facebook.com/${postRes.data.data[0].id}`;
      }
    } catch (e) { /* ignore if not public */ }

    // Name, Nick, Profile, etc.
    const userInformation =
`╔════════ ≪ •❈• ≫ ════════╗
                ✨ 𝑼𝑺𝑬𝑹 𝑰𝑵𝑭𝑶 ✨
╚════════ ≪ •❈• ≫ ════════╝

🪪 𝙉𝙖𝙢𝙚: ${userData.name}
🦄 𝙉𝙞𝙘𝙠𝙉𝙖𝙢𝙚: ${userData.alternateName || "𝙉𝙤𝙣𝙚"}
🆔 𝙐𝙄𝘿: ${uid}
${position}
🔗 𝙐𝙨𝙚𝙧𝙣𝙖𝙢𝙚: ${userData.vanity ? userData.vanity : "𝙉𝙤𝙣𝙚"}
${genderText}
${birthdayText}
${createDate}
${lastPost}
🤝 𝙁𝙧𝙞𝙚𝙣𝙙 𝙬𝙞𝙩𝙝 𝘽𝙤𝙩: ${userData.isFriend ? "𝙔𝙚𝙨 ✅" : "𝙉𝙤 ❎"}
🌐 𝙋𝙧𝙤𝙛𝙞𝙡𝙚: ${userData.profileUrl}

╔════════ ≪ •❈• ≫ ════════╗
               📊 𝑺𝑻𝑨𝑻𝑺 📊
╚════════ ≪ •❈• ≫ ════════╝

💸 𝙈𝙤𝙣𝙚𝙮: $${formatMoney(userDb.money)}
🏆 𝙍𝙖𝙣𝙠: #${rank}/${allUser.length}
💰 𝙈𝙤𝙣𝙚𝙮 𝙍𝙖𝙣𝙠: #${moneyRank}/${allUser.length}
👶 𝘽𝙖𝙗𝙮 𝙏𝙚𝙖𝙘𝙝: ${babyTeach || 0}

━━━━━━━━━━━━━━━━━━━━━━
🔰 𝑴𝒂𝒅𝒆 𝒃𝒚: 𝑻𝑶𝑯𝑰𝑫𝑼𝑳
━━━━━━━━━━━━━━━━━━━━━━
`;

    // Get avatar as stream and send
    const avatarStream = (await axios.get(avatarUrl, { responseType: "stream" })).data;
    api.sendMessage({
      body: userInformation,
      attachment: avatarStream,
    }, event.threadID, event.messageID);
  },
};

function formatMoney(num) {
  if (!num || isNaN(num)) return "0";
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}
