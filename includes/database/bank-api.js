

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();

// Rate limiting with more lenient limits for local use
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 500; // Increased to 500 requests per minute for local use

function rateLimitMiddleware(req, res, next) {
  const clientId = req.ip || req.connection.remoteAddress || 'localhost';
  const now = Date.now();

  // Skip rate limiting for localhost/internal requests completely
  if (clientId === '127.0.0.1' || clientId === '0.0.0.0' || clientId === 'localhost' || clientId === '::1' || clientId.includes('127.0.0.1')) {
    return next();
  }

  if (!rateLimit.has(clientId)) {
    rateLimit.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const clientData = rateLimit.get(clientId);

  if (now > clientData.resetTime) {
    rateLimit.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    console.log(`[BANK-API] Rate limit exceeded for ${clientId}: ${clientData.count}/${RATE_LIMIT_MAX}`);
    return res.status(429).json({ 
      status: false, 
      message: `Rate limit exceeded. ${clientData.count}/${RATE_LIMIT_MAX} requests in window. Try again in ${Math.ceil((clientData.resetTime - now) / 1000)} seconds.` 
    });
  }

  clientData.count++;
  next();
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimitMiddleware);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Database file paths
const BANK_DATA_FILE = path.join(__dirname, 'data/bankData.json');
const USERS_DATA_FILE = path.join(__dirname, 'data/usersData.json');

// Initialize bank data file if it doesn't exist
async function initBankData() {
  try {
    if (!await fs.pathExists(BANK_DATA_FILE)) {
      await fs.outputJson(BANK_DATA_FILE, {
        users: {},
        transactions: [],
        nextAccountNumber: 1000000
      });
    }
    if (!await fs.pathExists(USERS_DATA_FILE)) {
      await fs.outputJson(USERS_DATA_FILE, {});
    }
  } catch (error) {
    console.log('[BANK-API] Error initializing data files:', error);
  }
}

// Helper functions
async function getBankData() {
  try {
    return await fs.readJson(BANK_DATA_FILE);
  } catch (error) {
    console.log('[BANK-API] Error reading bank data:', error);
    return { users: {}, transactions: [], nextAccountNumber: 1000000 };
  }
}

async function saveBankData(data) {
  try {
    await fs.outputJson(BANK_DATA_FILE, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.log('[BANK-API] Error saving bank data:', error);
    return false;
  }
}

async function getUsersData() {
  try {
    return await fs.readJson(USERS_DATA_FILE);
  } catch (error) {
    console.log('[BANK-API] Error reading users data:', error);
    return {};
  }
}

async function saveUsersData(data) {
  try {
    await fs.outputJson(USERS_DATA_FILE, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.log('[BANK-API] Error saving users data:', error);
    return false;
  }
}

function generatePassword() {
  return Math.random().toString(36).slice(-8).toUpperCase();
}

function generateAccountNumber(nextNum) {
  return (nextNum + Math.floor(Math.random() * 1000)).toString();
}

// Get user money from usersData.json
async function getUserMoney(userId) {
  try {
    const usersData = await getUsersData();
    return usersData[userId]?.money || 0;
  } catch (error) {
    console.log(`[BANK-API] Error getting user money for ${userId}: ${error.message}`);
    return 0;
  }
}

// Update user money in usersData.json
async function updateUserMoney(userId, newAmount) {
  try {
    const usersData = await getUsersData();
    if (!usersData[userId]) {
      usersData[userId] = {
        userID: userId,
        money: 0,
        exp: 0,
        createTime: { timestamp: Date.now() },
        data: { timestamp: Date.now() },
        lastUpdate: Date.now()
      };
    }
    usersData[userId].money = newAmount;
    usersData[userId].lastUpdate = Date.now();
    await saveUsersData(usersData);
    return true;
  } catch (error) {
    console.log(`[BANK-API] Error updating user money for ${userId}: ${error.message}`);
    return false;
  }
}

// Get user name from usersData.json or bankData.json
async function getUserName(userId) {
  try {
    const usersData = await getUsersData();
    const bankData = await getBankData();
    
    // First check usersData.json for the name
    if (usersData[userId]?.name && usersData[userId].name !== 'undefined' && usersData[userId].name.trim() && !usersData[userId].name.startsWith('User')) {
      return usersData[userId].name;
    }
    
    // Then try to get name from bank data
    if (bankData.users[userId]?.name && bankData.users[userId].name !== 'undefined' && bankData.users[userId].name.trim() && !bankData.users[userId].name.startsWith('User')) {
      return bankData.users[userId].name;
    }
    
    // Try to get name using the bot's Users utility (if available)
    try {
      const fs = require('fs-extra');
      const usersJsPath = require('path').join(__dirname, '../users.js');
      
      if (await fs.pathExists(usersJsPath)) {
        // Try to use the bot's user system to get name
        const Users = require('../users.js')({ api: null });
        
        if (Users && Users.getNameUser) {
          const botUserName = await Users.getNameUser(userId);
          if (botUserName && botUserName !== 'undefined' && !botUserName.startsWith('User-') && botUserName.trim()) {
            console.log(`[BANK-API] Got name from bot system for ${userId}: ${botUserName}`);
            
            // Update our local data
            if (!usersData[userId]) {
              usersData[userId] = {
                userID: userId,
                money: 0,
                exp: 0,
                createTime: { timestamp: Date.now() },
                data: { timestamp: Date.now() },
                lastUpdate: Date.now()
              };
            }
            usersData[userId].name = botUserName;
            await saveUsersData(usersData);
            
            if (bankData.users[userId]) {
              bankData.users[userId].name = botUserName;
              await saveBankData(bankData);
            }
            
            return botUserName;
          }
        }
      }
    } catch (botError) {
      console.log(`[BANK-API] Bot user system error: ${botError.message}`);
    }
    
    // Try to fetch from Facebook Graph API as fallback
    try {
      const axios = require('axios');
      
      // Use the access token from appstate
      let accessToken = 'EAAD6V7os0gcBOZAQSzLOLbOTqJIyHLLhYgwvhqEoAifGzIGF6K8rHrVHO5W8BnOGCAJRlmJHZCs8pC2D1hbPnBKH6bqNn1ZBQMqBafyLHZAPq7rZCeofEXMOOWYNiC93xTuZCEpwZCKR9BVvSRVLCFXHZCwwW7bJtNh3xNlkOSCJeocvZCNLZCJIiZAy0KPrKRSYyNi4T3vX8lPjzZCNVZCRK2xQkW6rZCJZCn3Xf8d5p5s7L2Q3YZCGmUDyYZCGnMZBb6vZCr0k7BgZDZD';
      
      // Try to get token from global if available
      if (global && global.account && global.account.accessToken) {
        accessToken = global.account.accessToken;
      }
      
      const response = await axios.get(`https://graph.facebook.com/${userId}?fields=name&access_token=${accessToken}`, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (response.data && response.data.name && response.data.name.trim()) {
        const fbName = response.data.name.trim();
        console.log(`[BANK-API] Successfully fetched name for ${userId}: ${fbName}`);
        
        // Update usersData with the fetched name
        if (!usersData[userId]) {
          usersData[userId] = {
            userID: userId,
            money: 0,
            exp: 0,
            createTime: { timestamp: Date.now() },
            data: { timestamp: Date.now() },
            lastUpdate: Date.now()
          };
        }
        usersData[userId].name = fbName;
        await saveUsersData(usersData);
        
        // Update bankData if user exists there
        if (bankData.users[userId]) {
          bankData.users[userId].name = fbName;
          await saveBankData(bankData);
        }
        
        return fbName;
      }
    } catch (fbError) {
      console.log(`[BANK-API] Facebook API failed for ${userId}: ${fbError.message}`);
    }
    
    // Final fallback - create a more readable name
    const shortId = userId.slice(-6);
    const fallbackName = `User_${shortId}`;
    
    console.log(`[BANK-API] Using fallback name for ${userId}: ${fallbackName}`);
    return fallbackName;
  } catch (error) {
    console.log(`[BANK-API] Error getting user name for ${userId}: ${error.message}`);
    const shortId = userId.slice(-6);
    return `User_${shortId}`;
  }
}

// API Routes

// Root route
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: "TOHI-BOT Bank API is running",
    version: "3.0.0",
    endpoints: [
      '/bank/check',
      '/bank/register', 
      '/bank/find',
      '/bank/send',
      '/bank/get',
      '/bank/pay',
      '/bank/top',
      '/bank/password'
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check if user has bank account
app.get('/bank/check', async (req, res) => {
  try {
    const { ID } = req.query;
    if (!ID) {
      return res.json({ status: false, message: "User ID is required" });
    }

    const bankData = await getBankData();
    const userExists = bankData.users[ID] ? true : false;

    res.json({ 
      status: userExists,
      message: userExists ? "User has bank account" : "User doesn't have bank account"
    });
  } catch (error) {
    res.json({ status: false, message: "Server error" });
  }
});

// Register new bank account
app.get('/bank/register', async (req, res) => {
  try {
    const { senderID, name } = req.query;
    if (!senderID || !name) {
      return res.json({ status: false, message: "Missing required parameters" });
    }

    const bankData = await getBankData();

    if (bankData.users[senderID]) {
      return res.json({ status: false, message: "You already have a bank account" });
    }

    const accountNumber = generateAccountNumber(bankData.nextAccountNumber);
    const password = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Get current money from users data
    const currentMoney = await getUserMoney(senderID);

    // Store bank-specific data with proper name handling
    const decodedName = decodeURI(name);
    let finalName = null;
    
    // Check if decoded name is valid
    if (decodedName && decodedName !== 'undefined' && decodedName.trim() && !decodedName.startsWith('User')) {
      finalName = decodedName.trim();
    }
    
    // If name is still not valid, try to get it properly
    if (!finalName) {
      // Try to get from existing usersData
      const usersData = await getUsersData();
      if (usersData[senderID]?.name && usersData[senderID].name !== 'undefined' && usersData[senderID].name.trim() && !usersData[senderID].name.startsWith('User')) {
        finalName = usersData[senderID].name;
      }
      
      // Try to use the bot's user system if available
      if (!finalName) {
        try {
          const fs = require('fs-extra');
          const usersJsPath = require('path').join(__dirname, '../users.js');
          
          if (await fs.pathExists(usersJsPath)) {
            const Users = require('../users.js')({ api: null });
            
            if (Users && Users.getNameUser) {
              const botUserName = await Users.getNameUser(senderID);
              if (botUserName && botUserName !== 'undefined' && !botUserName.startsWith('User-') && botUserName.trim()) {
                finalName = botUserName;
                console.log(`[BANK-API] Got name from bot system for registration: ${finalName}`);
              }
            }
          }
        } catch (botError) {
          console.log(`[BANK-API] Bot user system error during registration: ${botError.message}`);
        }
      }
      
      // Try Facebook API as fallback
      if (!finalName) {
        try {
          const axios = require('axios');
          let accessToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
          
          // Try to get token from global if available
          if (global && global.account && global.account.accessToken) {
            accessToken = global.account.accessToken;
          }
          
          const response = await axios.get(`https://graph.facebook.com/${senderID}?fields=name&access_token=${accessToken}`, {
            timeout: 5000
          });
          
          if (response.data && response.data.name && response.data.name.trim()) {
            finalName = response.data.name.trim();
            console.log(`[BANK-API] Got name from Facebook for registration: ${finalName}`);
          }
        } catch (fbError) {
          console.log(`[BANK-API] Facebook name fetch error during registration: ${fbError.message}`);
        }
      }
    }
    
    // Final fallback with more readable format
    if (!finalName) {
      finalName = `User_${senderID.slice(-6)}`;
      console.log(`[BANK-API] Using fallback name for registration: ${finalName}`);
    }
      
    bankData.users[senderID] = {
      name: finalName,
      STK: accountNumber,
      password: password,
      createTime: new Date().toISOString()
    };

    bankData.nextAccountNumber += 1;
    await saveBankData(bankData);

    // Ensure user exists in usersData.json
    const usersData = await getUsersData();
    if (!usersData[senderID]) {
      usersData[senderID] = {
        userID: senderID,
        money: currentMoney,
        exp: 0,
        createTime: { timestamp: Date.now() },
        data: { timestamp: Date.now() },
        lastUpdate: Date.now()
      };
      await saveUsersData(usersData);
    }

    res.json({
      status: true,
      message: {
        noti: "🏦 Bank account created successfully!",
        name: decodeURI(name),
        STK: accountNumber,
        money: currentMoney,
        password: password
      }
    });
  } catch (error) {
    console.log('[BANK-API] Registration error:', error);
    res.json({ status: false, message: "Registration failed" });
  }
});

// Find user by account number or ID
app.get('/bank/find', async (req, res) => {
  try {
    const { type, STK, ID } = req.query;
    const bankData = await getBankData();

    let user = null;
    let userId = null;

    if (type === 'STK' && STK) {
      // Find by account number
      for (const [uId, userData] of Object.entries(bankData.users)) {
        if (userData.STK === STK) {
          user = userData;
          userId = uId;
          break;
        }
      }
    } else if (type === 'ID' && ID) {
      // Find by user ID
      if (bankData.users[ID]) {
        user = bankData.users[ID];
        userId = ID;
      }
    }

    if (!user || !userId) {
      return res.json({ status: false, message: "User not found" });
    }

    const userMoney = await getUserMoney(userId);
    const userName = await getUserName(userId);

    res.json({
      status: true,
      message: {
        name: userName,
        data: {
          STK: user.STK,
          money: userMoney
        }
      }
    });
  } catch (error) {
    console.log('[BANK-API] Find error:', error);
    res.json({ status: false, message: "Server error" });
  }
});

// Deposit money to bank
app.get('/bank/send', async (req, res) => {
  try {
    const { senderID, money } = req.query;
    if (!senderID || !money) {
      return res.json({ status: false, message: "Missing parameters" });
    }

    const amount = parseInt(money);
    if (isNaN(amount) || amount <= 0) {
      return res.json({ status: false, message: "Invalid amount" });
    }

    const bankData = await getBankData();

    if (!bankData.users[senderID]) {
      return res.json({ status: false, message: "Bank account not found" });
    }

    const currentMoney = await getUserMoney(senderID);
    const newAmount = currentMoney + amount;

    await updateUserMoney(senderID, newAmount);

    // Add transaction record
    bankData.transactions.push({
      type: 'deposit',
      from: senderID,
      amount: amount,
      timestamp: new Date().toISOString()
    });

    await saveBankData(bankData);

    const userName = await getUserName(senderID);

    res.json({
      status: true,
      message: {
        noti: "💰 Money deposited successfully!",
        name: userName,
        money: newAmount
      }
    });
  } catch (error) {
    console.log('[BANK-API] Deposit error:', error);
    res.json({ status: false, message: "Deposit failed" });
  }
});

// Withdraw money from bank
app.get('/bank/get', async (req, res) => {
  try {
    const { ID, money, password } = req.query;
    if (!ID || !money || !password) {
      return res.json({ status: false, message: "Missing parameters" });
    }

    const amount = parseInt(money);
    if (isNaN(amount) || amount <= 0) {
      return res.json({ status: false, message: "Invalid amount" });
    }

    const bankData = await getBankData();

    if (!bankData.users[ID]) {
      return res.json({ status: false, message: "Bank account not found" });
    }

    const user = bankData.users[ID];

    if (user.password !== password) {
      return res.json({ status: false, message: "Incorrect password" });
    }

    const currentMoney = await getUserMoney(ID);

    if (currentMoney < amount) {
      return res.json({ status: false, message: "Insufficient balance" });
    }

    const newAmount = currentMoney - amount;
    await updateUserMoney(ID, newAmount);

    // Add transaction record
    bankData.transactions.push({
      type: 'withdraw',
      from: ID,
      amount: amount,
      timestamp: new Date().toISOString()
    });

    await saveBankData(bankData);

    const userName = await getUserName(ID);

    res.json({
      status: true,
      message: {
        noti: "💸 Money withdrawn successfully!",
        name: userName,
        money: newAmount
      }
    });
  } catch (error) {
    console.log('[BANK-API] Withdrawal error:', error);
    res.json({ status: false, message: "Withdrawal failed" });
  }
});

// Transfer money between accounts
app.get('/bank/pay', async (req, res) => {
  try {
    const { type, senderID, STK, userID, money, password } = req.query;
    if (!senderID || !money || !password) {
      return res.json({ status: false, message: "Missing parameters" });
    }

    const amount = parseInt(money);
    if (isNaN(amount) || amount <= 0) {
      return res.json({ status: false, message: "Invalid amount" });
    }

    const bankData = await getBankData();

    if (!bankData.users[senderID]) {
      return res.json({ status: false, message: "Your bank account not found" });
    }

    const sender = bankData.users[senderID];

    if (sender.password !== password) {
      return res.json({ status: false, message: "Incorrect password" });
    }

    const senderMoney = await getUserMoney(senderID);

    if (senderMoney < amount) {
      return res.json({ status: false, message: "Insufficient balance" });
    }

    let receiverID = null;

    if (type === 'STK' && STK) {
      // Find receiver by account number
      for (const [userId, userData] of Object.entries(bankData.users)) {
        if (userData.STK === STK) {
          receiverID = userId;
          break;
        }
      }
    } else if (type === 'ID' && userID) {
      receiverID = userID;
    }

    if (!receiverID || !bankData.users[receiverID]) {
      return res.json({ status: false, message: "Receiver account not found" });
    }

    if (receiverID === senderID) {
      return res.json({ status: false, message: "Cannot transfer to yourself" });
    }

    const receiver = bankData.users[receiverID];
    const receiverMoney = await getUserMoney(receiverID);

    // Transfer money
    await updateUserMoney(senderID, senderMoney - amount);
    await updateUserMoney(receiverID, receiverMoney + amount);

    // Add transaction record
    bankData.transactions.push({
      type: 'transfer',
      from: senderID,
      to: receiverID,
      amount: amount,
      timestamp: new Date().toISOString()
    });

    await saveBankData(bankData);

    const senderName = await getUserName(senderID);
    const receiverName = await getUserName(receiverID);

    res.json({
      status: true,
      message: {
        noti: "💳 Transfer successful!",
        data: {
          message: `Transferred $${amount} from ${senderName} to ${receiverName}`
        }
      }
    });
  } catch (error) {
    console.log('[BANK-API] Transfer error:', error);
    res.json({ status: false, message: "Transfer failed" });
  }
});

// Get top richest users
app.get('/bank/top', async (req, res) => {
  try {
    const bankData = await getBankData();
    const usersData = await getUsersData();

    const usersWithMoney = [];

    // Get all users from usersData (primary source)
    for (const [id, userData] of Object.entries(usersData)) {
      if (userData.money > 0) {
        const userName = await getUserName(id);
        usersWithMoney.push({ 
          id, 
          name: userName,
          money: userData.money 
        });
      }
    }

    const users = usersWithMoney
      .sort((a, b) => b.money - a.money)
      .slice(0, 10);

    if (users.length === 0) {
      return res.json({ status: false, message: "No users found" });
    }

    const ranking = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      money: user.money
    }));

    res.json({
      status: true,
      message: "🏆 Top Richest Users:",
      ranking: ranking
    });
  } catch (error) {
    console.log('[BANK-API] Top users error:', error);
    res.json({ status: false, message: "Failed to get rankings" });
  }
});

// Password management
app.get('/bank/password', async (req, res) => {
  try {
    const { bka, dka, fka } = req.query;

    if (!dka) {
      return res.json({ status: false, message: "User ID required" });
    }

    const bankData = await getBankData();

    if (!bankData.users[dka]) {
      return res.json({ status: false, message: "Bank account not found" });
    }

    const user = bankData.users[dka];

    if (bka === 'get') {
      // Get current password
      res.json({
        status: true,
        message: {
          password: user.password
        }
      });
    } else if (bka === 'recovery' && fka) {
      // Set new password
      const newPassword = fka.trim();
      if (newPassword.length < 4) {
        return res.json({ status: false, message: "Password must be at least 4 characters" });
      }

      bankData.users[dka].password = newPassword;
      await saveBankData(bankData);

      const userName = await getUserName(dka);

      res.json({
        status: true,
        message: {
          noti: "🔐 Password changed successfully!",
          name: userName,
          password: newPassword
        }
      });
    } else {
      res.json({ status: false, message: "Invalid operation" });
    }
  } catch (error) {
    console.log('[BANK-API] Password operation error:', error);
    res.json({ status: false, message: "Password operation failed" });
  }
});

// Initialize and start server
async function startBankAPI() {
  await initBankData();

  const PORT = process.env.BANK_API_PORT || 3002;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`⫸ TBH ➤ [ BANK-API ] Bank API server running on port ${PORT}`);
  });

  server.on('error', (error) => {
    console.log(`⫸ TBH ➤ [ BANK-API ] Server error: ${error.message}`);
  });

  return server;
}

module.exports = { app, startBankAPI };

// Start server if this file is run directly
if (require.main === module) {
  startBankAPI();
}
