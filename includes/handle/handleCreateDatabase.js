
module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleCreateDatabase({ event }) {
    try {
      if (!event || !global.config.autoCreateDB) return;
      
      const { threadID, senderID, isGroup } = event;
      
      // Create thread data if needed
      if (isGroup && threadID && !global.data.allThreadID.includes(threadID)) {
        try {
          await Threads.createData(threadID);
          global.data.allThreadID.push(threadID);
          global.data.threadData.set(threadID, {});
          
          // Get thread info
          const threadInfo = await api.getThreadInfo(threadID);
          if (threadInfo) {
            global.data.threadInfo.set(threadID, threadInfo);
          }
        } catch (error) {
          logger.log(`Thread creation error for ${threadID}: ${error.message}`, "DEBUG");
        }
      }
      
      // Create user data if needed
      if (senderID && !global.data.allUserID.includes(senderID)) {
        try {
          await Users.createData(senderID);
          global.data.allUserID.push(senderID);
          
          // Get user info
          const userInfo = await api.getUserInfo(senderID);
          if (userInfo && userInfo[senderID]) {
            global.data.userName.set(senderID, userInfo[senderID].name);
          }
        } catch (error) {
          logger.log(`User creation error for ${senderID}: ${error.message}`, "DEBUG");
        }
      }
      
      // Create currency data if needed
      if (senderID && !global.data.allCurrenciesID.includes(senderID)) {
        try {
          await Currencies.createData(senderID);
          global.data.allCurrenciesID.push(senderID);
        } catch (error) {
          logger.log(`Currency creation error for ${senderID}: ${error.message}`, "DEBUG");
        }
      }
      
    } catch (error) {
      logger.log(`HandleCreateDatabase error: ${error.message}`, "DEBUG");
    }
  };
};
