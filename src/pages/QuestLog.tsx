import { quests } from "../data/Quests";
import { usePlayer } from "../context/usePlayer";
import type { OverlayProps } from "./overlays";
import "./QuestLog.css";

function QuestLog({ onClose }: OverlayProps) {
  const { player } = usePlayer();
  const availableQuests = quests.filter(
    (quest) =>
      player.StoryFlags[quest.startedFlag] ||
      player.StoryFlags[quest.completedFlag],
  );
  const activeQuests = availableQuests.filter(
    (quest) => !player.StoryFlags[quest.completedFlag],
  );
  const completedQuests = availableQuests.filter(
    (quest) => player.StoryFlags[quest.completedFlag],
  );

  return (
    <div className="quest-log">
      <header className="quest-log-header">
        <h1>Uppdragslogg</h1>
        <button className="quest-log-close" onClick={onClose}>
          Stäng
        </button>
      </header>

      {availableQuests.length === 0 ? (
        <p className="quest-log-empty">
          Inga uppdrag ännu. Acceptera ett uppdrag för att se det här.
        </p>
      ) : (
        <>
          {activeQuests.length > 0 && (
            <section className="quest-log-section">
              <h2>Pågående</h2>
              {activeQuests.map((quest) => (
                <article className="quest-log-entry" key={quest.id}>
                  <h3>{quest.title}</h3>
                  <p>{quest.description}</p>
                  <ol className="quest-log-stages">
                    {quest.stages.map((stage, index) => {
                      const completed = Boolean(
                        player.StoryFlags[stage.completedFlag],
                      );
                      const current =
                        !completed &&
                        quest.stages
                          .slice(0, index)
                          .every((previousStage) =>
                            player.StoryFlags[previousStage.completedFlag],
                          );

                      return (
                        <li
                          className="quest-log-stage"
                          data-state={
                            completed ? "completed" : current ? "current" : "upcoming"
                          }
                          key={stage.completedFlag}
                        >
                          <span>{stage.text}</span>
                          <span className="quest-log-stage-status">
                            {completed ? "Klar" : current ? "Aktuellt" : "Kommande"}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </article>
              ))}
            </section>
          )}

          {completedQuests.length > 0 && (
            <section className="quest-log-section">
              <h2>Slutförda</h2>
              {completedQuests.map((quest) => (
                <article
                  className="quest-log-entry quest-log-entry--completed"
                  key={quest.id}
                >
                  <h3>{quest.title}</h3>
                  <p>{quest.completedText}</p>
                  <p className="quest-log-status">Slutfört</p>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default QuestLog;
