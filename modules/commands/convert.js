module.exports.config = {
    name: "convert",
    version: "1.0.0",
    permission: 0,
    credits: "TOHI-BOT-HUB",
    usePrefix: true,
    description: "",
    commandCategory: "user",
    usages: "",
    cooldowns: 0
};
module.exports.run = async function ({ api, args, event }) {
  try{
    const axios = require("axios");
    const fs = require("fs-extra");
    var audioss = [];
    var audio = args.join(" ") || (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0]?.url);
    if (!audio) return api.sendMessage("⚠️ দয়া করে অডিও লিংক দিন অথবা কোনো অডিও রিপ্লাই করুন!", event.threadID, event.messageID);

    var { data } = await axios.get(audio, { method: 'GET', responseType: 'arraybuffer' });
    fs.writeFileSync(__dirname + "/cache/vdtoau.m4a", Buffer.from(data, 'utf-8'));
    audioss.push(fs.createReadStream(__dirname + "/cache/vdtoau.m4a"));

    // Same font style as previous: Mathematical Sans-Serif Bold
    const fancy = (text) => text
      .replace(/A/gi, c => c === 'A' ? '𝗔' : '𝗮')
      .replace(/B/gi, c => c === 'B' ? '𝗕' : '𝗯')
      .replace(/C/gi, c => c === 'C' ? '𝗖' : '𝗰')
      .replace(/D/gi, c => c === 'D' ? '𝗗' : '𝗱')
      .replace(/E/gi, c => c === 'E' ? '𝗘' : '𝗲')
      .replace(/F/gi, c => c === 'F' ? '𝗙' : '𝗳')
      .replace(/G/gi, c => c === 'G' ? '𝗚' : '𝗴')
      .replace(/H/gi, c => c === 'H' ? '𝗛' : '𝗵')
      .replace(/I/gi, c => c === 'I' ? '𝗜' : '𝗶')
      .replace(/J/gi, c => c === 'J' ? '𝗝' : '𝗷')
      .replace(/K/gi, c => c === 'K' ? '𝗞' : '𝗸')
      .replace(/L/gi, c => c === 'L' ? '𝗟' : '𝗹')
      .replace(/M/gi, c => c === 'M' ? '𝗠' : '𝗺')
      .replace(/N/gi, c => c === 'N' ? '𝗡' : '𝗻')
      .replace(/O/gi, c => c === 'O' ? '𝗢' : '𝗼')
      .replace(/P/gi, c => c === 'P' ? '𝗣' : '𝗽')
      .replace(/Q/gi, c => c === 'Q' ? '𝗤' : '𝗾')
      .replace(/R/gi, c => c === 'R' ? '𝗥' : '𝗿')
      .replace(/S/gi, c => c === 'S' ? '𝗦' : '𝘀')
      .replace(/T/gi, c => c === 'T' ? '𝗧' : '𝘁')
      .replace(/U/gi, c => c === 'U' ? '𝗨' : '𝘂')
      .replace(/V/gi, c => c === 'V' ? '𝗩' : '𝘃')
      .replace(/W/gi, c => c === 'W' ? '𝗪' : '𝘄')
      .replace(/X/gi, c => c === 'X' ? '𝗫' : '𝘅')
      .replace(/Y/gi, c => c === 'Y' ? '𝗬' : '𝘆')
      .replace(/Z/gi, c => c === 'Z' ? '𝗭' : '𝘇');

    var msg = { 
      body : fancy("TBH-Convert song MP3  🎶\n TOHIDUL"),
      attachment: audioss
    };
    api.sendMessage(msg, event.threadID, event.messageID);
  } catch(e){
    console.log(e);
    api.sendMessage("❌ কনভার্ট করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
