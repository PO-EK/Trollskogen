import introScrollImage from "../assets/map-locations/introScroll.png";
import playerHouseImage from "../assets/map-locations/playerHouse.png";
import townWellImage from "../assets/map-locations/townWell.png";
import mayorHouseImage from "../assets/map-locations/mayorHouse.png";
import innImage from "../assets/map-locations/inn.png";
import blacksmithImage from "../assets/map-locations/blacksmith.png";
import burnedFarmImage from "../assets/map-locations/burnedFarm.png";
import witchHutImage from "../assets/map-locations/witchHut.png";
import ancientTreeImage from "../assets/map-locations/ancientTree.png";

export type MapLocation = {
  id: string;
  mapId: string;
  name: string;
  x: number;
  y: number;
  image: string;
  adventureId: string;
  introNodeId?: string;
  introSeenFlag?: string;
  preQuestNodeId?: string;
  questCompleteFlag?: string;
};

export const locations: MapLocation[] = [
  {
    id: "intro",
    mapId: "village",
    name: "Spela intro igen",
    x: 10,
    y: 10,
    image: introScrollImage,
    adventureId: "intro",
  },
  {
    id: "aHouse",
    mapId: "village",
    name: "",
    x: 50,
    y: 70,
    image: playerHouseImage,
    adventureId: "",
  },
  {
    id: "aHouse",
    mapId: "village",
    name: "",
    x: 40,
    y: 64,
    image: playerHouseImage,
    adventureId: "",
  },
  {
    id: "aHouse",
    mapId: "village",
    name: "",
    x: 30,
    y: 61,
    image: playerHouseImage,
    adventureId: "",
  },
  {
    id: "aHouse",
    mapId: "village",
    name: "",
    x: 26,
    y: 48,
    image: playerHouseImage,
    adventureId: "",
  },
  {
    id: "aHouse",
    mapId: "village",
    name: "",
    x: 71,
    y: 45,
    image: playerHouseImage,
    adventureId: "",
  },
  {
    id: "playerHQ",
    mapId: "village",
    name: "Ditt hus.",
    x: 70,
    y: 60,
    image: playerHouseImage,
    adventureId: "playerHQ",
    introNodeId: "intro",
    introSeenFlag: "playerHQ.IntroSeen",
  },
  {
    id: "village",
    mapId: "village",
    name: "Utforska byn",
    x: 50,
    y: 46,
    image: townWellImage,
    adventureId: "village",
  },
  {
    id: "mayors",
    mapId: "village",
    name: "Borgmästaren",
    x: 64,
    y: 30,
    image: mayorHouseImage,
    adventureId: "mayors",
    introNodeId: "intro",
    introSeenFlag: "mayors.IntroSeen",
  },
  {
    id: "vardshuset",
    mapId: "village",
    name: "Värdshuset",
    x: 50,
    y: 30,
    image: innImage,
    adventureId: "vardshuset",
    introNodeId: "intro",
    introSeenFlag: "vardshuset.IntroSeen",
  },

  {
    id: "blacksmith",
    mapId: "village",
    name: "Smeden",
    x: 34,
    y: 38,
    image: blacksmithImage,
    adventureId: "smeden",
    introNodeId: "intro",
    introSeenFlag: "smeden.IntroSeen",
    preQuestNodeId: "smedenStart",
    questCompleteFlag: "healTheSmith.Complete",
  },

  {
    id: "ruins",
    mapId: "wilderness",
    name: "Nedbränd gård",
    x: 32,
    y: 75,
    image: burnedFarmImage,
    adventureId: "ruins",
  },
  {
    id: "woodcuttersHut",
    mapId: "wilderness",
    name: "Tjuvens gömställe",
    x: 12,
    y: 70,
    image: witchHutImage,
    adventureId: "woodcuttersHut",
  },
  {
    id: "witchHut",
    mapId: "wilderness",
    name: "Häxans stuga",
    x: 21,
    y: 60,
    image: witchHutImage,
    adventureId: "witchHut",
  },
  {
    id: "places",
    mapId: "wilderness",
    name: "Trollskogen",
    x: 53,
    y: 24,
    image: ancientTreeImage,
    adventureId: "places",
  },
];
