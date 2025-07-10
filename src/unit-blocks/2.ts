const level2VocabBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  { type: "vocabulary", block: ["これ", "それ", "あれ"] },
  { type: "vocabulary", block: ["この", "その", "あの"] },
  { type: "vocabulary", block: ["ほん", "じしょ", "ざっし", "しんぶん"] },
  { type: "vocabulary", block: ["ノート", "てちょう", "めいし", "カード"] },
  { type: "vocabulary", block: ["えんぴつ", "ボールペン", "シャープペンシル"] },
  { type: "vocabulary", block: ["かぎ", "とけい", "かさ", "かばん"] },
  {
    type: "vocabulary",
    block: ["テレビ", "ラジオ", "カメラ", "コンピューター"],
  },
  {
    type: "vocabulary",
    block: ["CD", "くるま", "つくえ", "いす"],
  },
  {
    type: "vocabulary",
    block: ["チョコレート", "チョコレート", "チョコレート"],
  },
  {
    type: "vocabulary",
    block: ["えいご", "にほんご", "インドネシアご"],
  },
  {
    type: "vocabulary",
    block: ["なん", "そう"],
  },
];

const level2GrammarBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  {
    type: "grammar",
    block: [
      "これ は つくえ です",
      "これ は しんぶん です",
      "これ は めいし です",
      "これ は なん ですか",
    ],
  },
  {
    type: "grammar",
    block: ["それ は ボールペン ですか, シャープペンシル ですか"],
  },
  {
    type: "grammar",
    block: [
      "これ は くるま の ほん です",
      "これ は コンピューター の ほん です",
      "これ は にほんご の ほん です",
      "これ は なん の ほん ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "あれ は わたし の かばん です",
      "あれ は さとうさん の かばん です",
      "あれ は せんせい の かばん です",
      "あれ は だれ の かばん ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "あれ は わたし の です",
      "あれ は さとうさん の です",
      "あれ は せんせい の です",
      "あれ は だれ の ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "この てちょう は わたし の です",
      "この かぎ は わたし の です",
      "この かばん は わたし の です",
    ],
  },
];

const level2Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...level2VocabBlocks, ...level2GrammarBlocks];

export default level2Block;
