import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { locations } from "../data/locations";
type WorldMapProps = {
  onLocationSelect: (locationId: string) => void;
};

function WorldMap({ onLocationSelect }: WorldMapProps) {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
    null,
  );
  const { player } = usePlayer();
  const hoveredLocation = locations.find(
    (location) => location.id === hoveredLocationId,
  );
  const visibleLocations = locations.filter((location) =>
    player.UnlockedLocations.includes(location.id),
  );

  return (
    <div className="world-map">
      {visibleLocations.map((location) => (
        <button
          key={location.id}
          className="map-location"
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
          }}
          onClick={() => onLocationSelect(location.id)}
          onMouseEnter={() => setHoveredLocationId(location.id)}
          onMouseLeave={() => setHoveredLocationId(null)}
        >
          {location.icon}
        </button>
      ))}

      {hoveredLocation && (
        <div
          className="location-tooltip"
          style={{
            left: `${hoveredLocation.x}%`,
            top: `${hoveredLocation.y}%`,
          }}
        >
          {" "}
          {hoveredLocation.name}{" "}
        </div>
      )}
    </div>
  );
}

export default WorldMap;
