import { Markup } from "telegraf";

export const UPGRADE_BUTTONS = Markup.inlineKeyboard([
  [
    { text: "Интеллект", callback_data: "upgrade_intelligence" },
    { text: "Сила", callback_data: "upgrade_strength" },
  ],
]).reply_markup;
