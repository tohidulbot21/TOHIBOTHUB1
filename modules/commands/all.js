module.exports.config = {
  name: "all",
  version: "1.0.4",
  hasPermssion: 1,
  credits: "Made by Tohidul",
  description: "Tag all members in the group.",
  commandCategory: "system",
  usages: "[Text]",
  cooldowns: 80,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  try {
    const botID = api.getCurrentUserID();
    // Exclude bot itself and sender from mentions
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
    // Stylish default message with emoji
    var body = (args.length !== 0) 
      ? args.join(" ") 
      : "🚨 Attention everyone! 🚨\n\nYou have been tagged by an admin.\nLet's join the conversation! ✨";
    let mentions = [], index = 0;

    for(const idUser of listUserID) {
      mentions.push({ id: idUser, tag: "@" + idUser, fromIndex: index });
      index += 1;
    }

    return api.sendMessage({ body, mentions }, event.threadID, event.messageID);

  } catch (e) { 
    console.log(e); 
    return api.sendMessage("⚠️ An error occurred while tagging all members.", event.threadID, event.messageID);
  }
};