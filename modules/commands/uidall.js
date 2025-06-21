module.exports.config = {
  name: "uidall",
  version: "1.0.5",
  hasPermssion: 0,
  usePrefix: true,
  credits: "Deku",
  description: "Get all uid and names in Group.",
  commandCategory: "...",
  cooldowns: 2,
};
module.exports.run = async function ({ api, event, args, Users }) {

function reply(d) {
  api.sendMessage(d, event.threadID, event.messageID)
}
var ep = event.participantIDs;
msg = ""
msgs = ""
m = 0;
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
      console.log(`[UIDALL] Users.getNameUser error for ${userId}: ${userError.message}`);
    }
    
    // Fallback with better naming
    const shortId = userId.slice(-6);
    return `User_${shortId}`;
  } catch (error) {
    console.log(`[UIDALL] Error getting user name for ${userId}: ${error.message}`);
    const shortId = userId.slice(-6);
    return `User_${shortId}`;
  }
}

for (let i of ep) {
  m += 1;
  const name = await getUserName(i);
  msg += m+". "+name+"\nUID: "+i+"\nFacebook link: https://facebook.com/"+i+"\n\n";
}
msgs += "List of all UID's in this group.\n\n"+msg;
reply(msgs)
}