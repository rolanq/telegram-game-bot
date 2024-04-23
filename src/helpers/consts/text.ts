import { mixEvents } from "helpers/utils/random";
import { JobT } from "types";
import { DungeonT } from "types/dungeon";
import { Conditions, UserT } from "types/user";
import packageJson from '../../../package.json' assert { type: 'json' };

export const GREETING_IN_BOT = `
Привет! Я работаю только в чате
Добавь меня в чат и используй /help
`;

export const GREETING_IN_CHAT = `
Привет! Теперь ты можешь получить собственного пушистика и соревноваться с другими игроками в чате

Используй /my если хочешь получить или узнать информацию о своем пушистике
Используй /help чтобы получить информацию обо всех командах
`;

export const HELP = `
Это многопользовательская игра в стиле DnD. Смысл игры - зарабатывать деньги и завершить игру, покупкой Экскалибура за 1000 монет.

Команды:
/top - получить топ пушистиков в чате
/my - получить информацию о своем пушистике
/name - сменить имя пушистика
/job - выбрать работу
/work - работать, выбранную ранее работу
/fight - напасть на другого пушистика из чата и забрать/отдать монеты
/dungeon - в разработке

Если интересно как происходит драка используй /fight_help

Бот пока в разработке, версия бота ${packageJson.version}
`

export const HELP_FIGHT = `
Прежде чем напасть на другого пушистика сравни ваши показатели силы, ведь это влияет на исход битвы

Когда ты используешь /fight, то тебе предлагает выбрать противника, далее тебе необходимо выкинуть кубик
Выпавшее значение на кубике прибавляется к твоему показателю силы и затем ты вступаешь в драку

Удачи в битвах, Воин!
`

export const GET_MY = (user: UserT): string => {
  return `
<b>${user.name}</b>

Состояние: ${Conditions[user.condition]}
Профессия: ${user.role}
Монет: ${user.money}

Характеристики:
Сила: ${user.strength}
Интеллект: ${user.intelligence}
`;
};

export const UPGRADE = `
Выбери характеристику, которую хочешь прокачать
`;

export const UPGRADED = `
Характеристика прокачана. Проверить /my
`;

export const ALREADY_UPGRADED = (user: UserT) => `
${user.name} уже прокачивал характеристики сегодня.
`;

export const GET_TOP = (users: UserT[]): string => {
  return users
    .sort((a, b) => b.money - a.money)
    .map((user, index) => {
      const number =
        index === 0
          ? "🥇"
          : index === 1
          ? "🥈"
          : index === 2
          ? "🥉"
          : index + 1;
      return `${number} ${user.name} с ${user.money} монет.`;
    })
    .join("\n");
};

export const JOB = (job: JobT): string => {
  return `
Выбери работу, чтобы зарабатывать деньги и быть в топе

<b>${job.name}</b>
Зарплата: ${job.charge}

Необходимые характеристики:
Сила: ${job.requiredCharacteristics.strength}
Интеллект: ${job.requiredCharacteristics.intelligence}
  `;
};

export const DUNGEON = (dungeon: DungeonT): string => {
  return `
Выбери врага себе по силам

<b>${dungeon.name}</b>
Награда: ${dungeon.award}

Характеристики:
Сила: ${dungeon.strength}
Интеллект: ${dungeon.intelligence}
`
}

export const CHOOSEN_JOB = (user: UserT) => `
Теперь у ${user.name} есть работа. Используй /work чтобы работать
`;

export const LOW_CHARACTERISTICS = (user: UserT) => `
Характеристики ${user.name} ниже, чем требуются
Используй /upgrade чтобы прокачаться
`;

export const WORKED = (job: JobT, user: UserT): string => {
  return `
${user.name} усердно трудился и заработал ${job.charge} монет
  `;
};

export const NEED_SELECT_JOB = (user: UserT) => `
У ${user.name} нет работы, сначала выбери её /job
`;

export const NEED_REST = (user: UserT) => `
${user.name} очень устал. Дай ему отдохнуть
`;

export const WIN_OR_LOSE_IN_DUNGEON = (
  diceValue: number,
  money: number,
  isWin: boolean,
  countEvents: number,
  attacker: UserT,
  defender: DungeonT
): string => {
  const events = mixEvents(
    GOOD_EVENTS_FIGHT,
    BAD_EVENTS_FIGHT,
    countEvents,
    isWin
  )
    .join("\n")
    .replaceAll("Атакующий", attacker.name)
    .replaceAll("Защищающийся", defender.name);

  if (isWin) {
    return `
${attacker.name} напал на ${defender.name}.
Сила ${attacker.name}: ${attacker.strength} + ${diceValue} выпавшее значение
Сила ${defender.name}: ${defender.strength}
${events}
${attacker.name} выиграл и гордо уходит, забирая у ${defender.name} ${money} монет.
    `;
  } else {
    return `
${attacker.name} напал на ${defender.name}.
Сила ${attacker.name}: ${attacker.strength} + ${diceValue} выпавшее значение
Сила ${defender.name}: ${defender.strength}
${events}
${attacker.name} проиграл и уходит зализывая раны 
    `;
  }
};

