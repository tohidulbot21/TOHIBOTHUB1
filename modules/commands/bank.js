module.exports.config = {
  name: "bank",
  version: "2.0.7",
  usePrefix: true,
  hasPermssion: 0,
  credits: "Made by Tohidul",
  description: "For users: virtual bank system",
  commandCategory: "User",
  usages: "",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { senderID, messageID, threadID } = event;
  const axios = require('axios');
  const { createReadStream } = require(`fs-extra`);

  // Load config
  let config = {};
  try {
    config = require('../../config.json');
  } catch (e) {
    console.log('[BANK] Config not found, using default settings');
  }

  const bankConfig = config.BANK_API || {
    BASE_URL: process.env.BANK_API_URL || 'http://0.0.0.0:3002/bank',
    FALLBACK_URL: process.env.BANK_FALLBACK_URL || 'http://localhost:3002/bank',
    TIMEOUT: 15000,
    MAX_RETRIES: 3
  };

  if (!bankConfig.ENABLED) {
    return api.sendMessage("❌ Bank system is currently disabled by admin.", threadID, messageID);
  }

  const baseURL = bankConfig.BASE_URL;

  // Enhanced API call function with error handling and retry logic
  async function makeApiCall(endpoint, params = {}, retries = 1) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(url, { 
          timeout: 20000,
          headers: {
            'User-Agent': 'TOHI-BOT-BANK/1.0',
            'Accept': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        console.log(`[BANK] API Error (attempt ${attempt + 1}): ${error.message}`);

        // Handle rate limiting specifically
        if (error.response?.status === 429) {
          if (attempt < retries) {
            console.log(`[BANK] Rate limited, waiting 5 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          throw new Error('🚫 Bank service is temporarily busy. Please wait 30 seconds and try again.');
        }

        // Handle connection errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          // Try fallback URL
          if (bankConfig.FALLBACK_URL && bankConfig.FALLBACK_URL !== baseURL) {
            try {
              const fallbackUrl = `${bankConfig.FALLBACK_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
              const fallbackResponse = await axios.get(fallbackUrl, { 
                timeout: 20000,
                headers: {
                  'User-Agent': 'TOHI-BOT-BANK/1.0',
                  'Accept': 'application/json'
                }
              });
              return fallbackResponse.data;
            } catch (fallbackError) {
              console.log(`[BANK] Fallback API Error: ${fallbackError.message}`);
            }
          }
          throw new Error('🏦 Bank service is starting up. Please wait a moment and try again.');
        }

        // If not the last attempt, wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    throw new Error('🏦 Bank service is currently unavailable. Please try again later.');
  }

  try {
    const checkBank = await makeApiCall('/check', { ID: senderID });

    switch(args[0]) {
        case 'register':
        case '-r':
        case 'r': {
            try {
              const userName = await getUserName(senderID);

              const res = await makeApiCall('/register', {
                senderID: senderID,
                name: encodeURI(userName)
              });
              if(res.status == false) return api.sendMessage(res.message, threadID, messageID);
              api.sendMessage('Your bank password is: ' + res.message.password, senderID);
              return api.sendMessage(`=== [ ${res.message.noti} ] ===\n👤 Account holder: ${userName}\n💳 Account Number: ${res.message.STK}\n💰 Balance: ${res.message.money}$\n🔐  Password: sent to your private messages, please check your inbox (or spam)`, threadID, messageID)
            } catch (error) {
              return api.sendMessage('❌ Registration failed. Please try again.', threadID, messageID);
            }
        }
        case "find":
        case "-f": {
            if (checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            if (args[1] != "stk" && args[1] != "id") {
                return api.sendMessage("Please choose a valid type (stk/id)", threadID, messageID);
            }
            const findParams = {};
            findParams.type = args[1].toUpperCase();
            findParams[args[1].toUpperCase()] = args[2];

            let { data } = await makeApiCall('/find', findParams);
            const name = data.message.name;
            const stk = data.message.data.STK;
            const soDu = data.message.data.money;
            return api.sendMessage(`=== [ MB BANK ] ===\n👤 Account holder: ${name}\n💳 Account Number: ${stk}\n💰 Balance: ${soDu}$`, threadID, messageID)
        }
        case 'info':
        case '-i':
        case 'check':
        case '-c': {
            if(checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            const res = await makeApiCall('/find', { type: 'ID', ID: senderID });
            return api.sendMessage(`=== [ BANK KING ] ===\n👤 Account holder: ${res.message.name}\n💳 Account Number: ${res.message.data.STK}\n💰 Balance: ${res.message.data.money}$`, threadID, messageID)
        }
        case 'get':
        case 'withdraw': {
            if(checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            if(!args[1]) return api.sendMessage('Please use: get [amount]', threadID, messageID);
            api.sendMessage('Final step sent to your inbox', threadID, messageID);
            return api.sendMessage('Please reply to this message with your bank password to withdraw!', senderID, (error, info) => 
                global.client.handleReply.push({
                    name: this.config.name,
                    type: 'getMoney',
                    messageID: info.messageID,
                    author: event.senderID,
                    money: args[1],
                    threadID: threadID,
                    baseURL: baseURL
                })
            );
        }
        case 'top':
        case '-t':{
            if(checkBank.status == false) return api.sendMessage("❌ You don't have a bank account yet! Use `/bank register` to create one.", threadID, messageID);
            const res = await makeApiCall('/top');
            if(res.status == false) return api.sendMessage('❌ No ranking data currently available!', threadID, messageID);

            let msg = `🏆 ${res.message}\n\n`;
            let emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            for (let i of res.ranking) {
                let rankEmoji = emojis[i.rank - 1] || `${i.rank}️⃣`;
                let displayName = i.name || `User${i.rank}`;

                msg += `${rankEmoji} ${displayName}\n`;
                msg += `💰 Balance: $${i.money.toLocaleString()}\n`;
                msg += `━━━━━━━━━━━━━━━━━━━━\n`;
            }

            msg += `\n💡 Use "/bank register" to join the ranking!`;
            return api.sendMessage(msg, threadID, messageID);
        }
        case 'pay':
        case '-p': {
            if(checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            if(!args[1] || !args[2] || !args[3]) return api.sendMessage('Please use: pay stk [recipient account number] [amount]', threadID, messageID);
            if(args[1] == 'stk') {
                api.sendMessage('Final step sent to your inbox', threadID, messageID);
                return api.sendMessage('Please reply to this message with your bank password to transfer!', senderID, (error, info) => 
                    global.client.handleReply.push({
                        name: this.config.name,
                        type: 'paySTK',
                        messageID: info.messageID,
                        author: event.senderID,
                        STK: args[2],
                        money: args[3],
                        threadID: threadID,
                        baseURL: baseURL
                    })
                );
            }
            if(args[1] == 'id') {
                api.sendMessage('Final step sent to your inbox', threadID, messageID);
                return api.sendMessage('Please reply to this message with your bank password to transfer!', senderID, (error, info) => 
                    global.client.handleReply.push({
                        name: this.config.name,
                        type: 'payID',
                        messageID: info.messageID,
                        author: event.senderID,
                        ID: args[2],
                        money: args[3],
                        threadID: threadID,
                        baseURL: baseURL
                    })
                );
            }
            break;
        }
        case 'send':
        case 'deposit':
        case 'topup': {
            if(checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            if(!args[1]) return api.sendMessage('Please enter the amount to deposit!\nsend [amount]', threadID, messageID);
            var check = await checkMoney(senderID, args[1])
            if (check == false) return api.sendMessage("You don't have enough money to deposit!", threadID, messageID);
            await Currencies.decreaseMoney(senderID, parseInt(args[1]))
            const res = await makeApiCall('/send', { senderID: senderID, money: args[1] });
            return api.sendMessage(`${res.message.noti}\n👤 Account holder: ${res.message.name}\n💰 Current balance: ${res.message.money}$`, threadID, messageID)
        }
        case 'password':
        case 'pw': {
            if(checkBank.status == false) return api.sendMessage("You don't have a bank account yet!", threadID, messageID);
            var type = args[1];
            switch(type) {
                case 'get': {
                    const res = await makeApiCall('/password', { bka: type, dka: senderID });
                    api.sendMessage('Your password has been sent to your inbox', threadID, messageID);
                    return api.sendMessage(`Your bank password is: ${res.message.password}`, senderID);
                }
                case 'recovery':
                case 'new': {
                    api.sendMessage('Final step sent to your inbox', threadID, messageID);
                    return api.sendMessage('Please reply to this message to set a new password!', senderID, (error, info) => 
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: 'newPassword',
                            messageID: info.messageID,
                            author: event.senderID,
                            threadID: threadID,
                            baseURL: baseURL
                        })
                    );
                }
                default: {
                    return api.sendMessage("Use 'get' to retrieve your password or 'new' to set a new password.", threadID, messageID);
                }
            }
        }
        default: {
            let helpText = `🏦 === BANK SYSTEM HELP === 🏦\n\n`;
            helpText += `📋 ACCOUNT MANAGEMENT:\n`;
            helpText += `• /bank register - Register a new bank account\n`;
            helpText += `• /bank info - View your account details\n`;
            helpText += `• /bank find stk <account_number> - Find account by number\n`;
            helpText += `• /bank find id <user_id> - Find account by user ID\n\n`;

            helpText += `💰 MONEY OPERATIONS:\n`;
            helpText += `• /bank send <amount> - Deposit money from wallet to bank\n`;
            helpText += `• /bank get <amount> - Withdraw money from bank to wallet\n`;
            helpText += `• /bank pay stk <account_number> <amount> - Transfer to account\n`;
            helpText += `• /bank pay id <user_id> <amount> - Transfer to user ID\n\n`;

            helpText += `🔐 SECURITY:\n`;
            helpText += `• /bank pw get - Get your current password\n`;
            helpText += `• /bank pw new - Set a new password\n\n`;

            helpText += `📊 RANKINGS:\n`;
            helpText += `• /bank top - View richest users ranking\n\n`;

            helpText += `💡 TIPS:\n`;
            helpText += `- All transfers require your bank password\n`;
            helpText += `- Keep your password safe and private\n`;
            helpText += `- Minimum transfer amount is $1\n`;
            helpText += `- Bank balance is separate from wallet balance\n\n`;

            helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━`;

            try {
                const picture = (await axios.get(`https://i.imgur.com/5hkQ2CC.jpg`, { responseType: "stream"})).data
                return api.sendMessage({
                    body: helpText,
                    attachment: picture
                }, threadID, messageID);
            } catch (error) {
                return api.sendMessage(helpText, threadID, messageID);
            }
        }
    }
  } catch (error) {
    console.log(`[BANK] Command error: ${error.message}`);
    return api.sendMessage(`❌ ${error.message}`, threadID, messageID);
  }

  async function checkMoney(senderID, maxMoney) {
      var i, w;
      i = (await Currencies.getData(senderID)) || {};
      w = i.money || 0
      if (w < parseInt(maxMoney)) return false;
      else return true;
  }

  // Helper function to get user name
  async function getUserName(userId) {
    try {
      // First check usersData.json
      const userData = await Users.getData(userId);
      if (userData && userData.name && userData.name !== 'undefined' && userData.name.trim() && !userData.name.startsWith('User')) {
        return userData.name;
      }

      // Try to get name using Users.getNameUser (which has better error handling)
      try {
        const name = await Users.getNameUser(userId);
        if (name && name !== 'undefined' && !name.startsWith('User-') && name.trim()) {
          return name;
        }
      } catch (userError) {
        console.log(`[BANK] Users.getNameUser error for ${userId}: ${userError.message}`);
      }

      // Try to get from bot's built-in getUserInfo as fallback
      try {
        const userInfo = await new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 3000);

          api.getUserInfo(userId, (err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        });

        if (userInfo && userInfo[userId] && userInfo[userId].name && userInfo[userId].name.trim()) {
          const name = userInfo[userId].name.trim();

          // Update user data
          await Users.setData(userId, { name: name });

          return name;
        }
      } catch (apiError) {
        console.log(`[BANK] Bot API error for ${userId}: ${apiError.message}`);
      }

      // Fallback with better naming
      const shortId = userId.slice(-6);
      return `FB_User_${shortId}`;
    } catch (error) {
      console.log(`[BANK] Error getting user name for ${userId}: ${error.message}`);
      const shortId = userId.slice(-6);
      return `FB_User_${shortId}`;
    }
  }
}

module.exports.handleReply = async function ({ api, event, handleReply, Currencies, Users }) {
  const axios = require('axios')
  const { senderID, messageID, threadID , body } = event;

  const baseURL = handleReply.baseURL || "http://127.0.0.1:3001/bank";

  // Enhanced API call function with error handling for replies
  async function makeApiCall(endpoint, params = {}, retries = 1) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(url, { 
          timeout: 15000,
          headers: {
            'User-Agent': 'TOHI-BOT-BANK/1.0',
            'Accept': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        console.log(`[BANK] Reply API Error (attempt ${attempt + 1}): ${error.message}`);

        if (error.response?.status === 429) {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
          }
        }

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw new Error('Bank service is currently unavailable. Please try again later.');
  }

  try {
    switch(handleReply.type) {
        case 'paySTK': {
            const res = await makeApiCall('/pay', {
              type: 'STK',
              senderID: senderID,
              STK: handleReply.STK,
              money: handleReply.money,
              password: body
            });
            if(res.status == false) return api.sendMessage(res.message, threadID, messageID);
            api.sendMessage(`${res.message.noti}\n${res.message.data.message}`, threadID, messageID);
            return api.sendMessage(`${res.message.noti}\n\n${res.message.data.message}`, handleReply.threadID);
        }
        case 'payID': {
            const res = await makeApiCall('/pay', {
              type: 'ID',
              senderID: senderID,
              userID: handleReply.ID,
              money: handleReply.money,
              password: body
            });
            if(res.status == false) return api.sendMessage(res.message, threadID, messageID);
            api.sendMessage(`${res.message.noti} ${res.message.data.message}`, threadID, messageID);
            return api.sendMessage(`${res.message.noti}\n\n${res.message.data.message}`, handleReply.threadID);
        }
        case 'getMoney': {
            const password = body.trim(); // Clean the password input

            if (!password) {
              return api.sendMessage('❌ Password cannot be empty!', threadID, messageID);
            }

            try {
              const res = await makeApiCall('/get', {
                ID: senderID,
                money: handleReply.money,
                password: password
              });

              if(res.status == false) {
                return api.sendMessage(`❌ ${res.message}`, threadID, messageID);
              }

              await Currencies.increaseMoney(senderID, parseInt(handleReply.money));

              const successMsg = `${res.message.noti}\n👤 Account holder: ${res.message.name}\n💰 Remaining balance: $${res.message.money.toLocaleString()}`;

              api.sendMessage(successMsg, threadID, messageID);
              return api.sendMessage(successMsg, handleReply.threadID);

            } catch (error) {
              console.log(`[BANK] getMoney error: ${error.message}`);
              return api.sendMessage('❌ Withdrawal failed. Please try again.', threadID, messageID);
            }
        }
        case 'newPassword': {
            const res = await makeApiCall('/password', {
              bka: 'recovery',
              dka: senderID,
              fka: body
            });
            if(res.status == false) return api.sendMessage(res.message, threadID, messageID);
            api.sendMessage(`${res.message.noti}\n👤 Account holder: ${res.message.name}`, handleReply.threadID);
            return api.sendMessage(`Password changed successfully!\nCurrent password: ${res.message.password}`, threadID, messageID)
        }
    }
  } catch (error) {
    console.log(`[BANK] Reply error: ${error.message}`);
    return api.sendMessage(`❌ ${error.message}`, threadID, messageID);
  }
}