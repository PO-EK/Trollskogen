import type { ComponentType } from "react";
import Character from "./Character";
import QuestLog from "./QuestLog";
import Skills from "./Skills";

export type OverlayProps = {
  onClose: () => void;
};

// One entry per overlay page. To add a page (skill tree, quests...):
// create the component, then add one line here. The OverlayId type
// below updates by itself.
import SkillTree from "./SkillTree";

export const OVERLAYS = {
  character: Character,
  skills: Skills,
  skillTree: SkillTree,
  questLog: QuestLog,
} satisfies Record<string, ComponentType<OverlayProps>>;

export type OverlayId = keyof typeof OVERLAYS;
