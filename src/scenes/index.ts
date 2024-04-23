import { Scenes, Telegraf, session } from "telegraf";
import { changeName } from "./changeName";
import { BotContext } from "types/bot";
import { fightScene } from "./fight";
import { selectJobScene } from "./job";
import { dungeonScene } from "./dungeon";
import { SceneContext, WizardContext } from "telegraf/typings/scenes";

export const setupScenes = (bot: Telegraf<BotContext>): void => {
  const stage = new Scenes.Stage<BotContext>([
    fightScene,
    changeName,
    selectJobScene,
    dungeonScene,
  ]);

  bot.use(session());
  bot.use(stage.middleware());

  bot.command("name", (ctx) => enterScene(ctx, "CHANGE_NAME"));
  bot.command("fight", (ctx) => enterScene(ctx, "FIGHT_WITH_USER"));
  bot.command("job", (ctx) => enterScene(ctx, "SELECT_JOB"));
  bot.command("dungeon", (ctx) => ctx.reply("Эта фича в разработка"));
};

const enterScene = async (
  ctx: SceneContext | WizardContext,
  sceneName: string
): Promise<void> => {
  await ctx.scene.leave();
  await ctx.scene.enter(sceneName);
};
