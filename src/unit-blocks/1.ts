const level1VocabBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  { type: "vocabulary", block: ["わたし", "あなた", "ひと"] },
  {
    type: "vocabulary",
    block: ["せんせい", "がくせい", "かいしゃいん", "いしゃ"],
  },
  { type: "vocabulary", block: ["きょうし", "ぎんこういん", "けんきゅうしゃ"] },
  { type: "vocabulary", block: ["だいがく", "びょういん"] },
  { type: "vocabulary", block: ["だれ", "さい", "はい", "いいえ"] },
  { type: "vocabulary", block: ["タイ", "ちゅうごく", "ドイツ", "にほん"] },
  { type: "vocabulary", block: ["アメリカ", "イギリス", "インド"] },
  { type: "vocabulary", block: ["ブラジル", "インドネシア", "かんこく"] },
];

const level1GrammarBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  {
    type: "grammar",
    block: [
      "わたし は マイクミラー です",
      "わたし は かいしゃいん です",
      "ワンさん は ちゅうごくじん です",
      "ワンさん は いしゃ です"
    ],
  },
];

const level1Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...level1VocabBlocks, ...level1GrammarBlocks];

export default level1Block;
