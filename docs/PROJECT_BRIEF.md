# Aya Japan Tutor

Aya Japan Tutor is a HexNest-powered, local-first web app for learning beginner Japanese from real lesson material.

The first user flow is intentionally simple:

1. Watch a Japanese lesson on YouTube.
2. Ask Gemini, Grok, or another assistant to convert the lesson into structured JSON.
3. Paste that JSON into Aya Japan Tutor.
4. Save it locally.
5. Practice kana, romaji answers, flashcards, quizzes, and lesson notes in the browser.

## Product Intent

The app is built for a learner who does not yet have a Japanese keyboard layout and wants to answer in romaji first.

Core behavior:

- Kana appears on screen.
- The learner types romaji.
- Correct answers make Aya react positively.
- Wrong answers make Aya look sad or frustrated and show a short bubble hint.
- Lesson JSON becomes theory notes, examples, flashcards, and quizzes.
- Progress stays local by default.

## Name

Working name: **Aya Japan Tutor**

Repository slug: `aya-japan-tutor`

Brand line: `Powered by HexNest`

## Non-Goals For The First Version

- No public accounts.
- No paid subscriptions.
- No automatic YouTube scraping.
- No API key stored in frontend code.
- No requirement to type kana directly.
- No server requirement for the base learning loop.

## Architecture

```text
Browser app
  -> React + Vite + TypeScript
  -> HexNest UI style and Aya assets
  -> IndexedDB local database
  -> JSON import pipeline
  -> kana trainer / flashcards / quiz / theory notes

Optional later backend
  -> /api/ai/import
  -> reads XAI_API_KEY from server-side .env
  -> calls Grok/xAI
  -> returns validated lesson JSON
```

## Local Data Model

```text
Lesson
  id
  title
  source
  teacher
  level
  summary
  theoryBlocks
  examples
  vocabulary
  createdAt
  updatedAt

StudyCard
  id
  lessonId
  kind
  prompt
  answer
  romaji
  hint
  tags

ReviewState
  cardId
  dueAt
  intervalDays
  ease
  correctStreak
  mistakes

QuizAttempt
  id
  mode
  score
  total
  wrongCardIds
  createdAt
```

## Import Contract

The importer should accept strict app-native JSON and tolerate common LLM-shaped JSON.

Preferred shape:

```json
{
  "title": "Lesson 3 - Kore, Sore, Are",
  "source": {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=..."
  },
  "level": "absolute-beginner",
  "summary": "Demonstratives for this, that, and that over there.",
  "theory": [
    {
      "heading": "Kore / Sore / Are",
      "body": "Use kore for something near the speaker..."
    }
  ],
  "examples": [
    {
      "japanese": "これはペンです",
      "romaji": "kore wa pen desu",
      "meaning": "This is a pen."
    }
  ],
  "vocabulary": [
    {
      "kana": "これ",
      "romaji": "kore",
      "meaning": "this"
    }
  ],
  "quiz": [
    {
      "prompt": "Type romaji for これ",
      "answer": "kore",
      "hint": "This, near the speaker."
    }
  ]
}
```

## AI Policy

The first release does not need an LLM to function.

When AI is added:

- API keys stay only in `.env`.
- `.env` stays ignored by git.
- frontend calls only the local backend.
- AI output is parsed, validated, and previewed before saving.
- user can edit imported data before committing it to the local database.

## First MVP

- Project description and README.
- React app shell.
- Aya companion panel with bubble reactions.
- Kana board with romaji input.
- Lesson JSON importer with validation.
- IndexedDB persistence.
- Lesson list and theory view.
- Flashcard trainer.
- Quiz mode.
- Import/export local data.
- Build and unit tests.

