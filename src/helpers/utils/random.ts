import { UserT } from "types";

export const getRandom = (max: number): number => {
  return Math.ceil(Math.random() * max);
};

export const calculateWin = (
  attackerStrength: number,
  defenderStrength: number
): boolean => {
  const totalStrength = attackerStrength + defenderStrength;
  const normAttackerStrength = attackerStrength / totalStrength;

  const chance = normAttackerStrength * 100;
  const randomNum = Math.random() * 100;
  return randomNum < chance;
};

export const pickRandomPlayer = (users: UserT[], user: UserT): UserT => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
};

export const mixEvents = (
  goodEvents: string[],
  badEvents: string[],
  count: number,
  isGoodResult: boolean
): string[] => {
  const mixedEvents: string[] = [];

  for (let i = 0; i < count - 1; i++) {
    const eventArray = Math.random() < 0.5 ? goodEvents : badEvents;
    const randomIndex = Math.floor(Math.random() * eventArray.length);
    mixedEvents.push(eventArray[randomIndex]);
  }

  const lastEvent = isGoodResult
    ? goodEvents[Math.floor(Math.random() * goodEvents.length - 1)]
    : badEvents[Math.floor(Math.random() * badEvents.length - 1)];
  mixedEvents.push(lastEvent);

  return mixedEvents;
};
