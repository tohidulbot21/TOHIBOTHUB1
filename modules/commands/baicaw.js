module.exports.config = {
  name: "baicao",
  version: "2.0.1",
  usePrefix: true,
  hasPermssion: 0,
  credits: "Made by Tohidul",
  description: "Baicao card game for groups with betting options.",
  commandCategory: "Game",
  usages: "[create/start/join/info/leave/check]",
  cooldowns: 5
};

module.exports.handleEvent = async ({ Currencies, event, api, Users }) => {
  const fs = require("fs-extra");
  const { senderID, threadID, body, messageID } = event;
  if (typeof body == "undefined") return;
  if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
  if (!global.moduleData.baicao.has(threadID)) return;
  var values = global.moduleData.baicao.get(threadID);
  if (values.start != 1) return;

  const deckShuffel = values.deckShuffel;

  if (body.indexOf("Deal cards") == 0) {
    if (values.chiabai == 1) return;
    for (const key in values.player) {
      const card1 = deckShuffel.shift();
      const card2 = deckShuffel.shift();
      const card3 = deckShuffel.shift();
      var total = (card1.Weight + card2.Weight + card3.Weight);
      if (total >= 20) total -= 20;
      if (total >= 10) total -= 10;
      values.player[key].card1 = card1;
      values.player[key].card2 = card2;
      values.player[key].card3 = card3;
      values.player[key].total = total;

      const linkCards = [];

      for (let i = 1; i < 4; i++) {
        const Card = values.player[key]["card" + i];
        linkCards.push(getLinkCard(Card.Value, Card.Suit));
      }

      const pathSave = __dirname + `/cache/card${values.player[key].id}.png`;
      fs.writeFileSync(pathSave, await drawCard(linkCards));

      api.sendMessage({
        body: `Your cards: ${card1.Icon}${card1.Value} | ${card2.Icon}${card2.Value} | ${card3.Icon}${card3.Value}\n\nYour total: ${total}`,
        attachment: fs.createReadStream(pathSave)
      }, values.player[key].id, (error, info) => {
        if (error) return api.sendMessage(`Cannot deal cards to ${values.player[key].id}`, threadID);
        fs.unlinkSync(pathSave);
      });
    }
    values.chiabai = 1;
    global.moduleData.baicao.set(threadID, values);
    return api.sendMessage("Cards have been dealt successfully! Everyone has 2 chances to change cards. If you can't find your cards, please check your message requests.", threadID);
  }

  if (body.indexOf("Change card") == 0) {
    if (values.chiabai != 1) return;
    var player = values.player.find(item => item.id == senderID);
    if (player.doibai == 0) return api.sendMessage("You've used all your card changes.", threadID, messageID);
    if (player.ready == true) return api.sendMessage("You are already ready, you cannot change cards!", threadID, messageID);
    const card = ["card1", "card2", "card3"];
    player[card[(Math.floor(Math.random() * card.length))]] = deckShuffel.shift();
    player.total = (player.card1.Weight + player.card2.Weight + player.card3.Weight);
    if (player.total >= 20) player.total -= 20;
    if (player.total >= 10) player.total -= 10;
    player.doibai -= 1;
    global.moduleData.baicao.set(threadID, values);

    const linkCards = [];
    for (let i = 1; i < 4; i++) {
      const Card = player["card" + i];
      linkCards.push(getLinkCard(Card.Value, Card.Suit));
    }
    const pathSave = __dirname + `/cache/card${player.id}.png`;
    fs.writeFileSync(pathSave, await drawCard(linkCards));

    return api.sendMessage({
      body: `Your cards after change: ${player.card1.Icon}${player.card1.Value} | ${player.card2.Icon}${player.card2.Value} | ${player.card3.Icon}${player.card3.Value}\n\nYour total: ${player.total}`,
      attachment: fs.createReadStream(pathSave)
    }, player.id, (error, info) => {
      if (error) return api.sendMessage(`Cannot change cards for ${player.id}`, threadID);
      fs.unlinkSync(pathSave);
    });
  }

  if (body.indexOf("ready") == 0) {
    if (values.chiabai != 1) return;
    var player = values.player.find(item => item.id == senderID);
    if (player.ready == true) return;
    const name = await Users.getNameUser(player.id);
    values.ready += 1;
    player.ready = true;
    if (values.player.length == values.ready) {
      const playerArr = values.player;
      playerArr.sort(function (a, b) { return b.total - a.total });

      var ranking = [], num = 1;

      for (const info of playerArr) {
        const name = await Users.getNameUser(info.id);
        ranking.push(`${num++} • ${name}: ${info.card1.Icon}${info.card1.Value} | ${info.card2.Icon}${info.card2.Value} | ${info.card3.Icon}${info.card3.Value} => ${info.total} points\n`);
      }

      try {
        await Currencies.increaseMoney(playerArr[0].id, values.rateBet * playerArr.length);
      } catch (e) {};
      global.moduleData.baicao.delete(threadID);

      return api.sendMessage(`Results:\n\n ${ranking.join("\n")}\n\nThe winner receives ${values.rateBet * playerArr.length}$`, threadID);
    }
    else return api.sendMessage(`Player ${name} is ready to reveal cards. Waiting for ${values.player.length - values.ready} more players.`, event.threadID);
  }

  if (body.indexOf("nonready") == 0) {
    const data = values.player.filter(item => item.ready == false);
    var msg = [];

    for (const info of data) {
      const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
      msg.push(name);
    }
    if (msg.length != 0) return api.sendMessage("Players who are not ready: " + msg.join(", "), threadID);
    else return;
  }
}

