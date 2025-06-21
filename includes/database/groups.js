module.exports = function({ api }) {
  const fs = require("fs-extra");
  const path = require("path");

  const configPath = path.join(__dirname, "../../config.json");
  const groupsDataPath = path.join(__dirname, "data/groupsData.json");

  // Initialize groups data file if not exists
  if (!fs.existsSync(groupsDataPath)) {
    fs.writeFileSync(groupsDataPath, JSON.stringify({
      settings: {
        autoApprove: {
          enabled: true,
          autoApproveMessage: false
        },
        migrated: false
      },
      groups: {}
    }, null, 2));
  }

  const Groups = {
    // Get all groups data
    getAll: function() {
      try {
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        return data.groups || {};
      } catch (error) {
        console.error("Error reading groups data:", error);
        return {};
      }
    },

    // Get settings
    getSettings: function() {
      try {
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        return data.settings || {
          autoApprove: {
            enabled: true,
            autoApproveMessage: false
          }
        };
      } catch (error) {
        return {
          autoApprove: {
            enabled: true,
            autoApproveMessage: false
          }
        };
      }
    },

    // Update settings
    updateSettings: function(newSettings) {
      try {
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        data.settings = { ...data.settings, ...newSettings };
        fs.writeFileSync(groupsDataPath, JSON.stringify(data, null, 2));
        return true;
      } catch (error) {
        console.error("Error updating settings:", error);
        return false;
      }
    },

    // Get specific group data
    getData: function(threadID) {
      const allGroups = this.getAll();
      return allGroups[threadID] || null;
    },

    // Set group data
    setData: function(threadID, groupData) {
      try {
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        if (!data.groups) data.groups = {};

        data.groups[threadID] = {
          ...data.groups[threadID],
          ...groupData,
          lastUpdated: new Date().toISOString()
        };

        fs.writeFileSync(groupsDataPath, JSON.stringify(data, null, 2));
        return true;
      } catch (error) {
        console.error("Error setting group data:", error);
        return false;
      }
    },

    // Create new group data
    createData: async function(threadID) {
      try {
        const groupInfo = await api.getThreadInfo(threadID);
        const groupData = {
          threadID: threadID,
          threadName: groupInfo.threadName || "Unknown Group",
          memberCount: groupInfo.participantIDs ? groupInfo.participantIDs.length : 0,
          status: "pending", // pending, approved, rejected
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          adminList: groupInfo.adminIDs || [],
          settings: {
            allowCommands: false,
            autoApprove: false
          }
        };

        this.setData(threadID, groupData);
        return groupData;
      } catch (error) {
        console.error("Error creating group data:", error);
        return null;
      }
    },

    // Approve group
    approveGroup: function(threadID) {
      try {
        this.setData(threadID, {
          status: "approved",
          approvedAt: new Date().toISOString(),
          settings: {
            allowCommands: true,
            autoApprove: false
          }
        });

        return true;
      } catch (error) {
        console.error("Error approving group:", error);
        return false;
      }
    },

    // Reject group
    rejectGroup: function(threadID) {
      try {
        this.setData(threadID, {
          status: "rejected",
          rejectedAt: new Date().toISOString(),
          settings: {
            allowCommands: false,
            autoApprove: false
          }
        });

        return true;
      } catch (error) {
        console.error("Error rejecting group:", error);
        return false;
      }
    },

    // Add to pending
    addToPending: function(threadID) {
      try {
        this.setData(threadID, {
          status: "pending",
          pendingAt: new Date().toISOString(),
          settings: {
            allowCommands: false,
            autoApprove: false
          }
        });

        return true;
      } catch (error) {
        console.error("Error adding to pending:", error);
        return false;
      }
    },

    // Check if group is approved
    isApproved: function(threadID) {
    try {
      const data = this.getData(threadID);

      // If no data exists, check legacy config.json approval system
      if (!data) {
        const { configPath } = global.client;
        if (configPath) {
          delete require.cache[require.resolve(configPath)];
          const config = require(configPath);

          if (config.APPROVAL?.approvedGroups?.includes(String(threadID))) {
            // Create data entry for approved group
            this.createData(threadID);
            this.approveGroup(threadID);
            return true;
          }
        }
        return false;
      }

      return data.status === 'approved';
    } catch (error) {
      console.log(`Error checking approval for ${threadID}:`, error.message);
      return false;
    }
  },

    // Check if group is pending
    isPending: function(threadID) {
      const groupData = this.getData(threadID);
      return groupData && groupData.status === "pending";
    },

    // Check if group is rejected
    isRejected: function(threadID) {
      const groupData = this.getData(threadID);
      return groupData && groupData.status === "rejected";
    },

    // Get groups by status
    getByStatus: function(status) {
      const allGroups = this.getAll();
      const result = [];

      for (const [threadID, groupData] of Object.entries(allGroups)) {
        if (groupData.status === status) {
          result.push({ threadID, ...groupData });
        }
      }

      return result;
    },

    // Get approved groups list (for compatibility)
    getApprovedGroups: function() {
      return this.getByStatus("approved").map(group => group.threadID);
    },

    // Get pending groups list (for compatibility)
    getPendingGroups: function() {
      return this.getByStatus("pending").map(group => group.threadID);
    },

    // Get rejected groups list (for compatibility)
    getRejectedGroups: function() {
      return this.getByStatus("rejected").map(group => group.threadID);
    },

    // Remove group completely
    removeGroup: function(threadID) {
      try {
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        if (data.groups && data.groups[threadID]) {
          delete data.groups[threadID];
          fs.writeFileSync(groupsDataPath, JSON.stringify(data, null, 2));
        }
        return true;
      } catch (error) {
        console.error("Error removing group:", error);
        return false;
      }
    },

    // Check if auto approve is enabled
    isAutoApproveEnabled: function() {
      const settings = this.getSettings();
      return settings.autoApprove && settings.autoApprove.enabled;
    },

    // Enable/disable auto approve
    setAutoApprove: function(enabled) {
      return this.updateSettings({
        autoApprove: {
          ...this.getSettings().autoApprove,
          enabled: enabled
        }
      });
    },

    // Migrate old config data (if exists)
    migrateFromConfig: function() {
      try {
        // Check if already migrated
        const data = JSON.parse(fs.readFileSync(groupsDataPath, "utf8"));
        if (data.settings && data.settings.migrated === true) {
          return false; // Already migrated, skip silently
        }

        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

        if (config.APPROVAL) {
          // Migrate approved groups
          if (config.APPROVAL.approvedGroups) {
            config.APPROVAL.approvedGroups.forEach(threadID => {
              if (!this.getData(threadID)) {
                this.setData(threadID, {
                  threadID: threadID,
                  threadName: "Migrated Group",
                  status: "approved",
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: true }
                });
              }
            });
          }

          // Migrate pending groups
          if (config.APPROVAL.pendingGroups) {
            config.APPROVAL.pendingGroups.forEach(threadID => {
              if (!this.getData(threadID)) {
                this.setData(threadID, {
                  threadID: threadID,
                  threadName: "Migrated Group",
                  status: "pending",
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: false }
                });
              }
            });
          }

          // Migrate rejected groups
          if (config.APPROVAL.rejectedGroups) {
            config.APPROVAL.rejectedGroups.forEach(threadID => {
              if (!this.getData(threadID)) {
                this.setData(threadID, {
                  threadID: threadID,
                  threadName: "Migrated Group",
                  status: "rejected",
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: false }
                });
              }
            });
          }
        }

        // Migrate auto approve settings
        if (config.AUTO_APPROVE) {
          this.updateSettings({
            autoApprove: {
              enabled: config.AUTO_APPROVE.enabled || true,
              autoApproveMessage: config.AUTO_APPROVE.autoApproveMessage || false
            }
          });
        }

        // Mark as migrated
        this.updateSettings({ migrated: true });

        console.log("✅ Migration from config.json completed successfully!");
        return true;
      } catch (error) {
        console.error("Error migrating from config:", error);
        return false;
      }
    }
  };

  // Auto migrate on first initialization only
  Groups.migrateFromConfig();

  return Groups;
};