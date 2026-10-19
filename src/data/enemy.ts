export type EmemyType = "human" | "animal" | "fey";

export type Enemy = {
  type: EmemyType;
  name: string;
  image: string;
  minDamage: number;
  maxDamage: number;
  skills: [];

  hp: number;
  slashRes: number;
  pierceRes: number;
  crushRes: number;
  fireRes: number;
  darkRes: number;
  lightRes: number;
};
