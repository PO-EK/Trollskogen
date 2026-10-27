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
import type { CombatEncounter, CombatResult } from "../game/combatTypes";
import { placeLoot } from "../game/lootPlacement";
import { recalculatePlayerStats } from "../game/characterStats";
import {
  addItemToInventory,
  findFirstAvailableItemPosition,
} from "../game/inventory";

const LOOT_WIDTH = 4;
const LOOT_HEIGHT = 4;

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
  onStartCombat: (
    encounter: CombatEncounter,
    onFinish: (result: CombatResult) => void,
  ) => void;
};

function Location({
  locationId,
  onReturn,
  onOpenTrader,
  onTravelTo,
  onStartCombat,
}: LocationProps) {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [containerItems, setContainerItems] = useState<ContainerItem[]>([]);
  const [activeContainer, setActiveContainer] =
    useState<ActiveLocationContainer | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [rewardSummary, setRewardSummary] = useState<{
    exp: number;
    gold: number;
  } | null>(null);

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

  function applyCombatResult(
    encounter: CombatEncounter,
    startNodeId: string,
    result: CombatResult,
  ) {
    // What the player has left. Losing leaves you at 1 HP.
    setPlayer((p) => ({
      ...p,
      HP: Math.max(1, result.hp),
      Mana: result.mana,
    }));

    setContainerItems([]);
    setActiveContainer(null);
    setHoveredItemId(null);

    if (result.outcome === "win") {
      setRewardSummary({ exp: result.exp, gold: result.gold });
      setCurrentNodeId(encounter.winNodeId);
      handleEffect({ type: "addExperience", amount: result.exp });
      handleEffect({ type: "addGold", amount: result.gold });
      handleEffect({ type: "openLoot", itemIds: result.loot });
    } else if (result.outcome === "lose") {
      setRewardSummary(null);
      setCurrentNodeId(encounter.loseNodeId);
    } else {
      setRewardSummary(null);
      // Fled: back to where the fight began unless the story says otherwise.
      setCurrentNodeId(encounter.fleeNodeId ?? startNodeId);
    }
  }

  function addExperience(amount: number) {
    setPlayer((p) => {
      let exp = p.Exp + amount;
      let expMax = p.ExpMax;
      let level = p.Level;
      let skillPoints = p.SkillPoints;

      while (exp >= expMax) {
        exp -= expMax;
        level += 1;
        expMax = Math.ceil(expMax * 1.1);
        skillPoints += 1;
      }

      return recalculatePlayerStats({
        ...p,
        Exp: exp,
        ExpMax: expMax,
        Level: level,
        SkillPoints: skillPoints,
      });
    });
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

      case "openLoot":
        if (effect.itemIds.length === 0) {
          break;
        }

        setContainerItems(placeLoot(effect.itemIds, LOOT_WIDTH, LOOT_HEIGHT));
        setActiveContainer({ type: "loot", id: safeLocation.id });
        break;

      case "startCombat": {
        const encounter: CombatEncounter = effect;
        const startNodeId = currentNodeId;

        // App keeps this function until the fight ends, then calls it.
        onStartCombat(encounter, (result) =>
          applyCombatResult(encounter, startNodeId, result),
        );
        break;
      }

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
        addExperience(effect.amount);
        break;

      case "heal":
        setPlayer((p) => ({
          ...p,
          HP: Math.min(p.HP + effect.amount, p.HPMax),
        }));
        break;
      case "restoreMana":
        setPlayer((p) => ({
          ...p,
          Mana: Math.min(p.Mana + effect.amount, p.ManaMax),
        }));
        break;

      case "fullHeal":
        setPlayer((p) => ({
          ...p,
          HP: p.HPMax,
          Mana: p.ManaMax,
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
    setRewardSummary(null);

    if (choice.effects) {
      const opensLoot = choice.effects.some(
        (effect) => effect.type === "openLoot" || effect.type === "spawnLoot",
      );
      if (opensLoot) {
        const exp = choice.effects.reduce(
          (total, effect) =>
            total + (effect.type === "addExperience" ? effect.amount : 0),
          0,
        );
        const gold = choice.effects.reduce(
          (total, effect) =>
            total + (effect.type === "addGold" ? effect.amount : 0),
          0,
        );

        if (exp > 0 || gold > 0) {
          setRewardSummary({ exp, gold });
        }
      }

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

  function handleTakeAll() {
    if (activeContainer?.type !== "loot") {
      return;
    }

    let updatedPlayer = player;
    const remainingItems: ContainerItem[] = [];

    for (const lootItem of containerItems) {
      const fitsInBackpack =
        findFirstAvailableItemPosition(
          lootItem.itemId,
          updatedPlayer.Inventory,
          updatedPlayer.BackpackWidth,
          updatedPlayer.BackpackHeight,
        ) !== null;
      const fitsInStorage =
        findFirstAvailableItemPosition(
          lootItem.itemId,
          updatedPlayer.Storage,
          updatedPlayer.StorageWidth,
          updatedPlayer.StorageHeight,
        ) !== null;

      if (!fitsInBackpack && !fitsInStorage) {
        remainingItems.push(lootItem);
        continue;
      }

      updatedPlayer = addItemToInventory(
        updatedPlayer,
        lootItem.itemId,
        lootItem.containerItemId,
      );
    }

    if (updatedPlayer !== player) {
      setPlayer(updatedPlayer);
    }
    setContainerItems(remainingItems);
  }

  const canTakeAnyLoot =
    activeContainer?.type === "loot" &&
    containerItems.some(
      (lootItem) =>
        findFirstAvailableItemPosition(
          lootItem.itemId,
          player.Inventory,
          player.BackpackWidth,
          player.BackpackHeight,
        ) !== null ||
        findFirstAvailableItemPosition(
          lootItem.itemId,
          player.Storage,
          player.StorageWidth,
          player.StorageHeight,
        ) !== null,
    );

  return (
    <div className="location">
      <h1 className="location-header">{location.name}</h1>

      <p className="location-text">{currentNode.text}</p>

      {rewardSummary && (
        <div className="location-reward-summary">
          <span>Erfarenhet: +{rewardSummary.exp} XP</span>
          {rewardSummary.gold > 0 && (
            <span>Guld hittat: +{rewardSummary.gold} Kroner</span>
          )}
        </div>
      )}

      {activeContainer && (
        <div>
          {activeContainer.type === "loot" && (
            <div className="location-loot-actions">
              <button
                className="location-choice"
                disabled={!canTakeAnyLoot}
                onClick={handleTakeAll}
              >
                Ta allt
              </button>
              {containerItems.length > 0 && !canTakeAnyLoot && (
                <p className="location-loot-message">
                  Föremålen får inte plats i ryggsäcken eller förvaringen.
                </p>
              )}
            </div>
          )}
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
                width={activeContainer.type === "loot" ? LOOT_WIDTH : 4}
                height={activeContainer.type === "loot" ? LOOT_HEIGHT : 4}
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
