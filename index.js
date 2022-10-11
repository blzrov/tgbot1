const TelegramBot = require("node-telegram-bot-api");
const { gameOptions, againGameOptions } = require("./options");
const token = "5500946012:AAHV9eKSCp3PbACwVONgZH8rCgCERXjupeY";

const bot = new TelegramBot(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Загадаю число от 0 до 9");
  const n = Math.floor(Math.random() * 10);
  chats[chatId] = n;
  await bot.sendMessage(chatId, "Угадай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Старт" },
    { command: "/info", description: "Инфо" },
    { command: "/game", description: "Игра" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendPhoto(
        chatId,
        "https://sun9-19.userapi.com/impg/m5sPs8SyLuYmjSvq_P0jGGYL-pXwEbbO-I7ydQ/HCQ8cTyPgws.jpg?size=1080x1079&quality=96&sign=8d0e8fa030364d10c163f1b7872453cb&type=album"
      );
      return bot.sendMessage(chatId, "Привет!");
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Твоё имя ${msg.from.first_name} ${msg.from.last_name} ${msg.from.username}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    bot.sendMessage(chatId, "Конец.");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, "Да", againGameOptions);
    }
    return await bot.sendMessage(chatId, "Нет");
  });
};

start();
