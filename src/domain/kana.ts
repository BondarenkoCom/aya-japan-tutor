import type { KanaSymbol, ScriptKind } from "./types";

const ROWS = [
  ["vowels", [["あ", "ア", "a"], ["い", "イ", "i"], ["う", "ウ", "u"], ["え", "エ", "e"], ["お", "オ", "o"]]],
  ["k", [["か", "カ", "ka"], ["き", "キ", "ki"], ["く", "ク", "ku"], ["け", "ケ", "ke"], ["こ", "コ", "ko"]]],
  ["s", [["さ", "サ", "sa"], ["し", "シ", "shi"], ["す", "ス", "su"], ["せ", "セ", "se"], ["そ", "ソ", "so"]]],
  ["t", [["た", "タ", "ta"], ["ち", "チ", "chi"], ["つ", "ツ", "tsu"], ["て", "テ", "te"], ["と", "ト", "to"]]],
  ["n", [["な", "ナ", "na"], ["に", "ニ", "ni"], ["ぬ", "ヌ", "nu"], ["ね", "ネ", "ne"], ["の", "ノ", "no"]]],
  ["h", [["は", "ハ", "ha"], ["ひ", "ヒ", "hi"], ["ふ", "フ", "fu"], ["へ", "ヘ", "he"], ["ほ", "ホ", "ho"]]],
  ["m", [["ま", "マ", "ma"], ["み", "ミ", "mi"], ["む", "ム", "mu"], ["め", "メ", "me"], ["も", "モ", "mo"]]],
  ["y", [["や", "ヤ", "ya"], ["ゆ", "ユ", "yu"], ["よ", "ヨ", "yo"]]],
  ["r", [["ら", "ラ", "ra"], ["り", "リ", "ri"], ["る", "ル", "ru"], ["れ", "レ", "re"], ["ろ", "ロ", "ro"]]],
  ["w", [["わ", "ワ", "wa"], ["を", "ヲ", "wo"], ["ん", "ン", "n"]]]
] as const;

function buildSymbols(script: ScriptKind): KanaSymbol[] {
  return ROWS.flatMap(([row, items]) =>
    items.map(([hiragana, katakana, romaji], index) => {
      const kana = script === "hiragana" ? hiragana : katakana;
      return {
        id: `${script}-${romaji}`,
        script,
        kana,
        romaji,
        row,
        column: String(index)
      };
    })
  );
}

export const HIRAGANA = buildSymbols("hiragana");
export const KATAKANA = buildSymbols("katakana");
export const KANA = [...HIRAGANA, ...KATAKANA];

export function kanaByScript(script: ScriptKind): KanaSymbol[] {
  return script === "hiragana" ? HIRAGANA : KATAKANA;
}

