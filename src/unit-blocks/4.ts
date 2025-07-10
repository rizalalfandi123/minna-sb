const level4VocabBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  {
    type: "vocabulary",
    block: ["ゼロ", "いち", "に", "さん", "よん", "ご"],
  },
  {
    type: "vocabulary",
    block: ["れい", "し", "ろく", "なな", "はち"],
  },
  {
    type: "vocabulary",
    block: ["しち", "く", "じゅう", "じゅういち", "じゅうに"],
  },
  {
    type: "vocabulary",
    block: ["じゅうさん", "じゅうよん", "じゅうご", "じゅうろく", "じゅうなな"],
  },
  {
    type: "vocabulary",
    block: [
      "じゅうはち",
      "じゅうきゅう",
      "にじゅう",
      "さんじゅう",
      "よんじゅう",
    ],
  },
  {
    type: "vocabulary",
    block: [
      "ごじゅう",
      "ろくじゅう",
      "ななじゅう",
      "はちじゅう",
      "きゅうじゅう",
    ],
  },
  {
    type: "vocabulary",
    block: ["ひゃく", "にひゃく", "さんびゃく", "よんひゃく", "ごひゃく"],
  },
  {
    type: "vocabulary",
    block: ["ろっぴゃく", "ななひゃく", "はっぴゃく", "きゅうひゃく"],
  },
  {
    type: "vocabulary",
    block: ["せん", "にせん", "さんぜん", "よんせん", "ごせん"],
  },
  {
    type: "vocabulary",
    block: ["ろくせん", "ななせん", "はっせん", "きゅうせん"],
  },
  {
    type: "vocabulary",
    block: ["いちまん", "じゅうまん", "ひゃくまん", "せんまん", "いちおく"],
  },
];

const level4GrammarBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [];

const level4Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...level4VocabBlocks, ...level4GrammarBlocks];

export default level4Block;
