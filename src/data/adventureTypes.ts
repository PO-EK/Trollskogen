import type { InventoryItem } from "./player";

export type AdventureChoice = {
  text: string;
  nextNodeId?: string;
  loot?: InventoryItem[];
  condition?: AdventureCondition;
  effects?: AdventureEffect[];
};

export type AdventureNode = {
  id: string;
  text: string;
  choices: AdventureChoice[];
};

export type AdventureCondition =
  | {
      type: "hasItem";
      itemId: string;
    }
  | {
      type: "storyFlag";
      flag: string;
      value: boolean;
    };

type AdventureEffect =
  | { type: "addItem"; itemId: string }
  | { type: "removeItem"; itemId: string }
  | { type: "addGold"; amount: number }
  | { type: "removeGold"; amount: number }
  | { type: "addExperience"; amount: number }
  | { type: "heal"; amount: number }
  | { type: "damage"; amount: number }
  | { type: "endAdventure" };
