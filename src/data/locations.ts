import introScrollImage from "../assets/map-locations/introScroll.png";
import playerHouseImage from "../assets/map-locations/playerHouse.png";
import townWellImage from "../assets/map-locations/townWell.png";
import mayorHouseImage from "../assets/map-locations/mayorHouse.png";
import innImage from "../assets/map-locations/inn.png";
import blacksmithImage from "../assets/map-locations/blacksmith.png";
import burnedFarmImage from "../assets/map-locations/burnedFarm.png";
import witchHutImage from "../assets/map-locations/witchHut.png";
import woodcuttersHutImage from "../assets/map-locations/woodcuttersHut.png";
import ancientTreeImage from "../assets/map-locations/ancientTree.png";
import banditCampImage from "../assets/map-locations/banditCamp.png";

export type LocationInitialState = "unlocked" | "hidden" | "locked";

export type MapLocation = {
  id: string;
  mapId: string;
  name: string;
  initialState: LocationInitialState;
  x: number;
  y: number;
  image: string;
  scale: number;
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
    initialState: "unlocked",
    x: 10,
    y: 10,
    image: introScrollImage,
    scale: 1,
    adventureId: "intro",
  },
  {
    id: "byHus1",
    mapId: "village",
    name: "Stuga",
    initialState: "locked",
    x: 50,
    y: 70,
    image: playerHouseImage,
    scale: 1,
    adventureId: "byHus1",
  },
  {
    id: "byHus2",
    mapId: "village",
    name: "Stuga",
    initialState: "locked",
    x: 40,
    y: 64,
    image: playerHouseImage,
    scale: 1,
    adventureId: "byHus2",
  },
  {
    id: "byHus3",
    mapId: "village",
    name: "Stuga",
    initialState: "locked",
    x: 30,
    y: 61,
    image: playerHouseImage,
    scale: 1,
    adventureId: "byHus3",
  },
  {
    id: "byHus4",
    mapId: "village",
    name: "Stuga",
    initialState: "locked",
    x: 71,
    y: 47,
    image: playerHouseImage,
    scale: 1,
    adventureId: "byHus4",
  },
  {
    id: "playerHQ",
    mapId: "village",
    name: "Ditt hus.",
    initialState: "unlocked",
    x: 70,
    y: 60,
    image: playerHouseImage,
    scale: 1.2,
    adventureId: "playerHQ",
    introNodeId: "intro",
    introSeenFlag: "playerHQ.IntroSeen",
  },
  {
    id: "village",
    mapId: "village",
    name: "Utforska byn",
    initialState: "unlocked",
    x: 50,
    y: 46,
    image: townWellImage,
    scale: 0.5,
    adventureId: "village",
  },
  {
    id: "mayors",
    mapId: "village",
    name: "Borgmästaren",
    initialState: "unlocked",
    x: 68,
    y: 30,
    image: mayorHouseImage,
    scale: 1.2,
    adventureId: "mayors",
    introNodeId: "intro",
    introSeenFlag: "mayors.IntroSeen",
  },
  {
    id: "vardshuset",
    mapId: "village",
    name: "Värdshuset",
    initialState: "unlocked",
    x: 29,
    y: 38,
    image: innImage,
    scale: 1.8,
    adventureId: "vardshuset",
    introNodeId: "intro",
    introSeenFlag: "vardshuset.IntroSeen",
  },
  {
    id: "blacksmith",
    mapId: "village",
    name: "Smeden",
    initialState: "unlocked",
    x: 50,
    y: 29,
    image: blacksmithImage,
    scale: 1.6,
    adventureId: "smeden",
    introNodeId: "intro",
    introSeenFlag: "smeden.IntroSeen",
    preQuestNodeId: "smedenStart",
    questCompleteFlag: "healTheSmith.Complete",
  },

  // Trollskogen <--------------------------------------------------------------------------------

  {
    id: "ruins",
    mapId: "wilderness",
    name: "Nedbränd gård",
    initialState: "unlocked",
    x: 42,
    y: 80,
    image: burnedFarmImage,
    scale: 2,
    adventureId: "ruins",
  },
  {
    id: "woodcuttersHut",
    mapId: "wilderness",
    name: "Tjuvens gömställe",
    initialState: "hidden",
    x: 20,
    y: 38,
    image: woodcuttersHutImage,
    scale: 1.4,
    adventureId: "woodcuttersHut",
  },
  {
    id: "witchHut",
    mapId: "wilderness",
    name: "Häxans stuga",
    initialState: "hidden",
    x: 15,
    y: 70,
    image: witchHutImage,
    scale: 1,
    adventureId: "witchHut",
  },
  {
    id: "banditCamp",
    mapId: "wilderness",
    name: "Rövarnas Läger",
    initialState: "hidden",
    x: 53,
    y: 24,
    image: banditCampImage,
    scale: 2,
    adventureId: "banditCamp",
  },
  {
    id: "places",
    mapId: "wilderness",
    name: "Trollskogen",
    initialState: "unlocked",
    x: 53,
    y: 24,
    image: ancientTreeImage,
    scale: 2,
    adventureId: "places",
  },
];
