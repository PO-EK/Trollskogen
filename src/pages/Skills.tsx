import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import SkillCard from "../components/skills/SkillCard";
import type { Skill, SkillGroup } from "../data/skillTypes";
import { getSkill } from "../data/skills";
import { GROUP_LABELS } from "../game/labels";
import {
  canSlotSkill,
  clearSlot,
  firstEmptySlot,
  getGrantedSkills,
  getSkillGroup,
  getSkillSlots,
  placeSkill,
  swapSlots,
} from "../game/skillLoadout";
import type { SkillSlots } from "../game/skillLoadout";
import "./Skills.css";

type SkillsProps = {
  onClose: () => void;
};

// What is being dragged: a library card (fromSlot null) or a slotted skill.
type SkillDrag = { skillId: string; fromSlot: number | null };

type GroupFilter = SkillGroup | "all";

const FILTERS: GroupFilter[] = ["all", "weapon", "spell", "support"];
const FILTER_LABELS: Record<GroupFilter, string> = {
  all: "Alla",
  ...GROUP_LABELS,
};

function Skills({ onClose }: SkillsProps) {
  const { player, setPlayer } = usePlayer();
  const [drag, setDrag] = useState<SkillDrag | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [filter, setFilter] = useState<GroupFilter>("all");
  const [query, setQuery] = useState("");

  const granted = getGrantedSkills(player);
  const slots = getSkillSlots(player);

  const search = query.trim().toLowerCase();

  const library = player.KnownSkills.map(getSkill)
    .filter((skill): skill is Skill => skill !== undefined)
    .filter((skill) => filter === "all" || getSkillGroup(skill) === filter)
    .filter(
      (skill) =>
        search === "" ||
        skill.name.toLowerCase().includes(search) ||
        skill.description.toLowerCase().includes(search),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));

  // Every change to the slots goes through here, based on the latest state.
  function updateSlots(update: (current: SkillSlots) => SkillSlots) {
    setPlayer((p) => ({ ...p, EquippedSkills: update(getSkillSlots(p)) }));
  }

  function startDrag(event: React.DragEvent, next: SkillDrag) {
    // Firefox won't start a drag without data.
    event.dataTransfer.setData("text/plain", next.skillId);
    event.dataTransfer.effectAllowed = "move";
    setDrag(next);
  }

  function handleDropOnSlot(index: number) {
    setOverSlot(null);

    if (!drag) {
      return;
    }

    const { skillId, fromSlot } = drag;
    setDrag(null);

    if (fromSlot !== null) {
      updateSlots((current) => swapSlots(current, fromSlot, index));
    } else if (canSlotSkill(player, skillId)) {
      updateSlots((current) => placeSkill(current, skillId, index));
    }
  }

  // Dropping a slotted skill back onto the library removes it from its slot.
  function handleDropOnLibrary() {
    if (!drag) {
      return;
    }

    const { fromSlot } = drag;
    setDrag(null);

    if (fromSlot !== null) {
      updateSlots((current) => clearSlot(current, fromSlot));
    }
  }

  function equipFromButton(skillId: string) {
    const index = firstEmptySlot(slots);

    if (index !== null) {
      updateSlots((current) => placeSkill(current, skillId, index));
    }
  }

  function renderLibraryAction(skill: Skill) {
    if (granted.some((entry) => entry.skill.id === skill.id)) {
      return <span className="skills-note">Via utrustning</span>;
    }

    if (slots.includes(skill.id)) {
      return <span className="skills-note">✓ Utrustad</span>;
    }

    const full = firstEmptySlot(slots) === null;

    return (
      <button
        className="skills-button"
        disabled={full}
        title={
          full
            ? "Alla platser är fulla. Dra till en plats för att byta."
            : undefined
        }
        onClick={() => equipFromButton(skill.id)}
      >
        Utrusta
      </button>
    );
  }

  // Slots accept a drop if it is a swap, or a skill that may be slotted.
  const dropOk =
    drag !== null &&
    (drag.fromSlot !== null || canSlotSkill(player, drag.skillId));

  return (
    <div className="skills-page">
      <div className="skills-header">
        <h1>Färdigheter</h1>
        <button className="skills-close" onClick={onClose}>
          Tillbaka
        </button>
      </div>

      <section className="skills-section">
        <h3>Dina färdigheter</h3>
        <p className="skills-hint">
          Dra en färdighet hit från biblioteket, eller tryck på Utrusta.
        </p>
        <div className="skills-slots">
          {slots.map((skillId, index) => {
            const skill = skillId ? getSkill(skillId) : undefined;

            return (
              <div
                key={index}
                className="skills-slot"
                data-filled={skill ? "true" : "false"}
                data-drop={drag ? (dropOk ? "valid" : "invalid") : undefined}
                data-over={overSlot === index}
                onDragOver={(event) => {
                  if (dropOk) {
                    event.preventDefault();
                  }
                }}
                onDragEnter={() => setOverSlot(index)}
                onDragLeave={(event) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  ) {
                    setOverSlot(null);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDropOnSlot(index);
                }}
              >
                {/* <span className="skills-slot-number">{index + 1}</span> */}

                {skill ? (
                  <>
                    <div
                      className="skills-slot-skill"
                      draggable
                      onDragStart={(event) =>
                        startDrag(event, { skillId: skill.id, fromSlot: index })
                      }
                      onDragEnd={() => setDrag(null)}
                    >
                      <span className="skills-slot-name">{skill.name}</span>
                      {/* <span className="skills-slot-meta">
                        {getSkillSummary(skill)}
                      </span> */}
                    </div>
                    <button
                      className="skills-slot-clear"
                      aria-label="Ta bort"
                      onClick={() =>
                        updateSlots((current) => clearSlot(current, index))
                      }
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="skills-slot-empty">Tom plats</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="skills-library">
        <h3>Bibliotek</h3>

        <div className="skills-toolbar">
          {FILTERS.map((option) => (
            <button
              key={option}
              className="skills-filter"
              data-active={filter === option}
              onClick={() => setFilter(option)}
            >
              {FILTER_LABELS[option]}
            </button>
          ))}

          <input
            className="skills-search"
            type="search"
            placeholder="Sök färdighet…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div
          className="skills-library-list"
          onDragOver={(event) => {
            if (drag && drag.fromSlot !== null) {
              event.preventDefault();
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleDropOnLibrary();
          }}
        >
          {library.length === 0 && (
            <p className="skills-empty">
              {player.KnownSkills.length === 0
                ? "Du har inte lärt dig några färdigheter än."
                : "Inga färdigheter matchar."}
            </p>
          )}

          {library.map((skill) => (
            <div
              key={skill.id}
              draggable={canSlotSkill(player, skill.id)}
              onDragStart={(event) =>
                startDrag(event, { skillId: skill.id, fromSlot: null })
              }
              onDragEnd={() => setDrag(null)}
            >
              <SkillCard
                skill={skill}
                action={renderLibraryAction(skill)}
                compact
              />
            </div>
          ))}
        </div>
      </section>
      {/* <section className="skills-section">
        <h3>Från utrustning</h3>
        <p className="skills-hint">
          Läggs till automatiskt när du utrustar vapen och rustning.
        </p>
        <div className="skills-card-grid skills-card-grid--compact">
          {granted.map(({ skill, sourceName }) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              source={sourceName}
              compact
            />
          ))}
        </div>
      </section> */}
    </div>
  );
}

export default Skills;
