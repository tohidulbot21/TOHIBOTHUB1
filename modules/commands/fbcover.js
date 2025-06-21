const axios = require('axios');
const fs = require("fs");

module.exports.config = {
  name: "fbcover",
  version: "1.0.0",
  permssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "",
  commandCategory: "fbcover",
  usePrefix: true,
    cooldowns: 2,
};

  module.exports.run = async function({ api, event, args, Users, Threads, Currencies}) {
    const uid = event.senderID;
    const info = args.join(" ");
    const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json')
  const n = apis.data.api
    var id = Object.keys(event.mentions)[0] || event.senderID;
  var nam = await Users.getNameUser(id);
  var ThreadInfo = await api.getThreadInfo(event.threadID);
    if (!info) {
      return api.sendMessage("Please enter in the format:\nfbcover name - subname - address - email - phone nbr - color (default = no )", event.threadID);
    } else {
      const msg = info.split("-");
      const name = msg[0].trim();
      const subname = msg[1].trim();
      const address = msg[2].trim();
      const email = msg[3].trim();
      const phone = msg[4].trim();
      const color = msg[5].trim();

      api.sendMessage(`Processing your cover, please wait...`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));

      const img = `${n}/fbcover/v1?name=${encodeURIComponent(name)}&uid=${id}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color)}`;

      try {
        const response = await axios.get(img, { responseType: 'stream' });
        const outputPath = `./modules/commands/cache/fbcover_${uid}.png`;
        
        response.data.pipe(fs.createWriteStream(outputPath))
          .on('close', () => {
            const attachment = fs.createReadStream(outputPath);
            api.sendMessage({ 
              body: `◆━━━━━━━━◆◆━━━━━━━━◆\n🔴INPUT NAME: ${name}\n🔵INPUT SUBNAME: ${subname}\n📊ADDRESS: ${address}\n✉️EMAIL: ${email}\n☎️PHON NO.: ${phone}\n🎇COLOUR: ${color}\n🆔ID: ${nam}\n◆━━━━━━━━◆◆━━━━━━━━◆`,
              attachment
            }, event.threadID, () => fs.unlinkSync(outputPath));
          })
          .on('error', (error) => {
            console.error('Download error:', error);
            api.sendMessage("An error occurred while generating the FB cover.", event.threadID);
          });
      } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while generating the FB cover.", event.threadID);
      }
    }
  };