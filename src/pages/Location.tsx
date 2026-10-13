import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import "./Location.css";
import { locations } from "../data/locations";
import { adventures } from "../data/places";
import type { AdventureChoice, AdventureEffect } from "../data/adventureTypes";
import type { ContainerItem } from "../data/containerItems";
import ItemGrid from "../components/inventory/ItemGrid";
import ItemCard from "../components/inventory/ItemCard";
import type { ContainerType } from "../data/containerTypes";
import { performTransaction } from "../game/performTransaction";

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
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

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

  /*
   * Returns true if ItemGrid should remove the item from its source container.
   * Returns false if the handler already updated the source,
   * or if the drop was rejected.
   */
  function handleCrossContainerDrop(
    item: ContainerItem,
    position: { x: number; y: number },
    sourceId: string,
    sourceType: ContainerType,
  ): boolean {
    if (!activeContainer) {
      return false;
    }

    // Storage: the transaction moves the item between the player's lists,
    // so the source has already been updated.
    if (activeContainer.type === "storage") {
      const result = performTransaction({
        item,
        sourceId,
        sourceType,
        destinationId: "storage",
        destinationType: "storage",
        position,
        player,
      });

      if (!result.success) {
        return false;
      }

      setPlayer(result.player);
      return false;
    }

    if (activeContainer.type !== "quest") {
      return false;
    }

    // Quest containers only accept items dragged from the player's inventory.
    if (sourceType !== "player" || sourceId !== "player") {
      return false;
    }

    // Validate the accepted item again when processing the transfer.
    if (item.itemId !== activeContainer.acceptedItemId) {
      return false;
    }

    // Don't accept an item that is no longer in the player's inventory.
    const playerHasItem = player.Inventory.some(
      (inventoryItem) =>
        inventoryItem.containerItemId === item.containerItemId &&
        inventoryItem.itemId === activeContainer.acceptedItemId,
    );

    if (!playerHasItem) {
      return false;
    }

    const deliveredFlag = `${activeContainer.questId}.Delivered`;

    // Mark the quest as delivered. The item itself is removed from the
    // player's inventory by ItemGrid, because we return true below.
    setPlayer((currentPlayer) => ({
      ...currentPlayer,
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

    return true;
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
    switch (effect.type) {
      case "unlockLocation":
        setPlayer((p) => ({
          ...p,
          UnlockedLocations: p.UnlockedLocations.includes(effect.locationId)
            ? p.UnlockedLocations
            : [...p.UnlockedLocations, effect.locationId],
        }));
        break;

      case "lockLocation":
        setPlayer((p) => ({
          ...p,
          UnlockedLocations: p.UnlockedLocations.filter(
            (id) => id !== effect.locationId,
          ),
        }));
        break;

      case "addGold":
        setPlayer((p) => ({
          ...p,
          Gold: p.Gold + effect.amount,
        }));
        break;

      case "removeGold":
        setPlayer((p) => ({
          ...p,
          Gold: p.Gold - effect.amount,
        }));
        break;

      case "openTrader":
        onOpenTrader(effect.traderId);
        break;

      case "travelTo":
        onTravelTo(effect.locationId);
        break;

      case "spawnLoot": {
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
        break;
      }

      case "openQuestContainer":
        setContainerItems([]);
        setActiveContainer({
          type: "quest",
          id: `quest-${effect.questId}`,
          questId: effect.questId,
          acceptedItemId: effect.acceptedItemId,
        });
        break;

      case "openStorage":
        setContainerItems([]);
        setActiveContainer({ type: "storage", id: "storage" });
        break;

      case "removeItem":
        setPlayer((p) => ({
          ...p,
          Inventory: p.Inventory.filter(
            (item) => item.itemId !== effect.itemId,
          ),
        }));
        break;

      case "addExperience":
        setPlayer((p) => ({
          ...p,
          Exp: p.Exp + effect.amount,
        }));
        break;

      case "heal":
        setPlayer((p) => ({
          ...p,
          HP: Math.min(p.HP + effect.amount, p.HPMax),
        }));
        break;

      case "damage":
        setPlayer((p) => ({
          ...p,
          HP: Math.max(p.HP - effect.amount, 0),
        }));
        break;

      case "setStoryFlag":
        setPlayer((p) => ({
          ...p,
          StoryFlags: {
            ...p.StoryFlags,
            [effect.flag]: effect.value,
          },
        }));
        break;

      case "endAdventure":
        onReturn();
        break;

      case "learnSkill":
        setPlayer((p) => ({
          ...p,
          KnownSkills: p.KnownSkills.includes(effect.skillId)
            ? p.KnownSkills
            : [...p.KnownSkills, effect.skillId],
        }));
        break;

      default: {
        // Compile-time check: errors if an AdventureEffect type has no case above.
        const _exhaustive: never = effect;
        void _exhaustive;
      }
    }
  }

  function handleChoice(choice: AdventureChoice) {
    // Clear the temporary location container before applying new effects.
    setContainerItems([]);
    setActiveContainer(null);
    setHoveredItemId(null);

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
        <div>
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
                onHoveredItemChange={setHoveredItemId}
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
                onHoveredItemChange={setHoveredItemId}
                onCrossContainerDrop={handleCrossContainerDrop}
                acceptedItemId={
                  activeContainer.type === "quest"
                    ? activeContainer.acceptedItemId
                    : undefined
                }
              />
            )}
          </div>

          <ItemCard itemId={hoveredItemId} />
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
