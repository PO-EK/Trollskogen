import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import "./Location.css";
import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice, AdventureEffect } from "../data/adventureTypes";
import type { ContainerItem } from "../data/containerItems";
import ItemGrid from "../components/inventory/ItemGrid";

type LocationProps = {
  locationId: string | null;
  onReturn: () => void;
  onOpenTrader: (traderId: string) => void;
  onTravelTo: (locationId: string) => void;
};

function Location({
  locationId,
  onReturn,
  onOpenTrader,
  onTravelTo,
}: LocationProps) {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [loot, setLoot] = useState<ContainerItem[]>([]);

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

    if (effect.type === "openTrader") {
      onOpenTrader(effect.traderId);
    }

    if (effect.type === "travelTo") {
      onTravelTo(effect.locationId);
    }

    if (effect.type === "spawnLoot") {
      const newItem: ContainerItem = {
        containerItemId: crypto.randomUUID(),
        itemId: effect.itemId,
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
    // Choices clear temporary loot before applying their effects.
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

  function handleLootChanged(updatedLoot: ContainerItem[]) {
    setLoot(updatedLoot);
  }

  function handleItemRemoved(containerItemId: string) {
    setLoot((currentLoot) =>
      currentLoot.filter((item) => item.containerItemId !== containerItemId),
    );
  }

  return (
    <div className="location">
      <h1 className="location-header">{location.name}</h1>

      <p className="location-text">{currentNode.text}</p>

      {loot.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ItemGrid
            containerId={location.id}
            containerType="loot"
            width={3}
            height={3}
            inventory={loot}
            onInventoryChange={handleLootChanged}
            onItemRemoved={handleItemRemoved}
          />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
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
    </div>
  );
}

export default Location;
