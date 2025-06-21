module.exports.config = {
	name: "uid2",
	version: "1.0.0",
	permission: 0,
	credits: "TOHI-BOT-HUB",
	usePrefix: true,
	description: "get user id.",
	commandCategory: "utility",
	cooldowns: 5
};

module.exports.run = async function({ event, api, args, client, Currencies, Users, utils, __GLOBAL, reminder }) {
const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const axios = global.nodemodule['axios']; 
    
    // Helper function to get user name with fallback
    async function getUserName(userId) {
      try {
        // First check usersData.json
        const userData = await Users.getData(userId);
        if (userData && userData.name && userData.name !== 'undefined' && userData.name.trim() && !userData.name.startsWith('User')) {
          return userData.name;
        }
        
        // Try to get name using Users.getNameUser
        try {
          const name = await Users.getNameUser(userId);
          if (name && name !== 'undefined' && !name.startsWith('User-') && name.trim()) {
            return name;
          }
        } catch (userError) {
          console.log(`[UID] Users.getNameUser error for ${userId}: ${userError.message}`);
        }
        
        // Fallback with better naming
        const shortId = userId.slice(-6);
        return `User_${shortId}`;
      } catch (error) {
        console.log(`[UID] Error getting user name for ${userId}: ${error.message}`);
        const shortId = userId.slice(-6);
        return `User_${shortId}`;
      }
    }
    
    if(event.type == "message_reply") { 
      let name = await getUserName(event.messageReply.senderID);
	uid = event.messageReply.senderID
	var callback = () =>   api.sendMessage({body:`=== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ 𝗜𝗗: ${uid}\n[ ▶️]➜ 𝗜𝗕: m.me/${uid}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗳𝗯: https://www.facebook.com/profile.php?id=${uid}\n━━━━━━━━━━━━━━━━━━`, attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback()); 
    }
    if (!args[0]) {
      var uid = event.senderID;
 
        var callback = () =>  api.sendMessage({body:`=== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ 𝗜𝗗: ${event.senderID}\n[ ▶️]➜ 𝗜𝗕: m.me/${event.senderID}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗳𝗯: https://www.facebook.com/profile.php?id=${event.senderID}\n━━━━━━━━━━━━━━━━━━`, attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback()); 
    }
    else {
	if (args[0].indexOf(".com/")!==-1) {
    const res_ID = await api.getUID(args[0]);
   var name = data.name
var data = await api.getUserInfoV2(res_ID);
    var username = data.username
    var link = data.link
    var callback = () => api.sendMessage({body:`=== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ 𝗜𝗗: ${res_ID}\n[ ▶️]➜ 𝗜𝗕: m.me/${res_ID}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗳𝗯: ${link}\n━━━━━━━━━━━━━━━━━━`, attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${res_ID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback()); }
	else {
		if (args.join().indexOf('@') !== -1) 
      var uid = Object.keys(event.mentions) 
      var callback = () => 
api.sendMessage({body:`=== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ 𝗜𝗗: ${uid}\n[ ▶️]➜ 𝗜𝗕: m.me/${uid}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗳𝗯: https://www.facebook.com/profile.php?id=${uid}\n━━━━━━━━━━━━━━━━━━`, attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback()); 
               
	}
}
}