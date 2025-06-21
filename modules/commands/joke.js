
module.exports.config = {
	name: "joke",
	version: "1.0.0",
	permission: 0,
	credits: "TOHI-BOT-HUB",
	description: "Get a random joke in English or Bengali to brighten your day",
	usePrefix: true,
	commandCategory: "fun",
	usages: "joke",
	cooldowns: 3
};

module.exports.languages = {
	"vi": {
		"loading": "Đang tải joke...",
		"error": "Không thể tải joke, vui lòng thử lại sau!",
		"jokeTitle": "🤣 JOKE CỦA NGÀY 🤣"
	},
	"en": {
		"loading": "Loading joke...",
		"error": "Could not fetch joke, please try again later!",
		"jokeTitle": "🤣 JOKE OF THE DAY 🤣"
	},
	"bd": {
		"loading": "জোক লোড করা হচ্ছে...",
		"error": "জোক আনতে পারছি না, আবার চেষ্টা করুন!",
		"jokeTitle": "🤣 আজকের জোক 🤣"
	}
};

module.exports.run = async function({ api, event, getText }) {
	const { threadID, messageID } = event;
	
	try {
		// Send loading message
		const loadingMsg = await api.sendMessage(getText("loading"), threadID);
		
		// Fetch joke from API
		const axios = require("axios");
		const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
		
		if (response.data && response.data.setup && response.data.punchline) {
			const joke = response.data;
			
			const message = `${getText("jokeTitle")}\n\n` +
				`📝 ${joke.setup}\n\n` +
				`💡 ${joke.punchline}\n\n` +
				`📂 Category: ${joke.type || "General"}\n` +
				`🆔 ID: ${joke.id || "Unknown"}`;
			
			// Delete loading message and send joke
			api.unsendMessage(loadingMsg.messageID);
			return api.sendMessage(message, threadID, messageID);
			
		} else {
			// Fallback jokes if API fails
			const englishJokes = [
				{
					setup: "Why don't scientists trust atoms?",
					punchline: "Because they make up everything!"
				},
				{
					setup: "Why did the scarecrow win an award?",
					punchline: "Because he was outstanding in his field!"
				},
				{
					setup: "Why don't eggs tell jokes?",
					punchline: "They'd crack each other up!"
				},
				{
					setup: "What do you call a fake noodle?",
					punchline: "An impasta!"
				},
				{
					setup: "Why did the math book look so sad?",
					punchline: "Because it was full of problems!"
				}
			];

			const banglaJokes = [
				{
					setup: "ডাক্তার: আপনার কি মনে হয় আপনার স্মৃতিশক্তি কমে গেছে?",
					punchline: "রোগী: আমি কি ডাক্তার দেখাতে এসেছি?"
				},
				{
					setup: "স্ত্রী: তুমি আমাকে কখনো সুন্দর বলো না কেন?",
					punchline: "স্বামী: আমি তো মিথ্যা বলি না! 😅"
				},
				{
					setup: "শিক্ষক: তোমার বাবা কি করেন?",
					punchline: "ছাত্র: মা'র সাথে ঝগড়া করেন!"
				},
				{
					setup: "ছেলে: বাবা, আমি পরীক্ষায় ফেল করেছি।",
					punchline: "বাবা: কোনো সমস্যা নেই, তোমার মামাও তো ফেল করেছিল!"
				},
				{
					setup: "রোগী: ডাক্তার সাহেব, আমার কানে কিছু শুনতে পাচ্ছি না।",
					punchline: "ডাক্তার: এই ট্যাবলেট খান। রোগী: এতে কান ভালো হবে? ডাক্তার: না, কিন্তু আওয়াজ বাড়বে!"
				},
				{
					setup: "স্ত্রী: আমি যদি মরে যাই তুমি কি আবার বিয়ে করবে?",
					punchline: "স্বামী: না, আমি তো একবারই ভুল করেছি! 😂"
				},
				{
					setup: "ছাত্র: স্যার, আমি হোমওয়ার্ক আনতে ভুলে গেছি।",
					punchline: "শিক্ষক: তুমি রোজ ভুলে যাও, তোমার মেমোরি কার্ড নষ্ট নাকি?"
				},
				{
					setup: "বন্ধু: তোর গার্লফ্রেন্ড কেমন?",
					punchline: "আমি: ভালো, কিন্তু আমার বউ জানলে মেরে ফেলবে! 😅"
				}
			];

			// Randomly choose between English and Bengali jokes
			const useEnglish = Math.random() > 0.5;
			const fallbackJokes = useEnglish ? englishJokes : banglaJokes;
			
			const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
			
			const message = `${getText("jokeTitle")}\n\n` +
				`📝 ${randomJoke.setup}\n\n` +
				`💡 ${randomJoke.punchline}\n\n` +
				`📂 Category: Fallback Jokes`;
			
			api.unsendMessage(loadingMsg.messageID);
			return api.sendMessage(message, threadID, messageID);
		}
		
	} catch (error) {
		console.error("Joke command error:", error);
		return api.sendMessage(getText("error"), threadID, messageID);
	}
};
