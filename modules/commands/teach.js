
const axios = require('axios');
const fs = require('fs');

// File to store user teach counts for teach2
const teachCountsFile = 'teach2Counts.json';
const teachersFile = 'authorizedTeachers.json';

// Initialize teach counts data
let teachCounts = {};
if (fs.existsSync(teachCountsFile)) {
    teachCounts = JSON.parse(fs.readFileSync(teachCountsFile, 'utf-8'));
} else {
    fs.writeFileSync(teachCountsFile, JSON.stringify(teachCounts, null, 2));
}

// Initialize authorized teachers data
let authorizedTeachers = {};
if (fs.existsSync(teachersFile)) {
    authorizedTeachers = JSON.parse(fs.readFileSync(teachersFile, 'utf-8'));
} else {
    // Add default teacher (you)
    authorizedTeachers = {
        "100092006324917": true
    };
    fs.writeFileSync(teachersFile, JSON.stringify(authorizedTeachers, null, 2));
}

const baseApiUrl = async () => {
    const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
    return base.data.api;
};

module.exports.config = {
  name: "teach",
  version: "7.0.0",
  credits: "TOHI-BOT-HUB",
  cooldowns: 0,
  hasPermssion: 0,
  description: "Enhanced version of teach bot with new features",
  commandCategory: "teach",
  category: "teach",
  usePrefix: true,
  prefix: true,
  usages: `teach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nteach amar [YourMessage] - [Reply1], [Reply2]... OR\nteach list OR\nteach remove [YourMessage] OR\nteach stats OR\nadd teacher [uid] OR\nremove teacher [uid]`,
};

// Helper function to get user name using API
const getUserName = async (userID, api) => {
    try {
        const userInfo = await api.getUserInfo([userID]);
        return userInfo[userID]?.name || "unknown";
    } catch (error) {
        console.error(`Error fetching user name for ID ${userID}:`, error.message);
        return "unknown";
    }
};

// Function to update teach count
const updateTeachCount = (userID) => {
    if (!teachCounts[userID]) {
        teachCounts[userID] = 0;
    }
    teachCounts[userID]++;
    fs.writeFileSync(teachCountsFile, JSON.stringify(teachCounts, null, 2));
};

// Function to save authorized teachers
const saveTeachers = () => {
    fs.writeFileSync(teachersFile, JSON.stringify(authorizedTeachers, null, 2));
};

