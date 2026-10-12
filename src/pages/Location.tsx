import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import "./Location.css";
import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice, AdventureEffect } from "../data/adventureTypes";
import type { ContainerItem } from "../data/containerItems";
import ItemGrid from "../components/inventory/ItemGrid";
import type { ContainerType } from "../data/containerTypes";

type ActiveLocationContainer =
  | {
      type: "loot";
      id: string;
    }
  | {
      type: "quest";
      id: string;
      questId: string;
      acceptedItemId: string;
    }
  | { type: "storage"; id: "storage" };

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
  const [containerItems, setContainerItems] = useState<ContainerItem[]>([]);
  const [activeContainer, setActiveContainer] =
    useState<ActiveLocationContainer | null>(null);

  const location = locations.find((location) => location.id === locationId);

  const { player, setPlayer } = usePlayer();

  if (!location) {
    return <p>Location not found.</p>;
  }

  const safeLocation = location;

  const adventure = adventures[location.adventureId];

  if (!adventure) {
    return <p>Adventure not found.</p>;
  }

  const currentNode = adventure[currentNodeId];

  if (!currentNode) {
    return <p>Adventure node not found.</p>;
  }

  function handleCrossContainerDrop(
    item: ContainerItem,
    position: { x: number; y: number },
    sourceId: string,
    sourceType: ContainerType,
  ) {
    if (!activeContainer) {
      return;
    }

    if (activeContainer.type === "storage") {
      if (sourceType !== "player") return;

      setPlayer((p) => ({
        ...p,
        Inventory: p.Inventory.filter(
          (i) => i.containerItemId !== item.containerItemId,
        ),
        Storage: [...p.Storage, { ...item, x: position.x, y: position.y }],
      }));
      return;
    }

    if (activeContainer.type !== "quest") {
      return;
    }

    // Quest containers only accept items dragged from the player's inventory.
    if (sourceType !== "player" || sourceId !== "player") {
      return;
    }

    // Validate the accepted item again when processing the transfer.
    if (item.itemId !== activeContainer.acceptedItemId) {
      return;
    }

    const deliveredFlag = `${activeContainer.questId}.Delivered`;

    // Don't accept an item that is no longer in the player's inventory.
    const playerHasItem = player.Inventory.some(
      (inventoryItem) =>
        inventoryItem.containerItemId === item.containerItemId &&
        inventoryItem.itemId === activeContainer.acceptedItemId,
    );

    if (!playerHasItem) {
      return;
    }

    // Move the accepted item from the player's inventory into the quest container.
    setPlayer((currentPlayer) => ({
      ...currentPlayer,
      Inventory: currentPlayer.Inventory.filter(
        (inventoryItem) =>
          inventoryItem.containerItemId !== item.containerItemId,
      ),
      StoryFlags: {
        ...currentPlayer.StoryFlags,
        [deliveredFlag]: true,
      },
    }));

    setContainerItems((currentItems) => [
      ...currentItems,
      {
        ...item,
        x: position.x,
        y: position.y,
      },
    ]);
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
    if (effect.type === "unlockLocation") {
      setPlayer((player) => ({
        ...player,
        UnlockedLocations: player.UnlockedLocations.includes(effect.locationId)
          ? player.UnlockedLocations
          : [...player.UnlockedLocations, effect.locationId],
      }));
    }
    if (effect.type === "lockLocation") {
      setPlayer((player) => ({
        ...player,
        UnlockedLocations: player.UnlockedLocations.filter(
          (locationId) => locationId !== effect.locationId,
        ),
      }));
    }
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

      setContainerItems([newItem]);
      setActiveContainer({
        type: "loot",
        id: safeLocation.id,
      });
    }

    if (effect.type === "openQuestContainer") {
      setContainerItems([]);
      setActiveContainer({
        type: "quest",
        id: `quest-${effect.questId}`,
        questId: effect.questId,
        acceptedItemId: effect.acceptedItemId,
      });
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
    // Clear the temporary location container before applying new effects.
    setContainerItems([]);
    setActiveContainer(null);

    if (choice.effects) {
      for (const effect of choice.effects) {
        handleEffect(effect);
      }
    }

    if (choice.nextNodeId) {
      setCurrentNodeId(choice.nextNodeId);
    }
  }

  function handleContainerItemsChanged(updatedItems: ContainerItem[]) {
    setContainerItems(updatedItems);
  }

  function handleContainerItemRemoved(containerItemId: string) {
    setContainerItems((currentItems) =>
      currentItems.filter((item) => item.containerItemId !== containerItemId),
    );
  }

  return (
    <div className="location">
      <h1 className="location-header">{location.name}</h1>

      <p className="location-text">{currentNode.text}</p>

      {activeContainer && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {activeContainer.type === "storage" ? (
            <ItemGrid
              containerId="storage"
              containerType="storage"
              width={player.StorageWidth}
              height={player.StorageHeight}
              inventory={player.Storage}
              onInventoryChange={(updated) =>
                setPlayer((p) => ({ ...p, Storage: updated }))
              }
              onItemRemoved={(id) =>
                setPlayer((p) => ({
                  ...p,
                  Storage: p.Storage.filter((i) => i.containerItemId !== id),
                }))
              }
              onCrossContainerDrop={handleCrossContainerDrop}
            />
          ) : (
            <ItemGrid
              containerId={activeContainer.id}
              containerType={activeContainer.type}
              width={3}
              height={3}
              inventory={containerItems}
              onInventoryChange={handleContainerItemsChanged}
              onItemRemoved={handleContainerItemRemoved}
              onCrossContainerDrop={handleCrossContainerDrop}
              acceptedItemId={
                activeContainer.type === "quest"
                  ? activeContainer.acceptedItemId
                  : undefined
              }
            />
          )}
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
