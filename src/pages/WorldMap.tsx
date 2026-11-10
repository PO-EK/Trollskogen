import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { locations } from "../data/locations";
import { maps } from "../data/maps";

type WorldMapProps = {
  mapId: string;
  onLocationSelect: (locationId: string) => void;
  onMapSelect: (mapId: string) => void;
};

function WorldMap({ mapId, onLocationSelect, onMapSelect }: WorldMapProps) {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
    null,
  );
  const [actionPointsMessage, setActionPointsMessage] = useState<string | null>(
    null,
  );
  const { player } = usePlayer();
  const map = maps[mapId];
  if (!map) {
    return <p>Map not found.</p>;
  }

  const visibleLocations = locations.filter(
    (location) =>
      location.mapId === mapId &&
      (player.UnlockedLocations.includes(location.id) ||
        player.LockedLocations.includes(location.id)),
  );
  const hoveredLocation = visibleLocations.find(
    (location) => location.id === hoveredLocationId,
  );

  return (
    <div
      className="world-map"
      style={{ backgroundImage: `url("${map.backgroundImage}")` }}
      aria-label={map.name}
    >
      {visibleLocations.map((location) => {
        const isLocked = player.LockedLocations.includes(location.id);

        return (
          <button
            key={location.id}
            className={`map-location${isLocked ? " map-location-locked" : ""}`}
            aria-label={location.name}
            aria-disabled={isLocked}
            tabIndex={isLocked ? -1 : undefined}
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: `translate(-50%, -50%) scale(${location.scale})`,
            }}
            onClick={() => {
              if (!isLocked) {
                if (
                  location.id !== "playerHQ" &&
                  player.ActionPoints < 1
                ) {
                  setActionPointsMessage(
                    "Du är för trött för att ge dig ut på äventyr. Vila i ditt hus för att återfå dina krafter.",
                  );
                  return;
                }

                setActionPointsMessage(null);
                onLocationSelect(location.id);
              }
            }}
            onMouseEnter={() => setHoveredLocationId(location.id)}
            onMouseLeave={() => setHoveredLocationId(null)}
          >
            <img
              className="map-location-image"
              src={location.image}
              alt=""
              draggable={false}
            />
          </button>
        );
      })}

      {hoveredLocation && (
        <div
          className="location-tooltip"
          style={{
            left: `${hoveredLocation.x}%`,
            top: `${hoveredLocation.y}%`,
          }}
        >
          {hoveredLocation.name}
        </div>
      )}

      {actionPointsMessage && (
        <p className="map-action-message" role="alert">
          {actionPointsMessage}
        </p>
      )}

      {map.exits.map((exit) => {
        const targetMap = maps[exit.targetMapId];
        if (!targetMap) {
          return null;
        }

        return (
          <button
            key={exit.targetMapId}
            className="map-exit"
            style={{ left: `${exit.x}%`, top: `${exit.y}%` }}
            onClick={() => {
              setActionPointsMessage(null);
              onMapSelect(exit.targetMapId);
            }}
          >
            Gå till {targetMap.name}
          </button>
        );
      })}
    </div>
  );
}

export default WorldMap;
