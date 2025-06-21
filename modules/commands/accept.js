module.exports.config = {
	usePrefix: true,
  name: "accept",
  version: "2.0.0",
  permission: 3,
  credits: "TOHI-BOT-HUB",
  prefix: true,
  description: "🤝 Accept or delete Facebook friend requests! 🌟",
  commandCategory: "Admin",
  category: "admin",
  usages: "uid",
  cooldowns: 0
};

const stylish = (txt) => `『✦』${txt.split('').join(' ')}『✦』`; // Simple stylish font generator

const emojis = ["✨", "🌈", "🌟", "🔥", "💎", "🤍", "🤩", "🦄", "🎉", "⚡"];

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;

  const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  const success = [];
  const failed = [];

  let action, stylishAction;
  if (args[0] == "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
    action = "accepted";
    stylishAction = "🤝 𝐀𝐜𝐜𝐞𝐩𝐭𝐞𝐝";
  }
  else if (args[0] == "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
    action = "deleted";
    stylishAction = "⛔ 𝐃𝐞𝐥𝐞𝐭𝐞𝐝";
  }
  else return api.sendMessage("⚠️ | Please reply with 'add' or 'del', then number or 'all'.", event.threadID, event.messageID);

  let targetIDs = args.slice(1);

  if (args[1] == "all") {
    targetIDs = [];
    const lengthList = listRequest.length;
    for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
  }

  const newTargetIDs = [];
  const promiseFriends = [];

  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`❌ stt ${stt} not found`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    form.variables = JSON.stringify(form.variables);
    newTargetIDs.push(u);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(form.variables);
  }

  for (let i = 0; i < newTargetIDs.length; i++) {
    try {
      const friendRequest = await promiseFriends[i];
      if (JSON.parse(friendRequest).errors) failed.push(`❌ ${newTargetIDs[i].node.name}`);
      else success.push(`✅ ${newTargetIDs[i].node.name}`);
    }
    catch (e) {
      failed.push(`❌ ${newTargetIDs[i].node.name}`);
    }
  }

  let msg = `\n${randomEmoji()} ${stylishAction} friend requests for ${success.length} people:\n${stylish(success.join("\n"))}`;
  if (failed.length > 0) {
    msg += `\n\n${randomEmoji()} Failed for ${failed.length}:\n${stylish(failed.join("\n"))}`;
  }
  msg += `\n\n${randomEmoji()} 𝙎𝙩𝙖𝙮 𝙎𝙩𝙮𝙡𝙞𝙨𝙝!`;
  msg += `\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`;

  api.sendMessage(msg, event.threadID, event.messageID);
};

module.exports.run = async ({ event, api }) => {
  const moment = require("moment-timezone");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };
  const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
  let msg = `${randomEmoji()} 𝑭𝒓𝒊𝒆𝒏𝒅 𝑹𝒆𝒒𝒖𝒆𝒔𝒕 𝑳𝒊𝒔𝒕 ${randomEmoji()}\n━━━━━━━━━━━━━━━`;
  let i = 0;
  for (const user of listRequest) {
    i++;
    msg += `\n${randomEmoji()} ${stylish(i + ".")}\n👤 𝙉𝙖𝙢𝙚: ${user.node.name}\n🆔 𝙄𝘿: ${user.node.id}\n🔗 𝙐𝙍𝙇: ${user.node.url.replace("www.facebook", "fb")}\n🕰️ 𝙏𝙞𝙢𝙚: ${moment(user.time * 1009).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n━━━━━━━━━━━━━━━`;
  }
  msg += `\n${randomEmoji()} Reply with: [add/del] [number/all]\nExample: add 1 | del all`;
  msg += `\n\n🛠️ 𝑴𝒂𝒅𝒆 𝒃𝒚 𝒕𝒐𝒉𝒊𝒅𝒖𝒍`;

  api.sendMessage(msg, event.threadID, (e, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      listRequest,
      author: event.senderID
    });
  }, event.messageID);
};