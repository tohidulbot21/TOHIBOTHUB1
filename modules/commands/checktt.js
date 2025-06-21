module.exports.config = {
  name: "checktt",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "📊 Stylish message counter with beautiful formatting",
  usePrefix: true,
  commandCategory: "message",
  usages: "[tag/reply/all/all number/all box]",
  cooldowns: 5,
};

module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const pathA = require('path');
    const path = pathA.join(__dirname, 'cache', 'checktt.json');
    if (!existsSync(path)) {
        const obj = []
        writeFileSync(path, JSON.stringify(obj, null, 4));
    }
}

// Stylish font transformation functions
function toStylishFont(text) {
    if (!text || typeof text !== 'string') {
        return text || '';
    }
    const fontMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
        'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
        'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
        'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
        's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(char => fontMap[char] || char).join('');
}

function toItalicFont(text) {
    if (!text || typeof text !== 'string') {
        return text || '';
    }
    const fontMap = {
        'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐',
        'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
        'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
        'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪',
        'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
        's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
    };
    return text.split('').map(char => fontMap[char] || char).join('');
}

// Create decorative border
function createBorder(text, type = 'default') {
    const borders = {
        default: '═══════════════════════════════',
        double: '╔══════════════════════════════╗',
        star: '✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*',
        wave: '～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～',
        diamond: '◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆'
    };
    return borders[type] || borders.default;
}

// Get rank emoji based on position
function getRankEmoji(rank) {
    const emojis = {
        1: '👑', 2: '🥈', 3: '🥉', 4: '🏅', 5: '⭐',
        6: '🌟', 7: '✨', 8: '💫', 9: '🔥', 10: '💎'
    };
    return emojis[rank] || (rank <= 20 ? '🎖️' : '📝');
}

// Get interaction level emoji
function getInteractionEmoji(percentage) {
    if (percentage >= 20) return '🔥';
    if (percentage >= 15) return '💪';
    if (percentage >= 10) return '⚡';
    if (percentage >= 5) return '✨';
    if (percentage >= 1) return '💬';
    return '📝';
}

