const level5VocabBlocks: Array<{
  type: "vocabulary";
  block: Array<string>;
}> = [
  {
    type: "vocabulary",
    block: [
      "おきます",
      "ねます",
      "はたらきます",
      "やすみます",
      "べんきょうします",
      "おわります",
    ],
  },
  {
    type: "vocabulary",
    block: [
      "でぱーと",
      "ぎんこう",
      "ゆうびんきょく",
      "としょかん",
      "びじゅつかん",
    ],
  },
  {
    type: "vocabulary",
    block: ["いま", "はん", "なんじ", "なんぷん"],
  },
  {
    type: "vocabulary",
    block: ["ごぜん", "ごご", "あさ", "ひる", "ばん"],
  },
  {
    type: "vocabulary",
    block: ["おととい", "きのう", "きょう", "あした", "あさって"],
  },
  {
    type: "vocabulary",
    block: ["けさ", "こんばん", "やすみ", "ひるやすみ"],
  },
  {
    type: "vocabulary",
    block: ["しけん", "かいぎ", "えいが"],
  },
  {
    type: "vocabulary",
    block: ["まいあさ", "まいばん", "まいにち"],
  },
  {
    type: "vocabulary",
    block: ["げつようび", "かようび", "すいようび", "もくようび"],
  },
  {
    type: "vocabulary",
    block: ["きんようび", "どようび", "にちようび", "なんようび"],
  },
  {
    type: "vocabulary",
    block: ["から", "まで", "と"],
  },
];

const level5GrammarBlocks: Array<{
  type: "grammar";
  block: Array<string>;
}> = [
  {
    type: "grammar",
    block: ["いま 4じ5ふん です", "いま 9じはん です", "いま なんじ ですか"],
  },
  {
    type: "grammar",
    block: [
      "やすみ は すいようび です",
      "やすみ は どようび と にちようび です",
      "やすみ は なんようび ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "ひるやすみ は １２じ から １じ まで です",
      "ひるやすみ は １２じはん から １じ１５ふん まで です",
      "ひるやすみ は なんじ から なんじ まで ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "わたし は まいあさ ６じ に おきます",
      "わたし は まいあさ ７じはん に おきます",
      "あなた は まいあさ なんじ に おきます か",
    ],
  },
  {
    type: "grammar",
    block: [
      "わたし は ９じ から ５じ まで はたらきます",
      "わたし は げつようび から きんようび まで はたらきます",
    ],
  },
];

const level5Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...level5VocabBlocks, ...level5GrammarBlocks];

export default level5Block;