module.exports.run = async ({ api, event, args, Currencies }) => {
  var { senderID, threadID, messageID } = event;
  if (args.length == 0) return api.sendMessage(
    `===== [ BAICAO ] =====\nEach player is dealt three cards. Players can view their cards privately or publicly and tally points. The player's points in each round are the units digit of the sum of the three cards. Winner takes all.\n\nHow to play Baicao:\n» create: create a baicao table\n» join: join a baicao table\n» start: start the game\n  • Deal cards: deal cards to players\n  • Change card: change your card (each player has 2 chances)\n  • ready: ready to reveal cards\n» info: see baicao table info\n» check: check players' inbox status\n» leave: leave the table`,
    event.threadID, event.messageID
  );
  senderID = String(senderID);

  if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
  var values = global.moduleData.baicao.get(threadID) || {};
  var data = await Currencies.getData(event.senderID);
  var money = data.money

  switch (args[0]) {
    case "create":
    case "-c": {
      if (global.moduleData.baicao.has(threadID)) return api.sendMessage("A baicao table is already open in this group.", threadID, messageID);
      if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 1) return api.sendMessage("Your bet is not a number or is less than $1.", threadID, messageID);
      if (money < args[1]) return api.sendMessage(`You don't have enough money to create a table with a bet of: ${args[1]}$`, event.threadID, event.messageID);
      await Currencies.decreaseMoney(event.senderID, Number(args[1]));
      global.moduleData.baicao.set(event.threadID, { "author": senderID, "start": 0, "chiabai": 0, "ready": 0, player: [{ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false }], rateBet: Number(args[1]) });
      return api.sendMessage(`Your baicao table has been created successfully. To join, type 'baicao join'`, event.threadID, event.messageID);
    }

    case "join":
    case "-j": {
      if (!values) return api.sendMessage("No baicao table exists yet; you can create one using 'baicao create'", threadID, messageID);
      if (values.start == 1) return api.sendMessage("The baicao table has already started.", threadID, messageID);
      if (money < values.rateBet) return api.sendMessage(`You don't have enough ($${values.rateBet}) to join this baicao table.`, event.threadID, event.messageID)
      if (values.player.find(item => item.id == senderID)) return api.sendMessage("You have already joined this baicao table!", threadID, messageID);
      values.player.push({ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "total": 0, "doibai": 2, "ready": false });
      await Currencies.decreaseMoney(event.senderID, values.rateBet);
      global.moduleData.baicao.set(threadID, values);
      return api.sendMessage("You have joined successfully!", threadID, messageID);
    }

    case "leave":
    case "-l": {
      if (typeof values.player == "undefined") return api.sendMessage("No baicao table exists yet; you can create one using 'baicao create'", threadID, messageID);
      if (!values.player.some(item => item.id == senderID)) return api.sendMessage("You have not joined a baicao table in this group!", threadID, messageID);
      if (values.start == 1) return api.sendMessage("The baicao table has already started.", threadID, messageID);
      if (values.author == senderID) {
        global.moduleData.baicao.delete(threadID);
        api.sendMessage("The author has left the table, so the table has been dissolved!", threadID, messageID);
      }
      else {
        values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
        api.sendMessage("You have left the baicao table!", threadID, messageID);
        global.moduleData.baicao.set(threadID, values);
      }
      return;
    }

    case 'check': {
      for (const key in values.player) {
        api.sendMessage(`Can you see this message?`, values.player[key].id, (error, info) => {
          if (error) return api.sendMessage(`Cannot message ${values.player[key].id}`, threadID);
        });
      }
      return api.sendMessage("Checking players' inbox status...", threadID);
    }

    case "start":
    case "-s": {
      if (!values) return api.sendMessage("No baicao table exists yet; you can create one using 'baicao create'", threadID, messageID);
      if (values.author !== senderID) return api.sendMessage("You are not the table owner and cannot start the game.", threadID, messageID);
      if (values.player.length <= 1) return api.sendMessage("No other players have joined yet; ask others to join by typing 'baicao join'.", threadID, messageID);
      if (values.start == 1) return api.sendMessage("The table has already been started by the owner.", threadID, messageID);
      values.deckShuffel = createDeck();
      values.start = 1;
      return api.sendMessage("Your baicao table has started.", threadID, messageID);
    }

    case "info":
    case "-i": {
      if (typeof values.player == "undefined") return api.sendMessage("No baicao table exists yet; you can create one using 'baicao create'", threadID, messageID);
      return api.sendMessage(
        "=== [ BAICAO ] ===" +
        "\n- Table Owner: " + values.author +
        "\n- Total players: " + values.player.length +
        "\n- Bet amount: " + values.rateBet + " $"
        , threadID, messageID);
    }

    default: {
      console.log("[BAICAO] » Hi, have a good day.")
    }
  }
}

