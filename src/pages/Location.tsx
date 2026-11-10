import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { useItemHover } from "../context/useItemHover";
import "./Location.css";
import { locations } from "../data/locations";
import { getChestDefinition } from "../data/Chests";
import { adventures } from "../data/places";
import type { AdventureChoice, AdventureEffect } from "../data/adventureTypes";
import type { ContainerItem } from "../data/containerItems";
import ItemGrid from "../components/inventory/ItemGrid";
import type { ContainerType } from "../data/containerTypes";
import { performTransaction } from "../game/performTransaction";
import type { CombatEncounter, CombatResult } from "../game/combatTypes";
import { placeLoot } from "../game/lootPlacement";
import {
  recalculatePlayerStats,
  restorePlayerResources,
} from "../game/characterStats";
import { DAILY_ACTION_POINTS } from "../data/player";
import {
  addItemToInventory,
  findFirstAvailableItemPosition,
} from "../game/inventory";

const LOOT_WIDTH = 3;
const LOOT_HEIGHT = 4;

function renderLocationText(text: string) {
  return text.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
    <p className="location-paragraph" key={paragraphIndex}>
      {paragraph.split(/('[^']+'|“[^”]+”)/g).map((part, partIndex) =>
        (part.startsWith("'") && part.endsWith("'")) ||
        (part.startsWith("“") && part.endsWith("”")) ? (
          <span className="location-dialogue" key={partIndex}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  ));
}

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
  | { type: "chest"; id: string };

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
  const { player, setPlayer } = usePlayer();
  const [currentNodeId, setCurrentNodeId] = useState(() => {
    const selectedLocation = locations.find(
      (location) => location.id === locationId,
    );

    if (
      selectedLocation?.introNodeId &&
      selectedLocation.introSeenFlag &&
      !player.StoryFlags[selectedLocation.introSeenFlag]
    ) {
      return selectedLocation.introNodeId;
    }

    if (
      selectedLocation?.preQuestNodeId &&
      selectedLocation.questCompleteFlag &&
      !player.StoryFlags[selectedLocation.questCompleteFlag]
    ) {
      return selectedLocation.preQuestNodeId;
    }

    return "start";
  });
  const [containerItems, setContainerItems] = useState<ContainerItem[]>([]);
  const [activeContainer, setActiveContainer] =
    useState<ActiveLocationContainer | null>(null);
  const { setHoveredItem } = useItemHover();
  const [rewardSummary, setRewardSummary] = useState<{
    exp: number;
    gold: number;
  } | null>(null);

  const location = locations.find((location) => location.id === locationId);

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

  const activeChest =
    activeContainer?.type === "chest"
      ? getChestDefinition(activeContainer.id)
      : null;

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

    if (activeContainer.type === "chest") {
      const isPlayerToChest = sourceType === "player" && sourceId === "player";
      const isChestToPlayer =
        sourceType === "chest" && sourceId === activeContainer.id;

      if (!isPlayerToChest && !isChestToPlayer) {
        return false;
      }

      const result = performTransaction({
        item,
        sourceId,
        sourceType,
        destinationId: isPlayerToChest ? activeContainer.id : "player",
        destinationType: isPlayerToChest ? "chest" : "player",
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

    const conditions = Array.isArray(choice.condition)
      ? choice.condition
      : [choice.condition];

    return conditions.every((condition) => {
      if (condition.type === "storyFlag") {
        const flagValue = player.StoryFlags[condition.flag] ?? false;

        return flagValue === condition.value;
      }

      if (condition.type === "hasItem") {
        return player.Inventory.some(
          (item) => item.itemId === condition.itemId,
        );
      }

      if (condition.type === "hasActionPoints") {
        return player.ActionPoints >= condition.amount;
      }

      return false;
    });
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
    setHoveredItem(null);

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
          LockedLocations: p.LockedLocations.filter(
            (id) => id !== effect.locationId,
          ),
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
          LockedLocations: p.LockedLocations.includes(effect.locationId)
            ? p.LockedLocations
            : [...p.LockedLocations, effect.locationId],
        }));
        break;

      case "hideLocation":
        setPlayer((p) => ({
          ...p,
          UnlockedLocations: p.UnlockedLocations.filter(
            (id) => id !== effect.locationId,
          ),
          LockedLocations: p.LockedLocations.filter(
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
        setActiveContainer({ type: "chest", id: "playerStorage" });
        break;

      case "openChest":
        getChestDefinition(effect.chestId);
        if (!player.Chests[effect.chestId]) {
          throw new Error(
            `Missing player inventory for chest "${effect.chestId}".`,
          );
        }
        setActiveContainer({ type: "chest", id: effect.chestId });
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

      case "removeActionPoints":
        setPlayer((p) => ({
          ...p,
          ActionPoints: Math.max(
            0,
            p.ActionPoints - Math.max(0, effect.amount),
          ),
        }));
        break;

      case "regainActionPoints":
        setPlayer((p) => ({
          ...p,
          ActionPoints: Math.min(
            DAILY_ACTION_POINTS,
            p.ActionPoints + Math.max(0, effect.amount),
          ),
        }));
        break;

      case "scheduleStoryFlag":
        setPlayer((p) => ({
          ...p,
          ScheduledStoryFlags: [
            ...p.ScheduledStoryFlags.filter(
              (scheduled) => scheduled.flag !== effect.flag,
            ),
            {
              flag: effect.flag,
              dueDay: p.day + Math.max(1, Math.floor(effect.days)),
            },
          ],
        }));
        break;

      case "sleep":
        setPlayer((p) => {
          const day = p.day + 1;
          const dueFlags = p.ScheduledStoryFlags.filter(
            (scheduled) => scheduled.dueDay <= day,
          );

          return {
            ...restorePlayerResources(p),
            ActionPoints: DAILY_ACTION_POINTS,
            day,
            StoryFlags: {
              ...p.StoryFlags,
              ...Object.fromEntries(
                dueFlags.map((scheduled) => [scheduled.flag, true]),
              ),
            },
            ScheduledStoryFlags: p.ScheduledStoryFlags.filter(
              (scheduled) => scheduled.dueDay > day,
            ),
          };
        });
        break;

      case "fullHeal":
        setPlayer((p) => restorePlayerResources(p));
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
    setHoveredItem(null);
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
    if (activeContainer?.type === "chest") {
      setPlayer((currentPlayer) => ({
        ...currentPlayer,
        Chests: {
          ...currentPlayer.Chests,
          [activeContainer.id]: updatedItems,
        },
      }));
      return;
    }

    setContainerItems(updatedItems);
  }

  function handleContainerItemRemoved(containerItemId: string) {
    if (activeContainer?.type === "chest") {
      setPlayer((currentPlayer) => ({
        ...currentPlayer,
        Chests: {
          ...currentPlayer.Chests,
          [activeContainer.id]: currentPlayer.Chests[activeContainer.id].filter(
            (item) => item.containerItemId !== containerItemId,
          ),
        },
      }));
      return;
    }

    setContainerItems((currentItems) =>
      currentItems.filter((item) => item.containerItemId !== containerItemId),
    );
  }

  function handleTakeAll() {
    if (
      !activeContainer ||
      (activeContainer.type !== "loot" && activeContainer.type !== "chest") ||
      (activeContainer.type === "chest" &&
        activeContainer.id === "playerStorage")
    ) {
      return;
    }

    let updatedPlayer = player;
    const remainingItems: ContainerItem[] = [];
    const itemsToTake =
      activeContainer.type === "loot"
        ? containerItems
        : player.Chests[activeContainer.id];

    for (const lootItem of itemsToTake) {
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
          updatedPlayer.Chests.playerStorage,
          getChestDefinition("playerStorage").width,
          getChestDefinition("playerStorage").height,
        ) !== null;

      if (!fitsInBackpack && !fitsInStorage) {
        remainingItems.push(lootItem);
        continue;
      }

      if (activeContainer.type === "loot") {
        updatedPlayer = addItemToInventory(
          updatedPlayer,
          lootItem.itemId,
          lootItem.containerItemId,
        );
      } else {
        const remainingChestItems = updatedPlayer.Chests[
          activeContainer.id
        ].filter((item) => item.containerItemId !== lootItem.containerItemId);

        updatedPlayer = addItemToInventory(
          {
            ...updatedPlayer,
            Chests: {
              ...updatedPlayer.Chests,
              [activeContainer.id]: remainingChestItems,
            },
          },
          lootItem.itemId,
          lootItem.containerItemId,
        );
      }
    }

    if (updatedPlayer !== player) {
      setPlayer(updatedPlayer);
    }
    if (activeContainer.type === "loot") {
      setContainerItems(remainingItems);
    }
  }

  const activeContainerItems =
    activeContainer?.type === "chest"
      ? player.Chests[activeContainer.id]
      : containerItems;
  const canTakeAll =
    activeContainer?.type === "loot" ||
    (activeContainer?.type === "chest" &&
      activeContainer.id !== "playerStorage");
  const canTakeAnyItem =
    canTakeAll &&
    activeContainerItems.some(
      (lootItem) =>
        findFirstAvailableItemPosition(
          lootItem.itemId,
          player.Inventory,
          player.BackpackWidth,
          player.BackpackHeight,
        ) !== null ||
        findFirstAvailableItemPosition(
          lootItem.itemId,
          player.Chests.playerStorage,
          getChestDefinition("playerStorage").width,
          getChestDefinition("playerStorage").height,
        ) !== null,
    );
  const hasLootToCollect =
    activeContainer?.type === "loot" && containerItems.length > 0;

  return (
    <div className="location">
      <h1 className="location-header">{location.name}</h1>

      <div
        className={`location-content${hasLootToCollect ? " location-content--loot" : ""}`}
      >
        <div className="location-text">
          {renderLocationText(currentNode.text)}
        </div>

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

        {rewardSummary && (
          <div className="location-reward-summary">
            <span>+{rewardSummary.exp} Erfarenhet</span>
            {rewardSummary.gold > 0 && (
              <span>+{rewardSummary.gold} Kroner</span>
            )}
          </div>
        )}

        {activeContainer?.type === "chest" && activeChest && (
          <div className="location-container location-chest-container">
            <h2 className="location-chest-title">{activeChest.name}</h2>
            <div className="location-inventory-grid">
              <ItemGrid
                containerId={activeContainer.id}
                containerType="chest"
                width={activeChest.width}
                height={activeChest.height}
                inventory={activeContainerItems}
                onInventoryChange={handleContainerItemsChanged}
                onItemRemoved={handleContainerItemRemoved}
                onCrossContainerDrop={handleCrossContainerDrop}
              />
            </div>
            {canTakeAll && (
              <button
                className="location-choice"
                disabled={!canTakeAnyItem}
                onClick={handleTakeAll}
              >
                Ta allt
              </button>
            )}
          </div>
        )}

        {activeContainer &&
          activeContainer.type !== "chest" &&
          (activeContainer.type !== "loot" || containerItems.length > 0) && (
            <div
              className={`location-container${activeContainer.type === "loot" ? " location-container--loot" : ""}`}
            >
              {activeContainer.type === "loot" && (
                <div className="location-loot-actions">
                  <button
                    className="location-choice"
                    disabled={!canTakeAnyItem}
                    onClick={handleTakeAll}
                  >
                    Ta allt
                  </button>
                  {containerItems.length > 0 && !canTakeAnyItem && (
                    <p className="location-loot-message">
                      Föremålen får inte plats i ryggsäcken eller förvaringen.
                    </p>
                  )}
                </div>
              )}
              <div className="location-inventory-grid">
                <ItemGrid
                  containerId={activeContainer.id}
                  containerType={activeContainer.type}
                  width={activeContainer.type === "loot" ? LOOT_WIDTH : 3}
                  height={activeContainer.type === "loot" ? LOOT_HEIGHT : 3}
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
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default Location;
