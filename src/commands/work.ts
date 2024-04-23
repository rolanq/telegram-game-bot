import { allJobs } from "helpers/consts/jobs";
import {
  NEED_REST,
  NEED_SELECT_JOB,
  WORKED,
} from "helpers/consts/text";
import { isUserSleeping } from "helpers/utils/checks";
import { Context, Telegraf } from "telegraf";
import { getUser, updateUser } from "helpers/utils/dbActions";
import { BotContext } from "types/bot";

export const setupWork = (bot: Telegraf<BotContext>): void => {
  bot.command("work", work);
};

const work = async (ctx: Context): Promise<void> => {
  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (!user) return;

  if (isUserSleeping(user?.condition)) {
    ctx.reply(NEED_REST(user));
    return;
  }

  const job = Object.values(allJobs).find((job) => job.name === user?.role);

  if (!job) {
    ctx.reply(NEED_SELECT_JOB(user));
  } else {
    updateUser(
      { money: user?.money + (job?.charge ?? 0), condition: "sleeping" },
      ctx.from?.id ?? 0,
      ctx.chat?.id ?? 0
    );

    ctx.reply(WORKED(job, user));
  }
};
