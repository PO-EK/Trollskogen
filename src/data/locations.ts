export type MapLocation = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  unlocked: boolean;
  adventureId: string;
};

export const locations: MapLocation[] = [
  {
    id: "intro",
    name: "Spela intro igen",
    x: 15,
    y: 95,
    icon: "📜",
    unlocked: true,
    adventureId: "intro",
  },
  {
    id: "playerHQ",
    name: "Ditt hus.",
    x: 85,
    y: 50,
    icon: "🏚️",
    unlocked: true,
    adventureId: "playerHQ",
  },
  {
    id: "village",
    name: "Utforska byn",
    x: 50,
    y: 25,
    icon: "🏘️",
    unlocked: true,
    adventureId: "village",
  },

  {
    id: "blacksmith",
    name: "Smeden",
    x: 45,
    y: 45,
    icon: "S",
    unlocked: true,
    adventureId: "smeden",
  },

  {
    id: "ruins",
    name: "Nedbränd gård",
    x: 85,
    y: 85,
    icon: "🏚️",
    unlocked: true,
    adventureId: "ruins",
  },
  {
    id: "witchHut",
    name: "Häxans stuga",
    x: 30,
    y: 80,
    icon: "🏚️",
    unlocked: true,
    adventureId: "witchHut",
  },
];
