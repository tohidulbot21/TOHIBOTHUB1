
module.exports = function ({ models, Users }) {
	const { readFileSync, writeFileSync } = require("fs-extra");
	var path = __dirname + "/data/usersData.json";
    
    let Currencies = {};
    try {
        const data = readFileSync(path, 'utf8');
        Currencies = JSON.parse(data);
    } catch {
        writeFileSync(path, "{}", 'utf8');
        Currencies = {};
    }

	async function saveData(data) {
        try {
            if (!data) throw new Error('Data cannot be left blank');
            writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
            return true;
        } catch (error) {
            console.log(`[CURRENCIES] Save error: ${error.message}`);
            return false;
        }
    }

	async function getData(userID) {
		try {
			if (!userID) throw new Error("User ID cannot be blank");
            userID = String(userID);
            if (isNaN(userID)) throw new Error("Invalid user ID");
            
            // Reload data from file to ensure we have latest data
            try {
                const fileData = readFileSync(path, 'utf8');
                Currencies = JSON.parse(fileData);
            } catch (reloadError) {
                console.log(`[CURRENCIES] Failed to reload data: ${reloadError.message}`);
            }
            
            // Check if user exists in currencies data
            if (!Currencies.hasOwnProperty(userID)) {
                console.log(`[CURRENCIES] User ID: ${userID} does not exist, creating...`);
                
                // Create user data
                const newUserData = {
                    userID: userID,
                    money: 0,
                    exp: 0,
                    createTime: {
                        timestamp: Date.now()
                    },
                    data: {
                        timestamp: Date.now()
                    },
                    lastUpdate: Date.now()
                };
                
                Currencies[userID] = newUserData;
                await saveData(Currencies);
                
                // Also try to create in Users database
                try {
                    await Users.createData(userID);
                } catch (createError) {
                    console.log(`[CURRENCIES] Failed to create user in Users DB: ${createError.message}`);
                }
                
                return newUserData;
            }
            
            // Return existing user data
            const userData = Currencies[userID];
            
            // Ensure money and exp are numbers
            if (typeof userData.money !== 'number') userData.money = 0;
            if (typeof userData.exp !== 'number') userData.exp = 0;
            
            return userData;
            
		} catch (error) {
			console.log(`[CURRENCIES] Error getting data for ${userID}: ${error.message}`);
			// Return default data instead of false
			return { userID: userID, money: 0, exp: 0, createTime: { timestamp: Date.now() }, data: { timestamp: Date.now() }, lastUpdate: Date.now() };
		}
	}

	async function setData(userID, options = {}) {
		try {
            if (!userID) throw new Error("User ID cannot be blank");
            userID = String(userID);
            if (isNaN(userID)) throw new Error("Invalid user ID");
            if (typeof options != 'object') throw new Error("The options parameter passed must be an object");
            
            // Ensure user exists
            if (!Currencies.hasOwnProperty(userID)) {
                await getData(userID); // This will create the user
            }
            
            Currencies[userID] = {...Currencies[userID], ...options, lastUpdate: Date.now()};
            await saveData(Currencies);
            return Currencies[userID];
        } catch (error) {
            console.log(`[CURRENCIES] Set data error for ${userID}: ${error.message}`);
            return false;
        }
	}

	async function delData(userID, callback) {
		try {
            if (!userID) throw new Error("User ID cannot be blank");
            userID = String(userID);
            if (isNaN(userID)) throw new Error("Invalid user ID");
            
            if (!Currencies.hasOwnProperty(userID)) {
                await getData(userID); // Create if doesn't exist
            }
            
            Currencies[userID].money = 0;
            Currencies[userID].lastUpdate = Date.now();
            await saveData(Currencies);
            
            if (callback && typeof callback == "function") callback(null, Currencies);
            return Currencies;
        } catch (error) {
            console.log(`[CURRENCIES] Delete data error for ${userID}: ${error.message}`);
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
	}

	async function increaseMoney(userID, money) {
		try {
            if (typeof money != 'number') throw new Error("Money must be a number");
            if (money < 0) throw new Error("Money cannot be negative");
            
            userID = String(userID);
            let userData = await getData(userID);
            let currentMoney = userData.money || 0;
            
            await setData(userID, { money: currentMoney + money });
            return true;
        } catch (error) {
            console.log(`[CURRENCIES] Increase money error for ${userID}: ${error.message}`);
            return false;
        }
	}

	async function decreaseMoney(userID, money) {
		try {
            if (typeof money != 'number') throw new Error("Money must be a number");
            if (money < 0) throw new Error("Money cannot be negative");
            
            userID = String(userID);
            let userData = await getData(userID);
            let currentMoney = userData.money || 0;
            
            if (currentMoney < money) return false;
            
            await setData(userID, { money: currentMoney - money });
            return true;
        } catch (error) {
            console.log(`[CURRENCIES] Decrease money error for ${userID}: ${error.message}`);
            return false;
        }
	}

	return {
		getData,
		setData,
		delData,
		increaseMoney,
		decreaseMoney
	};
};
