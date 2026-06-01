import { Trash2 } from "lucide-react";
import { Button } from "@hexnest/ui";
import type { LessonRecord } from "../domain/types";

interface LessonLibraryProps {
  lessons: LessonRecord[];
  activeLessonId?: string;
  onSelect: (lesson: LessonRecord) => void;
  onDelete: (lessonId: string) => void;
}

export function LessonLibrary({ lessons, activeLessonId, onSelect, onDelete }: LessonLibraryProps) {
  return (
    <section className="work-panel lesson-library">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Saved Lessons</p>
          <h2>Library</h2>
        </div>
        <span className="counter">{lessons.length}</span>
      </div>

      <div className="lesson-list">
        {lessons.length === 0 ? (
          <p className="muted">No saved lessons yet.</p>
        ) : (
          lessons.map((lesson) => (
            <article key={lesson.id} className={lesson.id === activeLessonId ? "lesson-item active" : "lesson-item"}>
              <button type="button" onClick={() => onSelect(lesson)}>
                <strong>{lesson.title}</strong>
                <span>{lesson.level}</span>
              </button>
              <Button type="button" variant="ghost" onClick={() => onDelete(lesson.id)} aria-label={`Delete ${lesson.title}`}>
                <Trash2 size={15} />
              </Button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

