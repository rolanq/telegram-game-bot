export enum Jobs {
  courier = "Курьер",
  office = "Айтишник",
  chef = "Шеф-повар",
}

export type JobT = {
  charge: number;
  name: Jobs;
  image: string;
  requiredCharacteristics: {
    strength: number;
    intelligence: number;
  };
};

export type JobName = keyof typeof Jobs;
