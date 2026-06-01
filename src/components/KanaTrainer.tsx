import { RotateCcw } from "lucide-react";
import { Button } from "@hexnest/ui";
import { useMemo, useState } from "react";
import { kanaByScript } from "../domain/kana";
import type { AyaCue, ScriptKind } from "../domain/types";
import { isAnswerCorrect } from "../services/answer";

interface KanaTrainerProps {
  onCue: (cue: AyaCue) => void;
}

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function KanaTrainer({ onCue }: KanaTrainerProps) {
  const [script, setScript] = useState<ScriptKind>("hiragana");
  const symbols = useMemo(() => kanaByScript(script), [script]);
  const [index, setIndex] = useState(() => randomIndex(symbols.length));
  const [input, setInput] = useState("");
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);

  const current = symbols[index] ?? symbols[0];

  function nextCard(): void {
    setIndex(randomIndex(symbols.length));
    setInput("");
    setLastResult(null);
    onCue({ mood: "thinking", bubble: "Read the kana first. Then type the romaji cleanly." });
  }

  function switchScript(next: ScriptKind): void {
    setScript(next);
    const nextSymbols = kanaByScript(next);
    setIndex(randomIndex(nextSymbols.length));
    setInput("");
    setLastResult(null);
    onCue({ mood: "idle", bubble: next === "hiragana" ? "Hiragana mode. Basic foundation first." : "Katakana mode. Same romaji discipline." });
  }

  function submit(): void {
    const ok = isAnswerCorrect(input, current.romaji);
    setLastResult(ok ? "correct" : "wrong");
    if (ok) {
      onCue({ mood: "success", bubble: `Correct. ${current.kana} is ${current.romaji}.` });
      window.setTimeout(nextCard, 550);
      return;
    }
    onCue({ mood: "wrong", bubble: `Not this one. Look at ${current.kana} again and try the romaji.` });
  }

  return (
    <section className="work-panel kana-trainer">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Kana Console</p>
          <h2>Romaji Drill</h2>
        </div>
        <div className="segmented">
          <button type="button" className={script === "hiragana" ? "active" : ""} onClick={() => switchScript("hiragana")}>
            Hiragana
          </button>
          <button type="button" className={script === "katakana" ? "active" : ""} onClick={() => switchScript("katakana")}>
            Katakana
          </button>
        </div>
      </div>

      <div className="kana-stage">
        <div className="kana-symbol">{current.kana}</div>
        <div className="kana-meta">
          <span>{script}</span>
          <span>row {current.row}</span>
        </div>
      </div>

      <form
        className="answer-row"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="type romaji"
          autoComplete="off"
          aria-label="Romaji answer"
        />
        <Button type="submit">Check</Button>
        <Button type="button" variant="ghost" onClick={nextCard} aria-label="Next kana">
          <RotateCcw size={16} />
        </Button>
      </form>

      {lastResult ? (
        <p className={lastResult === "correct" ? "result result-good" : "result result-bad"}>
          {lastResult === "correct" ? "Correct" : `Expected: ${current.romaji}`}
        </p>
      ) : null}
    </section>
  );
}

