import type { ContainerItem } from "../data/containerItems";

export type AdventureChoice = {
  text: string;
  nextNodeId?: string;
  loot?: ContainerItem[];
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

export type AdventureEffect =
  // Items are never placed directly into the player's inventory.
  // Items enter the game world through containers such as location loot,
  // chests, traders, etc., and the player must physically drag them.
  | { type: "spawnLoot"; itemId: string }
  | { type: "removeItem"; itemId: string }
  | { type: "addGold"; amount: number }
  | { type: "removeGold"; amount: number }
  | { type: "addExperience"; amount: number }
  | { type: "heal"; amount: number }
  | { type: "damage"; amount: number }
  | { type: "setStoryFlag"; flag: string; value: boolean }
  | { type: "openTrader"; traderId: string }
  | { type: "travelTo"; locationId: string }
  | { type: "endAdventure" };
