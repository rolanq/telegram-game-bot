export enum Dungeons {
  StreetFighter = "Уличный котан",
  Trainer = "Тренер",
  Lancecat = "Лансекот",
}

export type DungeonT = {
  award: number;
  name: Dungeons;
  image: string;
  strength: number;
  intelligence: number;
};

export type DungeonName = keyof typeof Dungeons;
