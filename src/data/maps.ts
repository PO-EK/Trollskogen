import villageMapImage from "../assets/village-map.svg";
import wildernessMapImage from "../assets/wilderness-map.svg";

export type MapExit = {
  targetMapId: string;
  x: number;
  y: number;
};

export type WorldMapDefinition = {
  id: string;
  name: string;
  backgroundImage: string;
  exits: MapExit[];
};

export const maps: Record<string, WorldMapDefinition> = {
  village: {
    id: "village",
    name: "Byn",
    backgroundImage: villageMapImage,
    exits: [{ targetMapId: "wilderness", x: 82, y: 88 }],
  },
  wilderness: {
    id: "wilderness",
    name: "Trollskogen",
    backgroundImage: wildernessMapImage,
    exits: [{ targetMapId: "village", x: 13, y: 87 }],
  },
};
