import { UPGRADE_BUTTONS } from "buttons/upgrade";
import { UPGRADED, UPGRADE } from "helpers/consts/text";
import { isAlreadyUpgraded } from "helpers/utils/checks";
import { Context, Telegraf } from "telegraf";
import { getUser, updateUser } from "helpers/utils/dbActions";
import { BotContext } from "types/bot";

export const setupUpgrade = (bot: Telegraf<BotContext>): void => {
  bot.command("upgrade", upgradeCat);
  bot.action("upgrade_intelligence", upgradeIntelligence);
  bot.action("upgrade_strength", upgradeStrength);
};

const upgradeCat = async (ctx: Context): Promise<void> => {
  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (!user) return;

  isAlreadyUpgraded(ctx, user, () =>
    ctx.reply(UPGRADE, {
      reply_markup: UPGRADE_BUTTONS,
    })
  );
};

const upgradeIntelligence = async (ctx: Context): Promise<void> => {
  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (!user) return;

  isAlreadyUpgraded(ctx, user, () => {
    updateUser(
      { intelligence: user.intelligence + 1, upgradeAt: new Date().toString() },
      ctx.from?.id ?? 0,
      ctx.chat?.id ?? 0
    );
    ctx.editMessageText(UPGRADED);
  });
};

const upgradeStrength = async (ctx: Context): Promise<void> => {
  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (!user) return;

  isAlreadyUpgraded(ctx, user, () => {
    updateUser(
      { intelligence: user.strength + 1, upgradeAt: new Date().toString() },
      ctx.from?.id ?? 0,
      ctx.chat?.id ?? 0
    );
    ctx.editMessageText(UPGRADED);
  });
};
