# YouTube Gemini Lesson Extraction Prompt

Use this in YouTube's **Ask about this video** / Gemini panel.

It is tuned for Aya Japan Tutor:

- output is strict JSON
- explanations are in Russian
- answers are in romaji
- kana/kanji from the lesson are preserved
- the app can import the result directly

## Prompt

```text
You are extracting one Japanese lesson from the current YouTube video for a local study app called Aya Japan Tutor.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in triple backticks.
Do not include comments.
Do not include any text before or after the JSON.

Goal:
Create a compact but useful study dataset for a beginner learner who cannot type Japanese yet and answers in romaji.

Language rules:
- Keep Japanese words/sentences in kana/kanji exactly when they appear in the lesson.
- Always include romaji for every Japanese word or sentence.
- Write "meaning", "summary", "body", "hint", and "note" in Russian.
- Quiz answers must be romaji only.
- If the video is unclear, use an empty string for that field or add "uncertain" in the note. Do not invent content.

Extract only material taught in this video:
- core theory and grammar points
- vocabulary
- example sentences
- mistakes or usage warnings from the teacher
- small quiz questions for romaji practice

Return this exact JSON shape:
{
  "title": "short lesson title",
  "source": {
    "type": "youtube",
    "title": "video title if known",
    "url": ""
  },
  "teacher": "teacher/channel name if known",
  "level": "absolute-beginner",
  "summary": "1-3 Russian sentences explaining what the lesson teaches",
  "theory": [
    {
      "heading": "short Russian heading",
      "body": "clear Russian explanation of the rule, usage, or warning"
    }
  ],
  "vocabulary": [
    {
      "kana": "これ",
      "kanji": "",
      "romaji": "kore",
      "meaning": "это; предмет рядом с говорящим",
      "note": "Russian usage note if useful"
    }
  ],
  "examples": [
    {
      "japanese": "これはペンです",
      "romaji": "kore wa pen desu",
      "meaning": "Это ручка.",
      "note": "Russian note about grammar or context"
    }
  ],
  "quiz": [
    {
      "prompt": "Type romaji for これ",
      "answer": "kore",
      "hint": "Рядом с говорящим."
    }
  ],
  "tags": ["youtube", "absolute-beginner", "romaji"]
}

Quantity targets:
- theory: 3-8 items
- vocabulary: 8-30 items, if the lesson has enough words
- examples: 5-20 items, if the lesson has enough examples
- quiz: 10-25 items

Quiz design:
- Prefer prompts like "Type romaji for これ" or "Type romaji: これはペンです".
- The "answer" field must contain only the expected romaji.
- Make quiz items from real lesson content, not generic filler.

Before returning, self-check:
- Is the output parseable JSON?
- Are all keys double-quoted?
- Are there no trailing commas?
- Are all quiz answers romaji?
- Are Russian explanation fields useful for a beginner?
```

## If Gemini Adds Extra Text

Ask this follow-up:

```text
Now return the same result again as raw valid JSON only. No markdown, no explanation, no code fence.
```

