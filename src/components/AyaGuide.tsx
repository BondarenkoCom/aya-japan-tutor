import type { AyaCue, AyaMood } from "../domain/types";

const SPRITE_BY_MOOD: Record<AyaMood, string> = {
  idle: "smile",
  thinking: "thinking",
  success: "happy",
  wrong: "frustrated",
  saved: "love_shy",
  warning: "smirk"
};

interface AyaGuideProps {
  cue: AyaCue;
  compact?: boolean;
}

export function AyaGuide({ cue, compact = false }: AyaGuideProps) {
  const sprite = SPRITE_BY_MOOD[cue.mood] ?? "smile";
  return (
    <aside className={compact ? "aya-guide aya-guide-compact" : "aya-guide"} aria-live="polite">
      <div className="aya-comic-bubble">
        <p>{cue.bubble}</p>
      </div>
      <div className="aya-portrait-wrap">
        <img
          src={`/assets/aya/${sprite}.webp`}
          alt="Aya tutor"
          width="832"
          height="1248"
          decoding="async"
          className="aya-portrait"
        />
      </div>
      <p className="aya-brand">Powered by HexNest</p>
    </aside>
  );
}

