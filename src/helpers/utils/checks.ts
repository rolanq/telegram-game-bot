import { ALREADY_UPGRADED } from "helpers/consts/text";
import { Context } from "telegraf";
import { Condition, Conditions, UserT } from "types/user";

export const is24HoursPast = (inputDate: Date): boolean => {
  const currentDate: Date = new Date();
  const differenceMs: number = currentDate.getTime() - inputDate?.getTime();
  const oneDayMs: number = 86400000;

  return differenceMs >= oneDayMs;
};

export const isChat = (ctx: Context): boolean => ctx.chat?.type === "group";

export const isAlreadyUpgraded = (ctx: Context, user: UserT, fn: Function) => {
  if (
    user.upgradeAt === null ||
    is24HoursPast(new Date(user.upgradeAt ?? ""))
  ) {
    fn();
    return;
  }
  ctx.reply(ALREADY_UPGRADED);
};

export const isUserSick = (condition: Condition) =>
  Conditions[condition] === Conditions.sick;

export const isUserSleeping = (condition: Condition) =>
  Conditions[condition] === Conditions.sleeping;

export const isUserWaiting = (condition: Condition) =>
  Conditions[condition] === Conditions.waiting;
