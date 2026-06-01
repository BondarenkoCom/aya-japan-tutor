import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@hexnest/ui";
import { useMemo, useState } from "react";
import type { AyaCue, StudyCard } from "../domain/types";
import { isAnswerCorrect } from "../services/answer";

interface QuizPanelProps {
  cards: StudyCard[];
  onCue: (cue: AyaCue) => void;
}

interface QuizResult {
  cardId: string;
  correct: boolean;
  expected: string;
}

export function QuizPanel({ cards, onCue }: QuizPanelProps) {
  const quizCards = useMemo(() => cards.slice(0, 10), [cards]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[]>([]);

  function scoreQuiz(): void {
    const next = quizCards.map((card) => ({
      cardId: card.id,
      correct: isAnswerCorrect(answers[card.id] ?? "", card.answer),
      expected: card.answer
    }));
    setResults(next);
    const score = next.filter((item) => item.correct).length;
    onCue(
      score === next.length
        ? { mood: "success", bubble: "Clean run. Aya approves." }
        : { mood: "wrong", bubble: `${score}/${next.length}. The weak cards are the actual study target.` }
    );
  }

  function reset(): void {
    setAnswers({});
    setResults([]);
    onCue({ mood: "thinking", bubble: "Fresh quiz. No guessing. Read, map, answer." });
  }

  return (
    <section className="work-panel quiz-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Check</p>
          <h2>Quick Quiz</h2>
        </div>
        <span className="counter">{quizCards.length}</span>
      </div>

      {quizCards.length === 0 ? (
        <p className="muted">No cards available.</p>
      ) : (
        <div className="quiz-stack">
          {quizCards.map((card) => {
            const result = results.find((item) => item.cardId === card.id);
            return (
              <label key={card.id} className={result?.correct ? "quiz-row correct" : result ? "quiz-row wrong" : "quiz-row"}>
                <span>{card.prompt}</span>
                <input
                  value={answers[card.id] ?? ""}
                  onChange={(event) => setAnswers((current) => ({ ...current, [card.id]: event.target.value }))}
                  placeholder="romaji"
                />
                {result ? (
                  <span className="quiz-mark">
                    {result.correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                    {result.correct ? "ok" : result.expected}
                  </span>
                ) : null}
              </label>
            );
          })}
          <div className="actions-row">
            <Button type="button" onClick={scoreQuiz}>Score Quiz</Button>
            <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
          </div>
        </div>
      )}
    </section>
  );
}

