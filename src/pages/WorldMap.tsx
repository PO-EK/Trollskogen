import { useState } from "react";
import { locations } from "../data/locations";
type WorldMapProps = {
  onLocationSelect: (locationId: string) => void;
};

function WorldMap({ onLocationSelect }: WorldMapProps) {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
    null,
  );
  const hoveredLocation = locations.find(
    (location) => location.id === hoveredLocationId,
  );

  return (
    <div className="world-map">
      {locations.map((location) => (
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
