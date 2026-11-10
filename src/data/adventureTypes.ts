import type { ContainerItem } from "../data/containerItems";
import type { ChestId } from "./Chests";
import type { CombatEncounter } from "../game/combatTypes";

export type AdventureChoice = {
  text: string;
  nextNodeId?: string;
  loot?: ContainerItem[];
  condition?: AdventureCondition | AdventureCondition[];
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
    }
  | {
      type: "hasActionPoints";
      amount: number;
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
  | { type: "openChest"; chestId: ChestId }
  | { type: "removeGold"; amount: number }
  | { type: "addExperience"; amount: number }
  | { type: "heal"; amount: number }
  | { type: "restoreMana"; amount: number }
  | { type: "removeActionPoints"; amount: number }
  | { type: "regainActionPoints"; amount: number }
  | { type: "scheduleStoryFlag"; flag: string; days: number }
  | { type: "sleep" }
  | { type: "fullHeal" }
  | { type: "damage"; amount: number }
  | { type: "setStoryFlag"; flag: string; value: boolean }
  | { type: "openTrader"; traderId: string }
  | { type: "travelTo"; locationId: string }
  | { type: "unlockLocation"; locationId: string }
  | { type: "lockLocation"; locationId: string }
  | { type: "hideLocation"; locationId: string }
  | { type: "endAdventure" };
