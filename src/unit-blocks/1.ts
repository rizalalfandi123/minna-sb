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
      "ワンさん は いしゃ です",
    ],
  },
  {
    type: "grammar",
    block: [
      "わたし は カール シュミット じゃ ありません",
      "わたし は きょうし じゃ ありません",
      "イーさん は アメリカじん じゃ ありません",
      "イーさん は がくせい じゃ ありません",
    ],
  },
  {
    type: "grammar",
    block: [
      "あの ひと は きむらさん ですか",
      "あの ひと は マリアさん ですか",
      "あの ひと は だれ ですか",
    ],
  },
];

const level1Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...level1VocabBlocks, ...level1GrammarBlocks];

export default level1Block;
