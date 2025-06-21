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
          enabled: false,
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
        try {
          const configPath = require('path').join(__dirname, "../../config.json");
          delete require.cache[require.resolve(configPath)];
          const config = require(configPath);

          // Check in multiple possible locations
          if (config.APPROVAL?.approvedGroups?.includes(String(threadID)) || 
              config.APPROVAL?.approvedGroups?.includes(threadID) ||
              config.approvedGroups?.includes(String(threadID)) ||
              config.approvedGroups?.includes(threadID)) {
            
            // Create data entry for approved group and approve it
            this.setData(threadID, {
              threadID: threadID,
              threadName: "Legacy Approved Group",
              status: "approved",
              memberCount: 0,
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
              migratedAt: new Date().toISOString(),
              settings: {
                allowCommands: true,
                autoApprove: false
              }
            });
            
            console.log(`✅ Migrated approved group: ${threadID}`);
            return true;
          }
        } catch (configError) {
          console.log(`Config check error for ${threadID}:`, configError.message);
        }
        
        // If no legacy approval found, return false (group needs manual approval)
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
        let migratedCount = 0;

        // Check multiple possible config structures
        const approvedSources = [
          config.APPROVAL?.approvedGroups,
          config.approvedGroups,
          config.APPROVED_GROUPS
        ];

        const pendingSources = [
          config.APPROVAL?.pendingGroups,
          config.pendingGroups,
          config.PENDING_GROUPS
        ];

        const rejectedSources = [
          config.APPROVAL?.rejectedGroups,
          config.rejectedGroups,
          config.REJECTED_GROUPS
        ];

        // Migrate approved groups from any source
        approvedSources.forEach(source => {
          if (Array.isArray(source)) {
            source.forEach(threadID => {
              const id = String(threadID);
              if (!this.getData(id)) {
                this.setData(id, {
                  threadID: id,
                  threadName: "Legacy Approved Group",
                  memberCount: 0,
                  status: "approved",
                  createdAt: new Date().toISOString(),
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: true, autoApprove: false }
                });
                migratedCount++;
              }
            });
          }
        });

        // Migrate pending groups
        pendingSources.forEach(source => {
          if (Array.isArray(source)) {
            source.forEach(threadID => {
              const id = String(threadID);
              if (!this.getData(id)) {
                this.setData(id, {
                  threadID: id,
                  threadName: "Legacy Pending Group",
                  memberCount: 0,
                  status: "pending",
                  createdAt: new Date().toISOString(),
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: false, autoApprove: false }
                });
                migratedCount++;
              }
            });
          }
        });

        // Migrate rejected groups
        rejectedSources.forEach(source => {
          if (Array.isArray(source)) {
            source.forEach(threadID => {
              const id = String(threadID);
              if (!this.getData(id)) {
                this.setData(id, {
                  threadID: id,
                  threadName: "Legacy Rejected Group",
                  memberCount: 0,
                  status: "rejected",
                  createdAt: new Date().toISOString(),
                  migratedAt: new Date().toISOString(),
                  settings: { allowCommands: false, autoApprove: false }
                });
                migratedCount++;
              }
            });
          }
        });

        // Migrate auto approve settings
        if (config.AUTO_APPROVE) {
          this.updateSettings({
            autoApprove: {
              enabled: config.AUTO_APPROVE.enabled !== false,
              autoApproveMessage: config.AUTO_APPROVE.autoApproveMessage || false
            }
          });
        } else {
          // Default to enabled for backwards compatibility
          this.updateSettings({
            autoApprove: {
              enabled: true,
              autoApproveMessage: false
            }
          });
        }

        // Mark as migrated
        this.updateSettings({ migrated: true });

        if (migratedCount > 0) {
          console.log(`✅ Migration completed! Migrated ${migratedCount} groups from config.json`);
        }
        
        return true;
      } catch (error) {
        console.error("Error migrating from config:", error);
        return false;
      }
    }
  };

  // Auto migrate on first initialization only
  try {
    const migrated = Groups.migrateFromConfig();
    if (migrated) {
      console.log("✅ Legacy groups migration completed successfully");
    }
  } catch (error) {
    console.log("⚠️ Migration skipped:", error.message);
  }

  return Groups;
};