module.exports.handleEvent = async({ event, Users }) => {
    const { threadID, senderID, body } = event;
    const fs = require("fs");
    const pathA = require('path');
    const thread = require('./cache/checktt.json');
    const path = pathA.join(__dirname, 'cache', 'checktt.json');

    if(event.isGroup == false) return;

    function isIterable(obj) {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    if(isIterable(event.participantIDs) == false) return
    if(event.type == "message_reply") return;

    if (thread.some(i => i.threadID == threadID) == false) {
        const data = [];
        for (let user of event.participantIDs) {
            try {
                var name = (await Users.getData(user)).name;
                var id = user;
                var exp = 0;
                if(name != 'undefined' && name != 'Facebook users') {
                    data.push({ name, id , exp })
                }
            } catch (error) {
                // Skip users that can't be fetched
                continue;
            }
        }
        thread.push({ threadID, data: data });
        fs.writeFileSync(path, JSON.stringify(thread, null, 2));
    }
    else {
        var threadData = thread.find(i => i.threadID == threadID && i.threadID !== undefined)
        if (threadData && threadData.data.some(i => i.id == senderID) == false) {
            try {
                var name = (await Users.getData(senderID)).name;
                var id = senderID;
                var exp = 0;
                threadData.data.push({ name, id, exp });
                fs.writeFileSync(path, JSON.stringify(thread, null, 2));
            } catch (error) {
                // Skip if user data can't be fetched
                return;
            }
        }
        else if (threadData) {
            var userData = threadData.data.find(i => i.id == senderID);
            if (userData) {
                userData.exp = userData.exp + 1;
                fs.writeFileSync(path, JSON.stringify(thread, null, 2));
            }
        }
    }
}

module.exports.run = async function ({ args, api, event }) {
    const { threadID, senderID, messageID, type, mentions } = event;
    var mention = Object.keys(mentions);
    const thread = require('./cache/checktt.json');
    const data = thread.find(i => i.threadID == threadID)

    if (!data) {
        return api.sendMessage("❌ No data found for this group! Send some messages first.", threadID, messageID);
    }

    if (args[0] == "all") {
        var msg = "", exp = [], i = 1, count = 0
        for(const user of data.data) {
            exp.push({ name: user.name, exp: user.exp, id: user.id });
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        var limit = args[2] || 20;
        var page = 1;
        page = parseInt(args[1]) || 1;
        page < -1 ? page = 1 : "";

        // Calculate total messages
        let totalMessages = exp.reduce((sum, user) => sum + user.exp, 0);

        // Create stylish header
        var msg = `${createBorder('', 'star')}\n`;
        msg += `🎯 ${toStylishFont('GROUP MESSAGE LEADERBOARD')} 🎯\n`;
        msg += `${createBorder('', 'star')}\n`;
        msg += `📊 ${toItalicFont('Total Messages')}: ${toStylishFont(totalMessages.toString())} 💬\n`;
        msg += `👥 ${toItalicFont('Active Members')}: ${toStylishFont(exp.length.toString())} 🌟\n`;
        msg += `${createBorder('', 'wave')}\n\n`;

        var numPage = Math.ceil(exp.length/limit);
        for(var i = limit*(page - 1); i < limit*(page-1) + limit; i++){
            if(i >= exp.length) break;
            let dataInfo = exp[i];
            let rank = i + 1;
            let percentage = totalMessages > 0 ? ((dataInfo.exp / totalMessages) * 100).toFixed(1) : 0;
            let rankEmoji = getRankEmoji(rank);
            let interactionEmoji = getInteractionEmoji(percentage);

            // Create progress bar
            let progressBars = Math.floor(percentage / 2);
            let progressBar = '█'.repeat(progressBars) + '░'.repeat(10 - progressBars);

            msg += `${rankEmoji} ${toStylishFont(`#${rank}`)} ┃ ${toItalicFont(dataInfo.name)}\n`;
            msg += `   💬 ${toStylishFont(dataInfo.exp.toString())} messages ${interactionEmoji}\n`;
            msg += `   📈 ${percentage}% ┃ ${progressBar}\n`;
            msg += `${createBorder('', 'diamond').substring(0, 25)}\n`;
        }

        msg += `\n${createBorder('', 'star')}\n`;
        msg += `📄 ${toItalicFont(`Page ${page}/${numPage}`)} 📄\n`;
        msg += `🔄 ${toItalicFont(`Use ${global.config.PREFIX}checktt all <page>`)} 🔄\n`;
        msg += `${createBorder('', 'star')}`;

        return api.sendMessage(msg, threadID, messageID);
    }
    else {
        if(type == "message_reply") { 
            mention[0] = event.messageReply.senderID 
        }

        if (mention[0]) {
            var exp = [], count = 0
            for(const user of data.data) {
                count += user.exp
                exp.push({ name: user.name, exp: user.exp, id: user.id });
            }
            exp.sort(function (a, b) { return b.exp - a.exp });
            const rank = exp.findIndex(i => i.id == mention[0])

            if (rank === -1) {
                return api.sendMessage("❌ User not found in the database!", threadID, messageID);
            }

            let userInfo = exp[rank];
            let percentage = count > 0 ? ((userInfo.exp / count) * 100).toFixed(1) : 0;
            let rankEmoji = getRankEmoji(rank + 1);
            let interactionEmoji = getInteractionEmoji(percentage);

            // Create progress bar
            let progressBars = Math.floor(percentage / 2);
            let progressBar = '█'.repeat(progressBars) + '░'.repeat(10 - progressBars);

            let msg = `${createBorder('', 'double')}\n`;
            msg += `${rankEmoji} ${toStylishFont('USER STATISTICS')} ${rankEmoji}\n`;
            msg += `${createBorder('', 'wave')}\n`;
            msg += `👤 ${toItalicFont('Name')}: ${toStylishFont(userInfo.name)}\n`;
            msg += `🏆 ${toItalicFont('Rank')}: ${toStylishFont(`#${rank + 1}`)} ${rankEmoji}\n`;
            msg += `💬 ${toItalicFont('Messages')}: ${toStylishFont(userInfo.exp.toString())} ${interactionEmoji}\n`;
            msg += `📊 ${toItalicFont('Activity')}: ${toStylishFont(percentage + '%')}\n`;
            msg += `📈 ${toItalicFont('Progress')}: ${progressBar}\n`;
            msg += `${createBorder('', 'diamond')}\n\n`;
            msg += `🚩 ${toItalicFont('Made by TOHIDUL')}`;

            return api.sendMessage(msg, threadID, messageID);
        }
        else {
            var exp = [], count = 0
            for(const user of data.data) {
                count += user.exp
                exp.push({ name: user.name, exp: user.exp, id: user.id });
            }
            exp.sort(function (a, b) { return b.exp - a.exp });
            const rank = exp.findIndex(i => i.id == senderID);

            if (rank === -1) {
                return api.sendMessage("❌ You're not found in the database! Send some messages first.", threadID, messageID);
            }

            let userInfo = exp[rank];
            let percentage = count > 0 ? ((userInfo.exp / count) * 100).toFixed(1) : 0;
            let rankEmoji = getRankEmoji(rank + 1);
            let interactionEmoji = getInteractionEmoji(percentage);

            // Create progress bar
            let progressBars = Math.floor(percentage / 2);
            let progressBar = '█'.repeat(progressBars) + '░'.repeat(10 - progressBars);

            let msg = `${createBorder('', 'double')}\n`;
            msg += `${rankEmoji} ${toStylishFont('YOUR STATISTICS')} ${rankEmoji}\n`;
            msg += `${createBorder('', 'wave')}\n`;
            msg += `👤 ${toItalicFont('Name')}: ${toStylishFont(userInfo.name)}\n`;
            msg += `🏆 ${toItalicFont('Rank')}: ${toStylishFont(`#${rank + 1}`)} ${rankEmoji}\n`;
            msg += `💬 ${toItalicFont('Messages')}: ${toStylishFont(userInfo.exp.toString())} ${interactionEmoji}\n`;
            msg += `📊 ${toItalicFont('Activity')}: ${toStylishFont(percentage + '%')}\n`;
            msg += `📈 ${toItalicFont('Progress')}: ${progressBar}\n`;
            msg += `${createBorder('', 'diamond')}\n\n`;
            msg += `🚩 ${toItalicFont('Made by TOHIDUL')}`;

            return api.sendMessage(msg, threadID, messageID);
        }
    }
}