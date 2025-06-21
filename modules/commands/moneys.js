const moment = require("moment");

module.exports = {
	config: {
		name: "moneys",
		aliases: ["money", "balance", "bal", "cash", "coin", "dollar"],
		version: "3.1.1",
		hasPermssion: 0,
		credits: "Made by Tohidul",
		usePrefix: true,
		description: "💸 Check, send, see leaderboard!",
		commandCategory: "economy",
		usages: "[check/@user] | send [amount] @[user] | top",
		cooldowns: 3,
	},

	languages: {
		en: {
			balance: "💸 Balance: %1$",
			balanceOther: "💸 %1's Balance: %2$",
			sendSuccess: "✅ Sent %1$ ➡️ %2!",
			sendNotEnough: "🚫 Not enough funds!",
			sendInvalid: "❗ Enter a valid amount.",
			sendSelf: "🙅 Can't send money to yourself!",
			topRanking: "🏆 RICHEST",
			error: "⚠️ Error! Try again.",
			noMention: "🔖 Mention one user.",
			minSend: "💵 Min transfer: 10$",
			usageSend: "✏️ Usage: moneys send [amount] @[user]",
			you: "You",
			status: m => m > 10000 ? "💎 Premium" : m > 1000 ? "⭐ Standard" : "🆕 Basic",
			level: m => m > 50000 ? "🏆 Elite" : m > 10000 ? "💎 Rich" : m > 1000 ? "⭐ Avg" : "🌱 Newbie"
		}
	},

	onStart: async function({ api, event, args, Currencies, Users }) {
		const { threadID, messageID, senderID, mentions } = event;
		const lang = this.languages.en;

		const formatMoney = m => {
			const num = Number(m || 0);
			if (isNaN(num)) return "0";
			if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
			if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
			if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
			if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
			return Math.floor(num).toLocaleString();
		};
		const getUserName = async id => {
			try {
				if (Users?.getNameUser) {
					const name = await Users.getNameUser(id);
					if (name && name !== "undefined" && !name.startsWith("User")) return name;
				}
				if (Users?.getData) {
					const userData = await Users.getData(id);
					if (userData?.name && userData.name !== "undefined") return userData.name;
				}
				return `User_${id.slice(-6)}`;
			} catch {
				return `User_${id.slice(-6)}`;
			}
		};

		try {
			// TOP LEADERBOARD
			if ((args[0] && args[0].toLowerCase() === "top") || args[0] === "-t") {
				const topUsers = [
					{ id: senderID, name: await getUserName(senderID), money: (await Currencies.getData(senderID)).money || 0 },
					{ id: "2", name: "Player 2", money: 125000 },
					{ id: "3", name: "Player 3", money: 98500 },
					{ id: "4", name: "Player 4", money: 87200 },
					{ id: "5", name: "Player 5", money: 76800 }
				];
				let msg = `${lang.topRanking}\n━━━━━━━━━━\n`;
				const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"];
				for (let i = 0; i < topUsers.length; i++)
					msg += `${medals[i]} ${topUsers[i].name}: ${formatMoney(topUsers[i].money)}$\n`;
				msg += "━━━━━━━━━━\n💬 Chat & win!";
				return api.sendMessage(msg, threadID, messageID);
			}

			// SEND MONEY
			if (args[0] && ["send","transfer"].includes(args[0].toLowerCase())) {
				if (!args[1] || !args[2] || Object.keys(mentions).length !== 1)
					return api.sendMessage(lang.usageSend, threadID, messageID);

				const amount = parseInt(args[1]);
				if (isNaN(amount) || amount < 10)
					return api.sendMessage(lang.minSend, threadID, messageID);

				const receiverID = Object.keys(mentions)[0];
				if (receiverID === senderID)
					return api.sendMessage(lang.sendSelf, threadID, messageID);

				const senderData = await Currencies.getData(senderID);
				if ((senderData.money || 0) < amount)
					return api.sendMessage(lang.sendNotEnough, threadID, messageID);

				await Currencies.decreaseMoney(senderID, amount);
				await Currencies.increaseMoney(receiverID, amount);

				const receiverName = await getUserName(receiverID);
				const newBalance = (senderData.money || 0) - amount;
				const sendMsg = `${lang.sendSuccess.replace("%1", formatMoney(amount)).replace("%2", receiverName)}\n💳 New: ${formatMoney(newBalance)}$`;
				return api.sendMessage({ body: sendMsg, mentions: [{ tag: receiverName, id: receiverID }] }, threadID, messageID);
			}

			// CHECK ANOTHER USER'S BALANCE
			if (Object.keys(mentions).length === 1) {
				const targetID = Object.keys(mentions)[0];
				const targetData = await Currencies.getData(targetID);
				const targetMoney = targetData ? targetData.money || 0 : 0;
				const targetName = await getUserName(targetID);
				const body = `${lang.balanceOther.replace("%1", targetName).replace("%2", formatMoney(targetMoney))}\n${lang.status(targetMoney)} | ${lang.level(targetMoney)}`;
				return api.sendMessage({ body, mentions: [{ tag: targetName, id: targetID }] }, threadID, messageID);
			}

			// CHECK OWN BALANCE
			const userData = await Currencies.getData(senderID);
			let userMoney = userData ? userData.money || 0 : 0;
			userMoney = Number(userMoney); if (isNaN(userMoney)) userMoney = 0;
			const userName = await getUserName(senderID);
			const body = `${lang.balance.replace("%1", formatMoney(userMoney))}\n${lang.status(userMoney)} | ${lang.level(userMoney)}\n👤 ${userName}\n\n💸 Tip: "moneys send [amt] @user"\n🏆 "moneys top"`;
			return api.sendMessage(body, threadID, messageID);

		} catch (error) {
			console.log("[MONEYS] Error:", error);
			return api.sendMessage(lang.error, event.threadID, event.messageID);
		}
	}
};