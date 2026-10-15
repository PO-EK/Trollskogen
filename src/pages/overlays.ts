import type { ComponentType } from "react";
import Character from "./Character";

export type OverlayProps = {
  onClose: () => void;
};

// One entry per overlay page. To add a page (skill tree, quests...):
// create the component, then add one line here. The OverlayId type
// below updates by itself.
export const OVERLAYS = {
  character: Character,
} satisfies Record<string, ComponentType<OverlayProps>>;

export type OverlayId = keyof typeof OVERLAYS;
