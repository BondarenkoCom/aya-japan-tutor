import type { LessonRecord } from "../domain/types";

interface TheoryPanelProps {
  lesson?: LessonRecord;
}

export function TheoryPanel({ lesson }: TheoryPanelProps) {
  return (
    <section className="work-panel theory-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Theory</p>
          <h2>{lesson?.title ?? "No lesson selected"}</h2>
        </div>
      </div>

      {!lesson ? (
        <p className="muted">Import or select a lesson.</p>
      ) : (
        <div className="theory-stack">
          <p className="summary-text">{lesson.summary}</p>
          {lesson.theory.map((block) => (
            <article key={block.id} className="theory-block">
              <h3>{block.heading}</h3>
              <p>{block.body}</p>
            </article>
          ))}
          {lesson.vocabulary.length > 0 ? (
            <div className="vocab-table">
              {lesson.vocabulary.map((item) => (
                <div key={item.id} className="vocab-row">
                  <span>{item.kana || item.kanji || "-"}</span>
                  <strong>{item.romaji}</strong>
                  <span>{item.meaning}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

