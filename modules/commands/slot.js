module.exports.config = {
  name: "slot",
  version: "1.0.1",
  permission: 0,
  credits: "TOHI-BOT-HUB",
  usePrefix: true,
  description: "slot game",
  commandCategory: "game",
  usages: "slot (amount)",
  cooldowns: 5
};

module.exports.languages = {
  "vi": {
    "missingInput": "[ SLOT ] Số tiền đặt cược không được để trống hoặc là số âm",
    "moneyBetNotEnough": "[ SLOT ] Số tiền bạn đặt lớn hơn hoặc bằng số dư của bạn!",
    "limitBet": "[ SLOT ] Số coin đặt không được dưới 50$!",
    "returnWin": "🎰 %1 | %2 | %3 🎰\nBạn đã thắng với %4$",
    "returnLose": "🎰 %1 | %2 | %3 🎰\nBạn đã thua và mất %4$"
  },
  "en": {
    "missingInput": "the bet money must not be blank or a negative number.",
    "moneyBetNotEnough": "the money you betted is bigger than your balance.",
    "limitBet": "your bet is too low, the minimum is 50 pesos.",
    "returnWin": "🎰 %1 | %2 | %3 🎰\nyou won %4$",
    "returnLose": "🎰 %1 | %2 | %3 🎰\nyou lost %4$"
  },
  "bd": {
    "missingInput": "বাজির টাকা খালি বা নেতিবাচক সংখ্যা হতে পারে না।",
    "moneyBetNotEnough": "আপনার বাজি ধরা টাকা আপনার ব্যালেন্সের চেয়ে বেশি।",
    "limitBet": "আপনার বাজি খুব কম, সর্বনিম্ন ৫০ টাকা।",
    "returnWin": "🎰 %1 | %2 | %3 🎰\nআপনি %4$ জিতেছেন",
    "returnLose": "🎰 %1 | %2 | %3 🎰\nআপনি %4$ হেরেছেন"
  },
  "tl": {
    "missingInput": "ang pera sa taya ay hindi dapat blangko o negatibong numero.",
    "moneyBetNotEnough": "ang pera na inyong tinaya ay mas malaki sa inyong balance.",
    "limitBet": "ang inyong taya ay masyadong mababa, minimum ay 50 pesos.",
    "returnWin": "🎰 %1 | %2 | %3 🎰\nnanalo kayo ng %4$",
    "returnLose": "🎰 %1 | %2 | %3 🎰\nnatalo kayo ng %4$"
  },
  "ar": {
    "missingInput": "مبلغ الرهان يجب ألا يكون فارغًا أو رقمًا سالبًا.",
    "moneyBetNotEnough": "المال الذي راهنت عليه أكبر من رصيدك.",
    "limitBet": "رهانك منخفض جدًا، الحد الأدنى 50 بيزو.",
    "returnWin": "🎰 %1 | %2 | %3 🎰\nلقد ربحت %4$",
    "returnLose": "🎰 %1 | %2 | %3 🎰\nلقد خسرت %4$"
  }
};

module.exports.run = async function ({
  api,
  event,
  args,
  Currencies,
  getText
}) {
  // Fallback function for getText if language key is not found
  const getTextSafe = (key, ...args) => {
    try {
      return getText(key, ...args);
    } catch (error) {
      // Fallback to English if current language key is missing
      const fallbackTexts = {
        "missingInput": "the bet money must not be blank or a negative number.",
        "moneyBetNotEnough": "the money you betted is bigger than your balance.",
        "limitBet": "your bet is too low, the minimum is 50 pesos.",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nyou won %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nyou lost %4$"
      };
      
      if (fallbackTexts[key]) {
        let text = fallbackTexts[key];
        args.forEach((arg, index) => {
          text = text.replace(`%${index + 1}`, arg);
        });
        return text;
      }
      return `Language key "${key}" not found`;
    }
  };
  const { threadID, messageID, senderID } = event;
  const { getData, increaseMoney, decreaseMoney } = Currencies;

  const slotItems = ["🖕", "❤️", "👉", "👌", "🥀", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
  const moneyUser = (await getData(senderID)).money;
  const moneyBet = parseInt(args[0]);

  if (isNaN(moneyBet) || moneyBet <= 0) {
    return api.sendMessage(getTextSafe("missingInput"), threadID, messageID);
  }
  if (moneyBet > moneyUser) {
    return api.sendMessage(getTextSafe("moneyBetNotEnough"), threadID, messageID);
  }
  if (moneyBet < 50) {
    return api.sendMessage(getTextSafe("limitBet"), threadID, messageID);
  }

  const number = [];
  let win = false;
  for (let i = 0; i < 3; i++) {
    number[i] = Math.floor(Math.random() * slotItems.length);
  }

  let reward = moneyBet;
  if (number[0] === number[1] && number[1] === number[2]) {
    reward *= 9;
    win = true;
  } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
    reward *= 2;
    win = true;
  }

  const slotDisplay = `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}`;
  if (win) {
    await increaseMoney(senderID, reward);
    return api.sendMessage(getTextSafe("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], reward), threadID, messageID);
  } else {
    await decreaseMoney(senderID, moneyBet);
    return api.sendMessage(getTextSafe("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
  }
};
