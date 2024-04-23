import {
  GET_MY,
  GET_TOP,
  GREETING_IN_BOT,
  GREETING_IN_CHAT,
  HELP,
  HELP_FIGHT,
} from "helpers/consts/text";
import { conditionURLs } from "helpers/consts/picturesURLs";
import { isChat } from "helpers/utils/checks";
import { addUser, getAllUsersInChat, getUser } from "helpers/utils/dbActions";
import { Context, Telegraf } from "telegraf";
import { BotContext } from "types/bot";

export const setupGreeting = (bot: Telegraf<BotContext>): void => {
  bot.command("start", greeting);
  bot.command("help", (ctx) => ctx.reply(HELP));
  bot.command("help_fight", (ctx) => ctx.reply(HELP_FIGHT));

  bot.command("my", getMyCat);
  bot.command("top", getTop);
};

const greeting = async (ctx: Context): Promise<void> => {
  if (!isChat(ctx)) {
    await ctx.reply(GREETING_IN_BOT);
    return;
  }
  await ctx.reply(GREETING_IN_CHAT);
};

const getMyCat = async (ctx: Context): Promise<void> => {
  await addUser(ctx);

  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (user) {
    await ctx.replyWithPhoto(conditionURLs[user.condition], {
      caption: GET_MY(user),
      parse_mode: "HTML",
    });
  }
};

const getTop = async (ctx: Context): Promise<void> => {
  const users = await getAllUsersInChat(ctx.chat?.id ?? 0);

  ctx.reply(GET_TOP(users ?? []));
};
