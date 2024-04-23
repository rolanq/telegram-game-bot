import { DungeonT, Dungeons } from "types/dungeon";
import { dungeonURLs } from "./picturesURLs";

export const streetFighter: DungeonT = {
  award: 20,
  image: dungeonURLs.streetFigther,
  intelligence: 0,
  strength: 5,
  name: Dungeons.StreetFighter,
};

export const trainer: DungeonT = {
  award: 40,
  image: dungeonURLs.trainer,
  intelligence: 4,
  strength: 10,
  name: Dungeons.Trainer,
};

export const lancecat: DungeonT = {
  award: 100,
  image: dungeonURLs.lancecat,
  intelligence: 15,
  strength: 20,
  name: Dungeons.Lancecat,
};

export const allDungeons = [streetFighter, trainer, lancecat];