export const WIN_OR_LOSE_IN_FIGHT = (
  diceValue: number,
  money: number,
  isWin: boolean,
  countEvents: number,
  attacker: UserT,
  defender: UserT
): string => {
  const events = mixEvents(
    GOOD_EVENTS_FIGHT,
    BAD_EVENTS_FIGHT,
    countEvents,
    isWin
  )
    .join("\n")
    .replaceAll("Атакующий", attacker.name)
    .replaceAll("Защищающийся", defender.name);

  if (isWin) {
    return `
${attacker.name} напал на ${defender.name}.
Сила ${attacker.name}: ${attacker.strength} + ${diceValue} выпавшее значение
Сила ${defender.name}: ${defender.strength}
${events}
${attacker.name} выиграл и гордо уходит, забирая у ${defender.name} ${money} монет.
    `;
  } else {
    return `
${attacker.name} напал на ${defender.name}.
Сила ${attacker.name}: ${attacker.strength} + ${diceValue} выпавшее значение
Сила ${defender.name}: ${defender.strength}
${events}
${attacker.name} потерял ${money} монет.
    `;
  }
};

export const BAD_EVENTS_FIGHT = [
  "Атакующий получает по лицу от Защищающийся",
  "Защищающийся ловко увертывается от удара Атакующий",
  "Атакующий пытается сбить с ног Защищающийся, но тот остается непоколебимым",
  "Защищающийся проводит контратаку, заставляя Атакующий отступить",
  "Атакующий подскальзывается на камне, а Защищающийся воспользуется этим",
  "Защищающийся ловко блокирует каждый удар Атакующий",
  "Атакующий старается атаковать с разных сторон, но Защищающийся прочен в обороне",
  "Защищающийся метко попадает в слабое место Атакующий",
  "Атакующий пытается проникнуть сквозь защиту, но Защищающийся не дает себя пройти",
  "Защищающийся уворачивается от ударов Атакующий",
  "Атакующий делает рывок, но Защищающийся успевает увернуться",
  "Защищающийся проводит хитроумную маневренную атаку",
  "Атакующий пытается разбить защиту Защищающийся, но безуспешно",
  "Защищающийся демонстрирует высокий уровень мастерства в обороне",
  "Атакующий получает отпор от стойкого Защищающийся",
  "Защищающийся быстро реагирует на атаку и контратакует",
  "Атакующий метко промахивается, а Защищающийся в этот момент атакует",
  "Защищающийся с удивлением заставляет Атакующий отступить",
  "Атакующий испытывает трудности в атаке, сталкиваясь с умелой защитой",
  "Защищающийся уверенно контролирует ход боя, не давая Атакующий шансов",
];

export const GOOD_EVENTS_FIGHT = [
  "Атакующий мощно пробивает блок Защищающийся пяткой",
  "Атакующий с легкостью увертывается от удара Защищающийся",
  "Защищающийся не успевает увернуться, и Атакующий наносит точечный удар",
  "Атакующий хитро обходит защиту и бьет в уязвимое место Защищающийся",
  "Атакующий быстро реагирует на движения Защищающийся и атакует сбоку",
  "Защищающийся пытается контратаковать, но Атакующий предвидит его действия",
  "Атакующий уклоняется от защитного удара Защищающийся и наносит ответный",
  "Защищающийся поднимает щит, но Атакующий с легкостью обходит защиту",
  "Атакующий быстро меняет тактику, оставляя Защищающийся без защиты",
  "Защищающийся пытается сбить Атакующий с ног, но не успевает",
  "Атакующий сильно давит на Защищающийся, не давая ему возможности атаковать",
  "Защищающийся пытается увернуться, но Атакующий следует за его движениями",
  "Атакующий проводит хитроумную комбинацию ударов, не давая шансов на защиту",
  "Защищающийся пытается забиться в угол, но Атакующий не дает ему отдохнуть",
  "Атакующий молниеносно реагирует на каждое движение Защищающийся",
  "Защищающийся пытается отразить атаку, но Атакующий уже на следующем ударе",
  "Атакующий с легкостью преодолевает защиту и достигает своей цели",
  "Защищающийся бьется в отчаянной попытке защититься, но Атакующий слишком силен",
  "Атакующий без труда доминирует в бою, контролируя каждое действие",
  "Защищающийся пытается перехватить инициативу, но Атакующий не дает ему этого сделать",
];

export const CHANGE_NAME = `
Отправь новое имя следующим сообщением
`;

export const CHANGED_NAME = (newName: string): string => `
Имя изменено на ${newName}
`;
