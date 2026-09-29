import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice } from "../data/adventureTypes";
import ItemGrid from "../components/inventory/ItemGrid";

type LocationProps = {
  locationId: string | null;
  onReturn: () => void;
};

function Location({ locationId, onReturn }: LocationProps) {
  const [currentNodeId, setCurrentNodeId] = useState("start");

  const location = locations.find((location) => location.id === locationId);

  const { setPlayer } = usePlayer();

  const [loot, setLoot] = useState(location?.loot ?? []);

  if (!location) {
    return <p>Location not found.</p>;
  }

  const adventure = adventures[location.adventureId];

  if (!adventure) {
    return <p>Adventure not found.</p>;
  }

  const currentNode = adventure[currentNodeId];

  if (!currentNode) {
    return <p>Adventure node not found.</p>;
  }

  function handleChoice(choice: AdventureChoice) {
    if (choice.effects) {
      for (const effect of choice.effects) {
        if (effect.type === "addGold") {
          setPlayer((player) => ({
            ...player,
            Gold: player.Gold + effect.amount,
          }));
        }

        if (effect.type === "removeGold") {
          setPlayer((player) => ({
            ...player,
            Gold: player.Gold - effect.amount,
          }));
        }

        if (effect.type === "endAdventure") {
          onReturn();
          return;
        }
      }
    }

    if (choice.nextNodeId) {
      setCurrentNodeId(choice.nextNodeId);
    }
  }

  return (
    <div className="location">
      <h1 className="location-header">{location.name}</h1>

      <p className="location-text">{currentNode.text}</p>

      {loot.length > 0 && (
        <ItemGrid
          containerId={location.id}
          width={5}
          height={3}
          inventory={loot}
          onInventoryChange={setLoot}
          onItemRemoved={(inventoryId) => {
            setLoot((currentLoot) =>
              currentLoot.filter((item) => item.inventoryId !== inventoryId),
            );
          }}
        />
      )}

      <div className="location-choices">
        {currentNode.choices.map((choice) => (
          <button
            className="location-choice"
            key={choice.text}
            onClick={() => handleChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Location;
