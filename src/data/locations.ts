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
    x: 50,
    y: 5,
    icon: "📜",
    unlocked: true,
    adventureId: "intro",
  },

  {
    id: "village",
    name: "Utforska byn",
    x: 50,
    y: 60,
    icon: "🏘️",
    unlocked: true,
    adventureId: "village",
  },

  {
    id: "gamlahem",
    name: "Nedbränd gård",
    x: 23,
    y: 45,
    icon: "🏚️",
    unlocked: true,
    adventureId: "gamlahem",
  },

  {
    id: "forest",
    name: "Utforska Trollskogen",
    x: 90,
    y: 55,
    icon: "🌲",
    unlocked: false,
    adventureId: "trollskogen",
  },
];
