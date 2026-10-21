import type { ContainerItem } from "../data/containerItems";
import type { CombatEncounter } from "../game/combatTypes";

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
  | { type: "spawnLoot"; itemId: string }
  | ({ type: "startCombat" } & CombatEncounter)
  | {
      type: "openQuestContainer";
      questId: string;
      acceptedItemId: string;
    }
  | { type: "removeItem"; itemId: string }
  | { type: "openLoot"; itemIds: string[] }
  | { type: "learnSkill"; skillId: string }
  | { type: "addGold"; amount: number }
  | { type: "openStorage" }
  | { type: "removeGold"; amount: number }
  | { type: "addExperience"; amount: number }
  | { type: "heal"; amount: number }
  | { type: "restoreMana"; amount: number }
  | { type: "fullHeal" }
  | { type: "damage"; amount: number }
  | { type: "setStoryFlag"; flag: string; value: boolean }
  | { type: "openTrader"; traderId: string }
  | { type: "travelTo"; locationId: string }
  | { type: "unlockLocation"; locationId: string }
  | { type: "lockLocation"; locationId: string }
  | { type: "endAdventure" };
