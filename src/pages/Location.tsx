import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice } from "../data/adventureTypes";

type LocationProps = {
  locationId: string | null;
  onReturn: () => void;
};

function Location({ locationId, onReturn }: LocationProps) {
  // Find the location the player clicked on the world map
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const location = locations.find((location) => location.id === locationId);
  const { setPlayer } = usePlayer();

  if (!location) {
    return <p>Location not found.</p>;
  }

  // Find the adventure belonging to this location
  const adventure = adventures[location.adventureId];

  if (!adventure) {
    return <p>Adventure not found.</p>;
  }

  // The first node of the adventure

  // Find the current dialogue node
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
