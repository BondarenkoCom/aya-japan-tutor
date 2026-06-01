import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, Database, FileInput, GraduationCap, PanelsTopLeft } from "lucide-react";
import { Button } from "@hexnest/ui";
import { AyaGuide } from "./components/AyaGuide";
import { KanaTrainer } from "./components/KanaTrainer";
import { LessonImporter } from "./components/LessonImporter";
import { LessonLibrary } from "./components/LessonLibrary";
import { TheoryPanel } from "./components/TheoryPanel";
import { FlashcardTrainer } from "./components/FlashcardTrainer";
import { QuizPanel } from "./components/QuizPanel";
import { DataPort } from "./components/DataPort";
import type { AyaCue, LessonRecord, StudyCard } from "./domain/types";
import { db, deleteLessonCascade } from "./storage/db";

type ViewKey = "study" | "import" | "theory" | "data";

const DEFAULT_CUE: AyaCue = {
  mood: "idle",
  bubble: "Paste a lesson JSON, then I will turn it into practice. Romaji first. Kana discipline next."
};

const VIEWS: Array<{ key: ViewKey; label: string; icon: ReactNode }> = [
  { key: "study", label: "Study", icon: <GraduationCap size={17} /> },
  { key: "import", label: "Import", icon: <FileInput size={17} /> },
  { key: "theory", label: "Theory", icon: <BookOpen size={17} /> },
  { key: "data", label: "Data", icon: <Database size={17} /> }
];

export default function App() {
  const [view, setView] = useState<ViewKey>("study");
  const [cue, setCue] = useState<AyaCue>(DEFAULT_CUE);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>();
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [loading, setLoading] = useState(true);

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0],
    [activeLessonId, lessons]
  );

  const loadLessons = useCallback(async () => {
    const next = await db.lessons.orderBy("updatedAt").reverse().toArray();
    setLessons(next);
    setActiveLessonId((current) => current ?? next[0]?.id);
  }, []);

  const loadCards = useCallback(async (lessonId?: string) => {
    if (!lessonId) {
      setCards([]);
      return;
    }
    const next = await db.cards.where("lessonId").equals(lessonId).toArray();
    setCards(next);
  }, []);

  useEffect(() => {
    void loadLessons().finally(() => setLoading(false));
  }, [loadLessons]);

  useEffect(() => {
    void loadCards(activeLesson?.id);
  }, [activeLesson?.id, loadCards]);

  async function handleImported(lesson: LessonRecord): Promise<void> {
    await loadLessons();
    setActiveLessonId(lesson.id);
    setView("study");
  }

  async function handleDelete(lessonId: string): Promise<void> {
    const target = lessons.find((lesson) => lesson.id === lessonId);
    if (!target) return;
    if (!confirm(`Delete lesson "${target.title}"?`)) return;
    await deleteLessonCascade(lessonId);
    await loadLessons();
    if (activeLessonId === lessonId) {
      setActiveLessonId(undefined);
    }
    setCue({ mood: "warning", bubble: "Lesson removed from local storage." });
  }

  const totalCards = cards.length;
  const totalTheory = activeLesson?.theory.length ?? 0;
  const totalVocab = activeLesson?.vocabulary.length ?? 0;

  return (
    <main className="app-shell hxn-theme">
      <header className="topbar">
        <div className="brand-block">
          <img src="/assets/AyaFavicon.png" alt="" width="42" height="42" />
          <div>
            <p className="eyebrow">Aya Japan Tutor</p>
            <h1>Romaji-first Japanese lab</h1>
          </div>
        </div>
        <nav className="view-tabs" aria-label="App sections">
          {VIEWS.map((item) => (
            <button key={item.key} type="button" className={view === item.key ? "active" : ""} onClick={() => setView(item.key)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <section className="app-grid">
        <aside className="left-rail">
          <section className="status-strip">
            <div>
              <span>{lessons.length}</span>
              <p>lessons</p>
            </div>
            <div>
              <span>{totalCards}</span>
              <p>cards</p>
            </div>
            <div>
              <span>{totalVocab}</span>
              <p>vocab</p>
            </div>
          </section>

          <LessonLibrary
            lessons={lessons}
            activeLessonId={activeLesson?.id}
            onSelect={(lesson) => {
              setActiveLessonId(lesson.id);
              setCue({ mood: "idle", bubble: `Loaded "${lesson.title}". Pick a drill and start.` });
            }}
            onDelete={(lessonId) => void handleDelete(lessonId)}
          />

          <section className="work-panel active-lesson-card">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Current</p>
                <h2>{activeLesson?.title ?? "No lesson"}</h2>
              </div>
              <PanelsTopLeft size={18} />
            </div>
            <p className="muted">{activeLesson?.summary ?? "Import a JSON lesson to create a study set."}</p>
            <div className="mini-metrics">
              <span>{totalTheory} notes</span>
              <span>{activeLesson?.examples.length ?? 0} examples</span>
              <span>{totalCards} cards</span>
            </div>
          </section>
        </aside>

        <section className="main-workspace">
          {loading ? (
            <section className="work-panel loading-panel">
              <p className="eyebrow">Loading</p>
              <h2>Opening local study database</h2>
            </section>
          ) : null}

          {view === "study" ? (
            <div className="workspace-stack">
              <KanaTrainer onCue={setCue} />
              <div className="two-column">
                <FlashcardTrainer cards={cards} onCue={setCue} />
                <QuizPanel cards={cards} onCue={setCue} />
              </div>
            </div>
          ) : null}

          {view === "import" ? <LessonImporter onImported={(lesson) => void handleImported(lesson)} onCue={setCue} /> : null}

          {view === "theory" ? <TheoryPanel lesson={activeLesson} /> : null}

          {view === "data" ? <DataPort onCue={setCue} /> : null}
        </section>

        <AyaGuide cue={cue} />
      </section>

      <Button type="button" className="mobile-aya-button" onClick={() => setCue(DEFAULT_CUE)}>
        Aya
      </Button>
    </main>
  );
}
