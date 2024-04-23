export type UserT = {
  chatId: number;
  id: number;
  condition: Condition;
  name: string;
  role: string;
  strength: number;
  intelligence: number;
  money: number;
  username: string;
  upgradeAt: string;
};

export enum Conditions {
  sleeping = "Отдыхает после тяжелого дня",
  waiting = "Бодр и свеж",
  sick = "Заболел и не может двигаться",
}

export type Condition = keyof typeof Conditions;
