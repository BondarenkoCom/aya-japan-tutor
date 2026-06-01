# Aya Japan Tutor

HexNest-powered local-first Japanese study app with Aya as an interactive tutor.

The app is designed for the early stage where you watch Japanese lessons, ask Gemini or Grok to turn lesson content into JSON, paste that JSON into the app, and then practice with kana, romaji, flashcards, quizzes, and theory notes.

## Core Idea

- Type answers in romaji while learning kana.
- Import simple Gemini tables or lesson JSON from Gemini, Grok, or handwritten notes.
- Copy the YouTube Gemini extraction prompt from the Import screen or from `docs/LESSON_EXTRACTION_PROMPT.md`.
- Save lessons and study progress locally in IndexedDB.
- Let Aya react to correct and wrong answers with sprites and comic-style bubbles.
- Keep the app usable without any backend or API key.

## Local Run

```powershell
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5179
```

## Checks

```powershell
npm run typecheck
npm test
npm run build
```

## AI Keys

Do not commit real API keys.

Future Grok/xAI support should run through a backend endpoint that reads `XAI_API_KEY` from `.env`. Browser code must never receive the key.

## Project Brief

See [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md).

## License

MIT
