import { Button } from "@hexnest/ui";
import { useMemo, useState } from "react";
import type { AyaCue, StudyCard } from "../domain/types";
import { isAnswerCorrect } from "../services/answer";
import { db } from "../storage/db";
import { createInitialReview, nextReviewState } from "../services/review";

interface FlashcardTrainerProps {
  cards: StudyCard[];
  onCue: (cue: AyaCue) => void;
}

export function FlashcardTrainer({ cards, onCue }: FlashcardTrainerProps) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const current = cards[index % Math.max(cards.length, 1)];
  const progress = useMemo(() => (cards.length === 0 ? "0 / 0" : `${Math.min(index + 1, cards.length)} / ${cards.length}`), [cards.length, index]);

  function next(): void {
    setIndex((value) => (cards.length === 0 ? 0 : (value + 1) % cards.length));
    setAnswer("");
    setRevealed(false);
  }

  async function grade(correct: boolean): Promise<void> {
    if (!current) return;
    const existing = await db.reviews.get(current.id);
    const nextState = nextReviewState(existing ?? createInitialReview(current.id), correct);
    await db.reviews.put(nextState);
    onCue(
      correct
        ? { mood: "success", bubble: "Good. That card moves forward in the review queue." }
        : { mood: "wrong", bubble: current.hint ? `Missed it. Hint: ${current.hint}` : "Missed it. Slow down and read the prompt again." }
    );
    next();
  }

  async function submit(): Promise<void> {
    if (!current) return;
    const ok = isAnswerCorrect(answer, current.answer);
    setRevealed(true);
    await grade(ok);
  }

  return (
    <section className="work-panel flashcard-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Flashcards</p>
          <h2>Romaji Recall</h2>
        </div>
        <span className="counter">{progress}</span>
      </div>

      {!current ? (
        <p className="muted">Import a lesson to generate cards.</p>
      ) : (
        <>
          <div className="flashcard">
            <p>{current.prompt}</p>
            {revealed ? <strong>{current.displayAnswer}</strong> : null}
          </div>
          <form
            className="answer-row"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="type romaji" autoComplete="off" />
            <Button type="submit">Answer</Button>
            <Button type="button" variant="ghost" onClick={() => setRevealed((value) => !value)}>
              Show
            </Button>
          </form>
        </>
      )}
    </section>
  );
}

