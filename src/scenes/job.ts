import { allJobs } from "helpers/consts/jobs";
import { CHOOSEN_JOB, JOB, LOW_CHARACTERISTICS } from "helpers/consts/text";
import { getUser, updateUser } from "helpers/utils/dbActions";
import { Pagination } from "helpers/utils/pagination";
import { Composer, Context, Scenes } from "telegraf";
import { SceneContext, WizardContext } from "telegraf/typings/scenes";
import { JobT } from "types";
import { BotContext } from "types/bot";

const onSelect = async (job: JobT, ctx: SceneContext | WizardContext) => {
  const user = await getUser(ctx.chat?.id ?? 0, { id: ctx.from?.id ?? 0 });

  if (
    user &&
    user?.intelligence >= job.requiredCharacteristics.intelligence &&
    user?.strength >= job.requiredCharacteristics.strength
  ) {
    updateUser({ role: job.name }, ctx.from?.id ?? 0, ctx.chat?.id ?? 0);

    ctx.replyWithPhoto(job.image, {
      caption: CHOOSEN_JOB(user),
      parse_mode: "HTML",
    });
  } else if (user) {
    ctx.reply(LOW_CHARACTERISTICS(user));
    ctx.scene.leave();
  }
};

const jobs = allJobs.map((job, i) => ({
  ...job,
  id: i + 1,
  text: JOB(job),
}));

const pagination = new Pagination(jobs, onSelect);

const start = new Composer<WizardContext>();
start.on("text", (ctx) => {
  if (ctx.text.includes("job")) {
    pagination.sendFirstMessage(ctx);
  } else {
    return ctx.scene.leave();
  }
});
start.on("callback_query", (ctx) => pagination.handlePagination(ctx));

export const selectJobScene = new Scenes.WizardScene<BotContext>(
  "SELECT_JOB",
  start
);
