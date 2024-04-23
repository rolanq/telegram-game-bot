import { moodURLs } from "helpers/consts/picturesURLs";
import { NEED_REST, WIN_OR_LOSE_IN_FIGHT } from "helpers/consts/text";
import { isUserSleeping } from "helpers/utils/checks";
import { getUser, updateUser } from "helpers/utils/dbActions";
import { calculateWin, getRandom } from "helpers/utils/random";
import { Composer, Scenes } from "telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { UserT } from "types";
import { BotContext } from "types/bot";

interface FightI {
  attacker: UserT;
  defender: UserT;
}

const start = new Composer<WizardContext>();
start.on("text", async (ctx) => {
  const user = await getUser(ctx.chat.id, { id: ctx.from.id });

  if (user && isUserSleeping(user?.condition ?? "sleeping")) {
    ctx.reply(NEED_REST(user));
    ctx.scene.leave();
    return;
  }

  ctx.scene.state = { defender: {}, attacker: user } as FightI;
  ctx.reply(`Выберите на кого хотите напасть. Отправьте имя Пушистика или юзернейм его владельца.
Например: Пушистик или @username
`);
  return ctx.wizard.next();
});

const handleDefender = new Composer<WizardContext>();
handleDefender.on("text", async (ctx) => {
  if (ctx.text.includes("@")) {
    const defenderName = ctx.text.replace("@", "");
    const defender = await getUser(ctx.chat.id ?? 0, {
      username: defenderName,
    });

    if (!defender) {
      ctx.scene.leave();
      return;
    }

    ctx.scene.state = { ...ctx.scene.state, defender } as FightI;
  } else {
    const defenderName = ctx.text;
    const defender = await getUser(ctx.chat.id ?? 0, {
      name: defenderName,
    });

    if (!defender) {
      ctx.scene.leave();
      return;
    }

    ctx.scene.state = { ...ctx.scene.state, defender } as FightI;
  }

  ctx.reply("Теперь отправьте кубик, чтобы испытать удачу");

  return ctx.wizard.next();
});

const handleDice = new Composer<WizardContext>();
handleDice.on("dice", async (ctx) => {
  if (ctx.message.dice.emoji !== "🎲") {
    ctx.reply("Отправьте кубик");
    return ctx.wizard.selectStep(2);
  }

  const { attacker, defender } = ctx.scene.state as FightI;

  const diceValue = ctx.message.dice.value;

  const isAttackerWin = calculateWin(
    attacker?.strength + diceValue,
    defender?.strength
  );

  const money = getRandom(15);

  const countEvents = getRandom(10);

  ctx.replyWithPhoto(isAttackerWin ? moodURLs.happy : moodURLs.sad, {
    caption: WIN_OR_LOSE_IN_FIGHT(
      diceValue,
      money,
      isAttackerWin,
      countEvents,
      attacker,
      defender
    ),
  });

  updateUser(
    {
      money: isAttackerWin ? attacker.money + money : attacker.money - money,
      condition: "sleeping",
    },
    ctx.from?.id ?? 0,
    ctx.chat?.id ?? 0
  );

  updateUser(
    {
      money: isAttackerWin ? defender.money - money : defender.money + money,
    },
    defender?.id ?? 0,
    ctx.chat?.id ?? 0
  );

  return ctx.scene.leave();
});

export const fightScene = new Scenes.WizardScene<BotContext>(
  "FIGHT_WITH_USER",
  start,
  handleDefender,
  handleDice
);
