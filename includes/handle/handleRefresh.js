module.exports = function ({ api, Users, Threads, Currencies, logger }) {
  return async function handleRefresh({ event }) {
    try {
      if (!event || event.type !== "event") return;

      const { threadID, logMessageData } = event;

      // Handle thread info refresh for join/leave events
      if (event.logMessageType === "log:subscribe" || event.logMessageType === "log:unsubscribe") {
        try {
          // Get fresh thread info
          const threadInfo = await api.getThreadInfo(threadID);
          if (threadInfo) {
            global.data.threadInfo.set(threadID, threadInfo);

            // Update thread data if not exists
            if (!global.data.threadData.has(threadID)) {
              global.data.threadData.set(threadID, {});
              global.data.allThreadID.push(threadID);
            }
          }
        } catch (error) {
          logger.log(`Thread refresh error for ${threadID}: ${error.message}`, "DEBUG");
        }
      }

      // Handle user info refresh
      if (logMessageData && logMessageData.addedParticipants) {
        for (const participant of logMessageData.addedParticipants) {
          try {
            const userID = participant.userFbId;
            if (userID && !global.data.userName.has(userID)) {
              const userInfo = await api.getUserInfo(userID);
              if (userInfo && userInfo[userID]) {
                global.data.userName.set(userID, userInfo[userID].name);
                global.data.allUserID.push(userID);
              }
            }
          } catch (error) {
            logger.log(`User refresh error: ${error.message}`, "DEBUG");
          }
        }
      }

    } catch (error) {
      logger.log(`HandleRefresh error: ${error.message}`, "DEBUG");
    }
  };
};