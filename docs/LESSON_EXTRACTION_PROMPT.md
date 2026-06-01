# YouTube Gemini Lesson Extraction Prompt

YouTube Gemini currently handles small table prompts more reliably than strict JSON prompts.

Use this first. Aya Japan Tutor can paste-import the result directly.

## Vocabulary Prompt

```text
From this video, extract Japanese study items.

Format exactly:
Japanese | Romaji | English

Max 20 rows.
No intro.
No explanation.
```

Expected output:

```text
kore-item | kore | this
sore-item | sore | that
```

The first column can contain kana, kanji, or a Japanese sentence from the video.

## Optional Theory Prompt

Use this as a separate follow-up when vocabulary extraction works.

```text
From this video, extract 5 short grammar or usage notes.

Format exactly:
Title | Explanation

Use English only.
No intro.
No explanation outside the table.
```

## Optional Quiz Prompt

Use this as another follow-up.

```text
From this video, create 8 quiz questions.

Format exactly:
Prompt | Answer | Hint

Answers must be romaji only.
Use English prompts or Japanese prompts.
No intro.
No explanation outside the table.
```

## Current Import Support

The app currently supports direct import for:

```text
Japanese | Romaji | English
```

It converts rows into:

- vocabulary records
- Japanese -> romaji cards
- English -> romaji quiz cards

Strict JSON import is still supported as an advanced fallback.
