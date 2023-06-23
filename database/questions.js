let array = [
  "Ism, familiyangizni kiriting?",
  "📞 Aloqa: \n\n  Bog`lanish uchun raqamingizni kiriting?\n  Masalan, +998 90 123 45 67",
  "🟢 Qayerdan:\n\n  Yo'lga chiqasiz\n  Viloyat nomi, Toshkent shahar yoki Respublikani kiriting.",
  "🔴 Qayerga:\n\n  Manzilingiz\n  Viloyat nomi, Toshkent shahar yoki Respublikani kiriting.",
  "📅 Sana:\n\n  Yo'lga chiqish kuningizni kiriting?",
  "⏱ Vaqt:\n\n  Yo'lga chiqish vaqtingizni kiriting? \n Masalan: 10:00",
  "💴 Narxi:\n\n  Yo'l haqqiga taklifingiz?"
];

export const taxi = [
  ...array,
  "🚕 Model:\n\n  Mashinangizning modelini kiriting. Masalan Cobolt",
  "⚠️Qo'shimcha ma'lumot",
];
export const yolovchi = [...array, "⚠️Qo'shimcha"];
export const hafta = [
  "",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];
export const r = {
  resize_keyboard: true,
  one_time_keyboard: true,
  remove_keyboard: true,
};
export const sana = {
  reply_markup: {
    keyboard: [[{ text: "Bugun" }, { text: "Ertaga" }], [{ text: "Indiniga" }]],
    ...r,
  },
};

