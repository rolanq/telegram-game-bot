import "dotenv/config";
import { Telegraf } from "telegraf";
import { catchError } from "helpers/utils/async";
import { setupGreeting } from "commands/greeting";
import { setupWork } from "commands/work";
import { setupUpgrade } from "commands/upgrade";
import { addChat, addUser } from "helpers/utils/dbActions";
import { setupScenes } from "scenes";
import { BotContext } from "types/bot";

catchError(main());

export async function main(): Promise<void> {
  const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN ?? "");

  // if (process.env.BOT_MODE === "MAINTENCE") {
  //   bot.on("text", (ctx) =>
  //     ctx.reply("😴 Идут технические работы. Скоро все заработает")
  //   );
  //   return;
  // }

  bot.use(async (ctx, next) => {
    await addChat(ctx);
    if (!ctx.text?.includes("my")) {
      await addUser(ctx);
    }
    return next();
  });

  setupGreeting(bot);
  setupWork(bot);
  setupUpgrade(bot);
  setupScenes(bot);

  bot.launch(() => console.log("Бот запущен"));
}
