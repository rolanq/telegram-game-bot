import { CHANGED_NAME, CHANGE_NAME } from "helpers/consts/text";
import { updateUser } from "helpers/utils/dbActions";
import { Composer, Scenes } from "telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { BotContext } from "types/bot";

const start = new Composer<WizardContext>();
start.on("text", async (ctx) => {
  if (ctx.text === "/name") {
    await ctx.reply(CHANGE_NAME);
    return ctx.wizard.next();
  } else {
    return ctx.scene.leave();
  }
});

const handleName = new Composer<WizardContext>();
handleName.on("message", async (ctx) => {
  const newName = ctx.text;

  updateUser({ name: newName }, ctx.from?.id ?? 0, ctx.chat?.id ?? 0);

  ctx.reply(CHANGED_NAME(newName ?? ""));
  return ctx.scene.leave();
});

export const changeName = new Scenes.WizardScene<BotContext>(
  "CHANGE_NAME",
  start,
  handleName
);
