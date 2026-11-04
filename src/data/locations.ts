export type MapLocation = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  adventureId: string;
};

export const locations: MapLocation[] = [
  {
    id: "intro",
    name: "Spela intro igen",
    x: 10,
    y: 10,
    icon: "📜",
    adventureId: "intro",
  },
  {
    id: "playerHQ",
    name: "Ditt hus.",
    x: 85,
    y: 50,
    icon: "🏚️",
    adventureId: "playerHQ",
  },
  {
    id: "village",
    name: "Utforska byn",
    x: 50,
    y: 25,
    icon: "🏘️",
    adventureId: "village",
  },
  {
    id: "mayors",
    name: "Borgmästaren",
    x: 30,
    y: 15,
    icon: "🏘️",
    adventureId: "mayors",
  },
  {
    id: "vardshuset",
    name: "Värdshuset",
    x: 35,
    y: 43,
    icon: "🏘️",
    adventureId: "vardshuset",
  },

  {
    id: "blacksmith",
    name: "Smeden",
    x: 30,
    y: 31,
    icon: "S",
    adventureId: "smeden",
  },

  {
    id: "ruins",
    name: "Nedbränd gård",
    x: 75,
    y: 80,
    icon: "🏚️",
    adventureId: "ruins",
  },
  {
    id: "witchHut",
    name: "Häxans stuga",
    x: 30,
    y: 80,
    icon: "🏚️",
    adventureId: "witchHut",
  },
  {
    id: "places",
    name: "Trollskogen",
    x: 50,
    y: 90,
    icon: "Trollskogen",
    adventureId: "places",
  },
];
