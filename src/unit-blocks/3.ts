const leveld3VocabBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  { type: "vocabulary", block: ["ここ", "そこ", "あそこ", "どこ"] },
  { type: "vocabulary", block: ["こちら", "そちら", "あちら", "どちら"] },
  {
    type: "vocabulary",
    block: ["きょうしつ", "しょくどう", "じむしょ", "かいぎしつ"],
  },
  {
    type: "vocabulary",
    block: ["うけつけ", "ロビー", "へや", "トイレ"],
  },
  {
    type: "vocabulary",
    block: ["かいだん", "エレベーター", "エスカレーター", "じどうはんばいき"],
  },
  {
    type: "vocabulary",
    block: ["でんわ", "おくに", "かいしゃ", "うち"],
  },
  {
    type: "vocabulary",
    block: ["くつ", "ネクタイ", "ワイン"],
  },
  {
    type: "vocabulary",
    block: ["うりば", "ちか", "いっかい", "なんがい"],
  },
  {
    type: "vocabulary",
    block: ["えん", "いくら", "ひゃく", "せん", "まん"],
  },
];

const leveld3GrammarBlocks: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [
  {
    type: "grammar",
    block: [
      "ここ は きょうしつ です",
      "ここ は だいがく です",
      "ここ は ひろしま です",
    ],
  },
  {
    type: "grammar",
    block: [
      "うけつけ は ここ です",
      "うけつけ は そこ です",
      "うけつけ は あそこ です",
      "うけつけ は どこ ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "じどうはんばいき は ２かい です",
      "じどうはんばいき は ロビー です",
      "さとうさん は じむしょ です",
      "さとうさん は しょくどう です",
      "さとうさん は どこ です か",
    ],
  },
  {
    type: "grammar",
    block: [
      "エレベーター は こちら です",
      "エレベーター は そちら です",
      "エレベーター は あちら です",
      "エレベーター は どちら ですか",
    ],
  },
  {
    type: "grammar",
    block: [
      "くに は フランス です",
      "かいしゃ は IMC です",
      "だいがく は さくらだいがく です",
      "だいがく は どちら ですか",
    ],
  },
];

const leveld3Block: Array<{
  type: "grammar" | "vocabulary";
  block: Array<string>;
}> = [...leveld3VocabBlocks, ...leveld3GrammarBlocks];

export default leveld3Block;
