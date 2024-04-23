import { allDungeons } from "helpers/consts/dungeons";
import { moodURLs } from "helpers/consts/picturesURLs";
import { DUNGEON, WIN_OR_LOSE_IN_DUNGEON } from "helpers/consts/text";
import { getUser, updateUser } from "helpers/utils/dbActions";
import { Pagination } from "helpers/utils/pagination";
import { calculateWin, getRandom } from "helpers/utils/random";
import { Composer, Scenes } from "telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { UserT } from "types";
import { BotContext } from "types/bot";
import { DungeonT } from "types/dungeon";

interface DungeonI {
  attacker: UserT;
  dungeon: DungeonT & { id: number; text: string };
}

const dungeons = allDungeons.map((dungeon, i) => ({
  ...dungeon,
  id: i + 1,
  text: DUNGEON(dungeon),
}));

let pagination = new Pagination(dungeons, () => {});

const start = new Composer<WizardContext>();

start.on("text", async (ctx) => {
  const user = await getUser(ctx.chat.id, { id: ctx.from.id });

  pagination.onSelect = async (item) => {
    ctx.scene.state = {
      attacker: { ...user },
      dungeon: { ...item },
    } as DungeonI;

    await ctx.reply("Теперь отправьте кубик, чтобы испытать удачу");
  };

  if (ctx.text.includes("dungeon")) {
    pagination.sendFirstMessage(ctx);
  } else {
    // ctx.scene.leave();
  }
});

start.on("callback_query", async (ctx) => pagination.handlePagination(ctx));

start.on("dice", async (ctx) => {
  console.log("ASDASDSJHABAJSHBDAHJSBDSAFDAYSVBDATYSFDASVDUGV");

  if (ctx.message.dice.emoji !== "🎲") {
    ctx.reply("Отправьте кубик");
    return ctx.wizard.selectStep(1);
  }

  const { attacker, dungeon } = ctx.scene.state as DungeonI;

  const diceValue = ctx.message.dice.value;

  const isAttackerWin = calculateWin(
    attacker?.strength + diceValue,
    dungeon?.strength
  );

  const money = getRandom(30);

  const countEvents = getRandom(10);

  ctx.replyWithPhoto(isAttackerWin ? moodURLs.happy : moodURLs.sad, {
    caption: WIN_OR_LOSE_IN_DUNGEON(
      diceValue,
      money,
      isAttackerWin,
      countEvents,
      attacker,
      dungeon
    ),
  });

  updateUser(
    {
      money: isAttackerWin ? attacker.money + money : attacker.money - money,
      condition: isAttackerWin ? "sleeping" : "sick",
    },
    ctx.from?.id ?? 0,
    ctx.chat?.id ?? 0
  );

  return ctx.scene.leave();
});

export const dungeonScene = new Scenes.WizardScene<BotContext>(
  "DUNGEON",
  start
);
