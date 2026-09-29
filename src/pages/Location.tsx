import { useState } from "react";
import { usePlayer } from "../context/usePlayer";

import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice, AdventureEffect } from "../data/adventureTypes";
import type { InventoryItem } from "../data/player";
import ItemGrid from "../components/inventory/ItemGrid";

type LocationProps = {
  locationId: string | null;
  onReturn: () => void;
};

function Location({ locationId, onReturn }: LocationProps) {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [loot, setLoot] = useState<InventoryItem[]>([]);

  const location = locations.find((location) => location.id === locationId);

  const { player, setPlayer } = usePlayer();

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

  function meetsCondition(choice: AdventureChoice): boolean {
    if (!choice.condition) {
      return true;
    }

    const condition = choice.condition;

    if (condition.type === "storyFlag") {
      const flagValue = player.StoryFlags[condition.flag] ?? false;

      return flagValue === condition.value;
    }

    if (condition.type === "hasItem") {
      return player.Inventory.some((item) => item.itemId === condition.itemId);
    }

    return false;
  }

  function handleEffect(effect: AdventureEffect) {
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

    if (effect.type === "addItem") {
      const newItem: InventoryItem = {
        inventoryId: crypto.randomUUID(),
        itemId: effect.itemId,
        quantity: 1,
        x: 0,
        y: 0,
      };

      setLoot([newItem]);
    }

    if (effect.type === "removeItem") {
      setPlayer((player) => ({
        ...player,
        Inventory: player.Inventory.filter(
          (item) => item.itemId !== effect.itemId,
        ),
      }));
    }

    if (effect.type === "addExperience") {
      setPlayer((player) => ({
        ...player,
        Exp: player.Exp + effect.amount,
      }));
    }

    if (effect.type === "heal") {
      setPlayer((player) => ({
        ...player,
        HP: Math.min(player.HP + effect.amount, player.HPMax),
      }));
    }

    if (effect.type === "damage") {
      setPlayer((player) => ({
        ...player,
        HP: Math.max(player.HP - effect.amount, 0),
      }));
    }

    if (effect.type === "setStoryFlag") {
      setPlayer((player) => ({
        ...player,
        StoryFlags: {
          ...player.StoryFlags,
          [effect.flag]: effect.value,
        },
      }));
    }

    if (effect.type === "endAdventure") {
      onReturn();
    }
  }

  function handleChoice(choice: AdventureChoice) {
    // Every choice wipes the temporary location loot.
    setLoot([]);

    if (choice.effects) {
      for (const effect of choice.effects) {
        handleEffect(effect);
      }
    }

    if (choice.nextNodeId) {
      setCurrentNodeId(choice.nextNodeId);
    }
  }

  function handleLootChanged(updatedLoot: InventoryItem[]) {
    setLoot(updatedLoot);
  }

  function handleItemRemoved(inventoryId: string) {
    setLoot((currentLoot) =>
      currentLoot.filter((item) => item.inventoryId !== inventoryId),
    );
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
          onInventoryChange={handleLootChanged}
          onItemRemoved={handleItemRemoved}
        />
      )}

      <div className="location-choices">
        {currentNode.choices.filter(meetsCondition).map((choice) => (
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
