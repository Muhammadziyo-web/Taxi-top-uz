import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import { log } from "console";
import {
  taxi,
  yolovchi,
  hafta,
  sana,
  r,
} from "../database/questions.js";
import "../database/mongo.js";
config();


  
const admin = 1939087676;
const customers = {};
let savollar;
 const bot = new TelegramBot(process.env.API_KEY, {
  polling: true,
 });
 export default bot
 
 
 

bot.onText(/\/start/, async (msg) => {
  const { id } = msg?.from;
  await bot.sendMessage(
    id,
    "Assalomu alaykum *" +
      msg.from.first_name +
      "*\n*Taxi top* botiga xush kelibsiz\n\nBo'limlardan birini tanlang! Yoki\n/info buyrugi orqali nimalarga qodir ekanligimni bilib oling!\n/help buyrugi orqali shartlar bilan tanishib chiqing!", 
    {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [[{ text: "Xaydovchi" }, { text: "Yo'lovchi" }]],
        ...r,
      },
    }
  );
  customers[id] = [];
});

bot.onText(/\/info/, async (msg) => {
  const { id } = msg?.from;

  await bot.sendMessage(
    id,
    "Bu Bot haydovchi va yo'lovchi topishni tartiblash va osonlashtirishga yordam beradi. Bo'limlardan birini tanlab bunga o'zingiz amin bolishingiz mumkun.",
    {
      reply_markup: {
        keyboard: [[{ text: "Xaydovchi" }, { text: "Yo'lovchi" }]],
        ...r,
      },
    }
  );
  customers[id] = [];
});

bot.onText(/\/help/, async (msg) => {
  const { id } = msg?.from;

  await bot.sendMessage(
    id,
    `Shartlar bilan tanishib chiqing va bunga amal qilishingizni iltimos qilamiz:
    ·Faqat lotin harflarida yozing
    ·Manzil yozayotganda faqat bitta so'z kiriting qolganlarini "Qoshimcha" bolimida yozib qoldiring `,
    {
      reply_markup: {
        keyboard: [[{ text: "Xaydovchi" }, { text: "Yo'lovchi" }]],
        ...r,
      },
    }
  );
  customers[id] = [];
});





async function* Messages() {
  while (1) {
    let [id, savol] = yield;

    await bot.sendMessage(
      id,
      savol,
      customers[id].length == 5
        ? sana
        : customers[id].length == 8 && customers[id][0] == "Yo'lovchi"
        ? { reply_markup: { remove_keyboard: true } }
        : { reply_markup: { remove_keyboard: true } } 
    );
  }
}
let gen = Messages();
gen.next();

bot.on("message", async (msg) => {
  try {
    let icon;
    if (
      msg.from.is_bot ||
      msg.text === "/start" ||
      msg.text === "/help" ||
      msg.text === "/info"
    )
      return;
    const { id } = msg?.from;
    if (!customers[id]) {
      customers[id] = [];
    }

    if (customers[id].length == 0) {
      if (msg.text == "Xaydovchi") {
        icon = "🚕";
        savollar = taxi;
      } else {
        icon = "🧍‍♂️";
        savollar = yolovchi;
      }
      await bot.sendMessage(
        id,
        `${
          icon + msg.text
        } sizga bir nechta savollar beriladi!\nHar biriga javob bering. 
Oxirida agar hammasi to'g'ri bo'lsa, HA tugmasini bosing va arizangiz Kanalga yuboriladi.`
      );
    }

    customers[id][customers[id].length] = msg.text;

    if (customers[id][5] instanceof String) {
      let custom = customers[id][5];
      customers[id][5] = dayConculator(custom);
    }
    if (customers[id].length - 1 < savollar.length) {
      gen.next([id, savollar[customers[id].length - 1]]);
    } else {
      await bot.sendMessage(id, qidirish(id, msg.from.username), {
        reply_markup: confirm,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", async (msg) => {
  try {
    const chat_id = msg.message?.chat.id;
    const { id } = msg?.from;

      if (msg.data == "yes") {
        await bot.sendMessage(
          "@TaxiTopUz",
          qidirish(id, msg.from.username)
        );
         customers[id] = [];
      }
      await bot.deleteMessage(chat_id, msg.message.message_id);
      await bot.sendMessage(
        id,
        msg.data == "yes"
          ? "✅Xabaringiz kanalga joylandi!"
          : "❎Xabaringiz kanalga yuborilmadi.\nQayta ariza qoldirish uchun bo'limlardan birini tanlang.",
        {
          reply_markup: {
            keyboard: [[{ text: "Xaydovchi" }, { text: "Yo'lovchi" }]],
            ...r,
          },
        }
      );
      if (msg.data == "no") {
        customers[id] = [];
      }
    
  } catch (error) {
    log(error);
  }
});

function qidirish(id, username) {
  let customerPos = customers[id][0];
  return ` ${customerPos == "Yo'lovchi" ? " 👤" : " 🚖" + customerPos}: ${
    customers[id][1]
  }\n
📞 Aloqa: ${customers[id][2]}
🟢 Qayerdan: ${customers[id][3]}
🔴 Qayerga: ${customers[id][4]}  
📅 Sana: ${customers[id][5]} 
⏱ Vaqti: ${customers[id][6]}
💴 Narxi: ${customers[id][7]}
📧 Telegram: @${username} 
${customerPos == "Yo'lovchi" ? "⚠️Qo'shimcha" : "🚕 Model"}: ${
    customers[id][8]
  } 
${customerPos !== "Yo'lovchi" ? `⚠️Qo'shimcha: ${customers[id][9]}` : ""} 
        
#${
    customerPos == "Yo'lovchi"
      ? customerPos.replace(/\'/, "").toLowerCase()
      : customerPos.toLowerCase()
  } #${customers[id][4]}ga #${customers[id][5]?.toLowerCase()}`;
}

function dayConculator(custom) {
  let today = new Date();

  switch (custom) {
    case "Bugun": {
      return `${
        today.getDate() > 9 ? today.getDate() : "0" + today.getDate()
      }.${
        today.getMonth() + 1 > 9
          ? today.getMonth() + 1
          : "0" + (today.getMonth() + 1)
      }.${today.getFullYear()}`;
      break;
    }
    case "Ertaga": {
      today.setDate(today.getDate() + 1);
      return `${
        today.getDate() > 9 ? today.getDate() : "0" + today.getDate()
      }.${
        today.getMonth() + 1 > 9
          ? today.getMonth() + 1
          : "0" + (today.getMonth() + 1)
      }.${today.getFullYear()}`;
      break;
    }
    case "Indiniga": {
      today.setDate(today.getDate() + 2);
      return `${
        today.getDate() > 9 ? today.getDate() : "0" + today.getDate()
      }.${
        today.getMonth() + 1 > 9
          ? today.getMonth() + 1
          : "0" + (today.getMonth() + 1)
      }.${today.getFullYear()}`;
      break;
    }
  }
}
let confirm = {
  inline_keyboard: [
    [
      { text: "✅", callback_data: "yes" },
      {
        text: "❎",
        callback_data: "no",
      },
    ],
  ],
};