const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "clubs", "diamonds", "hearts"];
const deck = [];

for (let i = 0; i < values.length; i++) {
  for (let x = 0; x < suits.length; x++) {
    let weight = parseInt(values[i]);
    if (["J", "Q", "K"].includes(values[i])) weight = 10;
    else if (values[i] == "A") weight = 11;
    const card = {
      Value: values[i],
      Suit: suits[x],
      Weight: weight,
      Icon: suits[x] == "spades" ? "♠️" : suits[x] == "clubs" ? "♣️" : suits[x] == "diamonds" ? "♦️" : suits[x] == "hearts" ? "♥️" : ""
    };
    deck.push(card);
  }
}

module.exports.onLoad = async () => {
  console.log("====== BAICAO LOADED SUCCESSFULLY ======");
  console.log("[INFO] » Baicao game module loaded.");
  console.log("[DONATE] » If you enjoy this, consider supporting the developer!");
};

function createDeck() {
  const deckShuffel = [...deck];
  for (let i = 0; i < 1000; i++) {
    const location1 = Math.floor((Math.random() * deckShuffel.length));
    const location2 = Math.floor((Math.random() * deckShuffel.length));
    const tmp = deckShuffel[location1];
    deckShuffel[location1] = deckShuffel[location2];
    deckShuffel[location2] = tmp;
  }
  return deckShuffel;
}

function getLinkCard(Value, Suit) {
  return `https://raw.githubusercontent.com/J-JRT/card/mainV2/cards/${Value == "J" ? "jack" : Value == "Q" ? "queen" : Value == "K" ? "king" : Value == "A" ? "ace" : Value}_of_${Suit}.png`;
}

async function drawCard(cards) {
  const a = require("canvas");
  const b = a.createCanvas(500 * cards.length, 726);
  const ctx = b.getContext("2d");
  let x = 0;
  for (const card of cards) {
    const loadImgCard = await a.loadImage(card);
    ctx.drawImage(loadImgCard, x, 0);
    x += 500;
  }
  return b.toBuffer();
}