// Function to check if user is authorized teacher
const isAuthorizedTeacher = (userID) => {
    return authorizedTeachers[userID] === true;
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const link = `${await baseApiUrl()}/baby`;
        const dipto = args.join(" ").toLowerCase();
        const uid = event.senderID;

        // Admin commands for managing teachers - Fixed format
        if (args[0] === 'teacher' && args[1]) {
            if (uid !== "100092006324917") {
                return api.sendMessage('🚫 শুধুমাত্র আমার মালিক এই command ব্যবহার করতে পারে!', event.threadID, event.messageID);
            }
            
            const newTeacherID = args[1];
            if (!newTeacherID) {
                return api.sendMessage('❌ Teacher এর UID দিন!\nFormat: teach teacher [uid]', event.threadID, event.messageID);
            }
            
            // Check if already a teacher
            if (authorizedTeachers[newTeacherID]) {
                const teacherName = await getUserName(newTeacherID, api);
                return api.sendMessage(`⚠️ ${teacherName} (${newTeacherID}) ইতিমধ্যে Teacher আছে!`, event.threadID, event.messageID);
            }
            
            authorizedTeachers[newTeacherID] = true;
            saveTeachers();
            
            const teacherName = await getUserName(newTeacherID, api);
            return api.sendMessage(`✅ ${teacherName} (${newTeacherID}) কে Teacher হিসেবে add করা হয়েছে! 👨‍🏫\n\n📊 Current Teachers: ${Object.keys(authorizedTeachers).length}`, event.threadID, event.messageID);
        }

        // Legacy support for 'add teacher' format
        if (args[0] === 'add' && args[1] === 'teacher') {
            if (uid !== "100092006324917") {
                return api.sendMessage('🚫 শুধুমাত্র আমার মালিক এই command ব্যবহার করতে পারে!', event.threadID, event.messageID);
            }
            
            const newTeacherID = args[2];
            if (!newTeacherID) {
                return api.sendMessage('❌ Teacher এর UID দিন!\nFormat: teach add teacher [uid] অথবা teach teacher [uid]', event.threadID, event.messageID);
            }
            
            authorizedTeachers[newTeacherID] = true;
            saveTeachers();
            
            const teacherName = await getUserName(newTeacherID, api);
            return api.sendMessage(`✅ ${teacherName} (${newTeacherID}) কে Teacher হিসেবে add করা হয়েছে! 👨‍🏫`, event.threadID, event.messageID);
        }

        if (args[0] === 'remove' && args[1] === 'teacher') {
            if (uid !== "100092006324917") {
                return api.sendMessage('🚫 শুধুমাত্র আমার মালিক এই command ব্যবহার করতে পারে!', event.threadID, event.messageID);
            }
            
            const removeTeacherID = args[2];
            if (!removeTeacherID) {
                return api.sendMessage('❌ Teacher এর UID দিন!\nFormat: remove teacher [uid]', event.threadID, event.messageID);
            }
            
            if (removeTeacherID === "100092006324917") {
                return api.sendMessage('❌ নিজেকে teacher list থেকে remove করতে পারবেন না!', event.threadID, event.messageID);
            }
            
            delete authorizedTeachers[removeTeacherID];
            saveTeachers();
            
            const teacherName = await getUserName(removeTeacherID, api);
            return api.sendMessage(`✅ ${teacherName} কে Teacher list থেকে remove করা হয়েছে! 🚫`, event.threadID, event.messageID);
        }

        // Check if user is authorized to use teach commands
        if (!isAuthorizedTeacher(uid)) {
            return api.sendMessage('🎮 দেখ ভাই তোকে দিয়ে teach হবে না, তুই গিয়া লুডো খেল! 🎲😂', event.threadID, event.messageID);
        }

        // Show help if no arguments
        if (!args[0]) {
            let helpMsg = `🤖 **TEACH Command Help** 🤖\n\n` +
                           `📝 **Basic Teaching:**\n` +
                           `teach [message] - [reply1], [reply2]\n\n` +
                           `💭 **Personal Teaching:**\n` +
                           `teach amar [message] - [reply1], [reply2]\n\n` +
                           `😄 **Reaction Teaching:**\n` +
                           `teach react [message] - [😀], [😂], [❤️]\n\n` +
                           `📊 **Commands:**\n` +
                           `• teach list - View all teachings\n` +
                           `• teach stats - Your teaching stats\n` +
                           `• teach remove [message] - Remove teaching\n\n`;
            
            // Add admin commands if user is owner
            if (uid === "100092006324917") {
                helpMsg += `👑 **Admin Commands:**\n` +
                          `• teach teacher [uid] - Add new teacher\n` +
                          `• teach add teacher [uid] - Add new teacher (legacy)\n` +
                          `• teach remove teacher [uid] - Remove teacher\n` +
                          `• teach teachers - View all teachers\n\n`;
            }
            
            helpMsg += `🎯 **Your Total Teachings:** ${teachCounts[uid] || 0}`;
            return api.sendMessage(helpMsg, event.threadID, event.messageID);
        }

        // Show all teachers (admin only)
        if (args[0] === 'teachers') {
            if (uid !== "100092006324917") {
                return api.sendMessage('🚫 শুধুমাত্র আমার মালিক এই command ব্যবহার করতে পারে!', event.threadID, event.messageID);
            }
            
            const teacherIds = Object.keys(authorizedTeachers);
            if (teacherIds.length === 0) {
                return api.sendMessage('📋 কোন Teacher নেই!', event.threadID, event.messageID);
            }
            
            let teachersList = `👑 **Authorized Teachers List** 👑\n\n`;
            
            for (let i = 0; i < teacherIds.length; i++) {
                const teacherId = teacherIds[i];
                const teacherName = await getUserName(teacherId, api);
                const isOwner = teacherId === "100092006324917" ? " 👑 (Owner)" : "";
                teachersList += `${i + 1}. ${teacherName}${isOwner}\n📱 UID: ${teacherId}\n\n`;
            }
            
            teachersList += `📊 **Total Teachers:** ${teacherIds.length}`;
            return api.sendMessage(teachersList, event.threadID, event.messageID);
        }

        // Show user stats
        if (args[0] === 'stats') {
            const userTeachCount = teachCounts[uid] || 0;
            const userName = await getUserName(uid, api);
            const statsMsg = `📊 **Teaching Statistics** 📊\n\n` +
                           `👤 **Teacher:** ${userName}\n` +
                           `🎯 **Total Teachings:** ${userTeachCount}\n` +
                           `🏆 **Rank:** ${userTeachCount >= 100 ? 'Master Teacher 🥇' : 
                                        userTeachCount >= 50 ? 'Expert Teacher 🥈' : 
                                        userTeachCount >= 20 ? 'Advanced Teacher 🥉' : 
                                        userTeachCount >= 10 ? 'Teacher 📚' : 'Beginner 🌱'}\n\n` +
                           `💡 Keep teaching to unlock more ranks!`;
            return api.sendMessage(statsMsg, event.threadID, event.messageID);
        }

        // List all teachings
        if (args[0] === 'list') {
            try {
                const response = await axios.get(`${link}?list=all`);
                const totalTeachings = response.data.length || 0;
                const listMsg = `📋 **Teaching Database** 📋\n\n` +
                              `📊 **Total Teachings:** ${totalTeachings}\n` +
                              `🎯 **Your Contributions:** ${teachCounts[uid] || 0}\n\n` +
                              `💡 Use "teach [message] - [reply]" to add more!`;
                return api.sendMessage(listMsg, event.threadID, event.messageID);
            } catch (error) {
                return api.sendMessage('❌ | Error fetching teaching list', event.threadID, event.messageID);
            }
        }

        // Remove teaching
        if (args[0] === 'remove') {
            const messageToRemove = args.slice(1).join(" ");
            if (!messageToRemove) {
                return api.sendMessage('❌ | Please specify the message to remove\nFormat: teach remove [message]', event.threadID, event.messageID);
            }
            
            try {
                const response = await axios.get(`${link}?remove=${encodeURIComponent(messageToRemove)}&senderID=${uid}`);
                return api.sendMessage(`✅ ${response.data.message}`, event.threadID, event.messageID);
            } catch (error) {
                console.error('Remove teaching error:', error);
                return api.sendMessage('❌ | Error removing teaching. Please try again.', event.threadID, event.messageID);
            }
        }

        // Regular teaching (only if it contains ' - ' separator and not a command)
        if (dipto.includes(' - ') && args[0] !== 'remove' && args[0] !== 'list' && args[0] !== 'stats' && args[1] !== 'amar' && args[1] !== 'react') {
            const [comd, command] = dipto.split(' - ');
            if (!command || command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use: teach2 [YourMessage] - [Reply1], [Reply2], [Reply3]...', event.threadID, event.messageID);
            }

            const re = await axios.get(`${link}?teach=${encodeURIComponent(comd)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);
            const name = await getUserName(re.data.teacher, api);

            // Update teach count for the user
            updateTeachCount(uid);

            const successMsg = `✅ **Teaching Added Successfully!** ✅\n\n` +
                             `📝 **Message:** ${comd}\n` +
                             `💬 **Replies:** ${command}\n` +
                             `👤 **Teacher:** ${name || "unknown"}\n` +
                             `📊 **Total Teachings:** ${re.data.teachs}\n` +
                             `🎯 **Your Teach Count:** ${teachCounts[uid]}`;

            return api.sendMessage(successMsg, event.threadID, event.messageID);
        }

        // Personal teaching (amar)
        if (args[0] === 'amar' && dipto.includes(' - ')) {
            const [comd, command] = dipto.split(' - ');
            const final = comd.replace("amar ", "");
            if (!command || command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use: teach2 amar [YourMessage] - [Reply1], [Reply2], [Reply3]...', event.threadID, event.messageID);
            }

            const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`);

            // Update teach count for the user
            updateTeachCount(uid);

            const successMsg = `✅ **Personal Teaching Added!** ✅\n\n` +
                             `📝 **Personal Message:** ${final}\n` +
                             `💬 **Replies:** ${command}\n` +
                             `🎯 **Your Teach Count:** ${teachCounts[uid]}`;

            return api.sendMessage(successMsg, event.threadID, event.messageID);
        }

        // Reaction teaching
        if (args[0] === 'react' && dipto.includes(' - ')) {
            const [comd, command] = dipto.split(' - ');
            const final = comd.replace("react ", "");
            if (!command || command.length < 2) {
                return api.sendMessage('❌ | Invalid format! Use: teach2 react [YourMessage] - [react1], [react2], [react3]...', event.threadID, event.messageID);
            }

            const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`);

            // Update teach count for the user
            updateTeachCount(uid);

            const successMsg = `✅ **Reaction Teaching Added!** ✅\n\n` +
                             `📝 **Message:** ${final}\n` +
                             `😄 **Reactions:** ${command}\n` +
                             `🎯 **Your Teach Count:** ${teachCounts[uid]}`;

            return api.sendMessage(successMsg, event.threadID, event.messageID);
        }

        // If no valid command format is found
        return api.sendMessage('❌ | Invalid command format!\n\nAvailable options:\n• teach [message] - [reply]\n• teach amar [message] - [reply]\n• teach react [message] - [reactions]\n• teach remove [message]\n• teach list\n• teach stats', event.threadID, event.messageID);

    } catch (e) {
        console.error('Error in teach2 command execution:', e);
        return api.sendMessage(`❌ **Error:** ${e.message}`, event.threadID, event.messageID);
    }
};
