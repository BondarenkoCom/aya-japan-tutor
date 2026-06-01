import { Clipboard, FileJson, Save } from "lucide-react";
import { Button } from "@hexnest/ui";
import { useMemo, useState } from "react";
import type { AyaCue, LessonRecord } from "../domain/types";
import { sampleLessonJson } from "../domain/sampleLesson";
import { buildStudyCards, parseLessonJson } from "../services/importer";
import { saveLessonWithCards } from "../storage/db";

interface LessonImporterProps {
  onImported: (lesson: LessonRecord) => void;
  onCue: (cue: AyaCue) => void;
}

export function LessonImporter({ onImported, onCue }: LessonImporterProps) {
  const [raw, setRaw] = useState(() => JSON.stringify(sampleLessonJson, null, 2));
  const [preview, setPreview] = useState<LessonRecord | null>(null);
  const [error, setError] = useState("");
  const cardsCount = useMemo(() => (preview ? buildStudyCards(preview).length : 0), [preview]);

  function parsePreview(): void {
    try {
      const parsed = parseLessonJson(raw);
      setPreview(parsed);
      setError("");
      onCue({ mood: "thinking", bubble: `Parsed "${parsed.title}". Check it before saving.` });
    } catch (err) {
      setPreview(null);
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setError(message);
      onCue({ mood: "wrong", bubble: "The JSON does not match a lesson shape yet. Fix it or paste a cleaner export." });
    }
  }

  async function savePreview(): Promise<void> {
    let lesson = preview;
    if (!lesson) {
      try {
        lesson = parseLessonJson(raw);
        setPreview(lesson);
        setError("");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid JSON";
        setError(message);
        onCue({ mood: "wrong", bubble: "The JSON does not match a lesson shape yet. Fix it before saving." });
        return;
      }
    }
    const saved = await saveLessonWithCards(lesson);
    onImported(saved.lesson);
    onCue({ mood: "saved", bubble: `Saved ${saved.cards.length} study cards from this lesson.` });
  }

  async function loadFile(file: File | null): Promise<void> {
    if (!file) return;
    const text = await file.text();
    setRaw(text);
    setPreview(null);
    setError("");
    onCue({ mood: "thinking", bubble: "File loaded. Run preview before saving it." });
  }

  return (
    <section className="work-panel importer-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Lesson Intake</p>
          <h2>Paste Gemini / Grok JSON</h2>
        </div>
        <label className="file-button">
          <FileJson size={16} />
          <span>JSON</span>
          <input type="file" accept=".json,application/json,text/plain" onChange={(event) => void loadFile(event.target.files?.[0] ?? null)} />
        </label>
      </div>

      <textarea
        value={raw}
        onChange={(event) => {
          setRaw(event.target.value);
          setPreview(null);
        }}
        spellCheck={false}
        className="json-editor"
        aria-label="Lesson JSON"
      />

      <div className="actions-row">
        <Button type="button" variant="ghost" onClick={() => void navigator.clipboard.writeText(JSON.stringify(sampleLessonJson, null, 2))}>
          <Clipboard size={16} />
          Copy Sample
        </Button>
        <Button type="button" variant="ghost" onClick={parsePreview}>
          Preview
        </Button>
        <Button type="button" onClick={() => void savePreview()}>
          <Save size={16} />
          Save Lesson
        </Button>
      </div>

      {error ? <p className="import-error">{error}</p> : null}

      {preview ? (
        <div className="import-preview">
          <h3>{preview.title}</h3>
          <p>{preview.summary}</p>
          <div className="preview-grid">
            <span>{preview.theory.length} theory</span>
            <span>{preview.vocabulary.length} vocab</span>
            <span>{preview.examples.length} examples</span>
            <span>{cardsCount} cards</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
