export type Letter = Record<"symbol" | "name" | "block", string> & { row: number; column: number };

// Basic Hiragana
export const a_h: Letter = { symbol: "あ", name: "a", block: "basic", row: 0, column: 0 };
export const i_h: Letter = { symbol: "い", name: "i", block: "basic", row: 0, column: 1 };
export const u_h: Letter = { symbol: "う", name: "u", block: "basic", row: 0, column: 2 };
export const e_h: Letter = { symbol: "え", name: "e", block: "basic", row: 0, column: 3 };
export const o_h: Letter = { symbol: "お", name: "o", block: "basic", row: 0, column: 4 };

export const ka_h: Letter = { symbol: "か", name: "ka", block: "basic", row: 1, column: 0 };
export const ki_h: Letter = { symbol: "き", name: "ki", block: "basic", row: 1, column: 1 };
export const ku_h: Letter = { symbol: "く", name: "ku", block: "basic", row: 1, column: 2 };
export const ke_h: Letter = { symbol: "け", name: "ke", block: "basic", row: 1, column: 3 };
export const ko_h: Letter = { symbol: "こ", name: "ko", block: "basic", row: 1, column: 4 };

export const sa_h: Letter = { symbol: "さ", name: "sa", block: "basic", row: 2, column: 0 };
export const shi_h: Letter = { symbol: "し", name: "shi", block: "basic", row: 2, column: 1 };
export const su_h: Letter = { symbol: "す", name: "su", block: "basic", row: 2, column: 2 };
export const se_h: Letter = { symbol: "せ", name: "se", block: "basic", row: 2, column: 3 };
export const so_h: Letter = { symbol: "そ", name: "so", block: "basic", row: 2, column: 4 };

export const ta_h: Letter = { symbol: "た", name: "ta", block: "basic", row: 3, column: 0 };
export const chi_h: Letter = { symbol: "ち", name: "chi", block: "basic", row: 3, column: 1 };
export const tsu_h: Letter = { symbol: "つ", name: "tsu", block: "basic", row: 3, column: 2 };
export const te_h: Letter = { symbol: "て", name: "te", block: "basic", row: 3, column: 3 };
export const to_h: Letter = { symbol: "と", name: "to", block: "basic", row: 3, column: 4 };

export const na_h: Letter = { symbol: "な", name: "na", block: "basic", row: 4, column: 0 };
export const ni_h: Letter = { symbol: "に", name: "ni", block: "basic", row: 4, column: 1 };
export const nu_h: Letter = { symbol: "ぬ", name: "nu", block: "basic", row: 4, column: 2 };
export const ne_h: Letter = { symbol: "ね", name: "ne", block: "basic", row: 4, column: 3 };
export const no_h: Letter = { symbol: "の", name: "no", block: "basic", row: 4, column: 4 };

export const ha_h: Letter = { symbol: "は", name: "ha", block: "basic", row: 5, column: 0 };
export const hi_h: Letter = { symbol: "ひ", name: "hi", block: "basic", row: 5, column: 1 };
export const fu_h: Letter = { symbol: "ふ", name: "fu", block: "basic", row: 5, column: 2 };
export const he_h: Letter = { symbol: "へ", name: "he", block: "basic", row: 5, column: 3 };
export const ho_h: Letter = { symbol: "ほ", name: "ho", block: "basic", row: 5, column: 4 };

export const ma_h: Letter = { symbol: "ま", name: "ma", block: "basic", row: 6, column: 0 };
export const mi_h: Letter = { symbol: "み", name: "mi", block: "basic", row: 6, column: 1 };
export const mu_h: Letter = { symbol: "む", name: "mu", block: "basic", row: 6, column: 2 };
export const me_h: Letter = { symbol: "め", name: "me", block: "basic", row: 6, column: 3 };
export const mo_h: Letter = { symbol: "も", name: "mo", block: "basic", row: 6, column: 4 };

export const ya_h: Letter = { symbol: "や", name: "ya", block: "basic", row: 7, column: 0 };
export const yu_h: Letter = { symbol: "ゆ", name: "yu", block: "basic", row: 7, column: 2 };
export const yo_h: Letter = { symbol: "よ", name: "yo", block: "basic", row: 7, column: 4 };

export const ra_h: Letter = { symbol: "ら", name: "ra", block: "basic", row: 8, column: 0 };
export const ri_h: Letter = { symbol: "り", name: "ri", block: "basic", row: 8, column: 1 };
export const ru_h: Letter = { symbol: "る", name: "ru", block: "basic", row: 8, column: 2 };
export const re_h: Letter = { symbol: "れ", name: "re", block: "basic", row: 8, column: 3 };
export const ro_h: Letter = { symbol: "ろ", name: "ro", block: "basic", row: 8, column: 4 };

export const wa_h: Letter = { symbol: "わ", name: "wa", block: "basic", row: 9, column: 0 };
export const wo_h: Letter = { symbol: "を", name: "o", block: "basic", row: 9, column: 4 };
export const n_h: Letter = { symbol: "ん", name: "n", block: "basic", row: 10, column: 0 };

// Dakuten (Voiced)
export const ga_h: Letter = { symbol: "が", name: "ga", block: "dakuten", row: 0, column: 0 };
export const gi_h: Letter = { symbol: "ぎ", name: "gi", block: "dakuten", row: 0, column: 1 };
export const gu_h: Letter = { symbol: "ぐ", name: "gu", block: "dakuten", row: 0, column: 2 };
export const ge_h: Letter = { symbol: "げ", name: "ge", block: "dakuten", row: 0, column: 3 };
export const go_h: Letter = { symbol: "ご", name: "go", block: "dakuten", row: 0, column: 4 };

export const za_h: Letter = { symbol: "ざ", name: "za", block: "dakuten", row: 1, column: 0 };
export const ji_h: Letter = { symbol: "じ", name: "ji", block: "dakuten", row: 1, column: 1 };
export const zu_h: Letter = { symbol: "ず", name: "zu", block: "dakuten", row: 1, column: 2 };
export const ze_h: Letter = { symbol: "ぜ", name: "ze", block: "dakuten", row: 1, column: 3 };
export const zo_h: Letter = { symbol: "ぞ", name: "zo", block: "dakuten", row: 1, column: 4 };

export const da_h: Letter = { symbol: "だ", name: "da", block: "dakuten", row: 2, column: 0 };
export const ji2_h: Letter = { symbol: "ぢ", name: "ji", block: "dakuten", row: 2, column: 1 };
export const zu2_h: Letter = { symbol: "づ", name: "zu", block: "dakuten", row: 2, column: 2 };
export const de_h: Letter = { symbol: "で", name: "de", block: "dakuten", row: 2, column: 3 };
export const do__h: Letter = { symbol: "ど", name: "do", block: "dakuten", row: 2, column: 4 };

export const ba_h: Letter = { symbol: "ば", name: "ba", block: "dakuten", row: 3, column: 0 };
export const bi_h: Letter = { symbol: "び", name: "bi", block: "dakuten", row: 3, column: 1 };
export const bu_h: Letter = { symbol: "ぶ", name: "bu", block: "dakuten", row: 3, column: 2 };
export const be_h: Letter = { symbol: "べ", name: "be", block: "dakuten", row: 3, column: 3 };
export const bo_h: Letter = { symbol: "ぼ", name: "bo", block: "dakuten", row: 3, column: 4 };

// Handakuten
export const pa_h: Letter = { symbol: "ぱ", name: "pa", block: "handakuten", row: 0, column: 0 };
export const pi_h: Letter = { symbol: "ぴ", name: "pi", block: "handakuten", row: 0, column: 1 };
export const pu_h: Letter = { symbol: "ぷ", name: "pu", block: "handakuten", row: 0, column: 2 };
export const pe_h: Letter = { symbol: "ぺ", name: "pe", block: "handakuten", row: 0, column: 3 };
export const po_h: Letter = { symbol: "ぽ", name: "po", block: "handakuten", row: 0, column: 4 };

// Yoon (Combinations)
export const kya_h: Letter = { symbol: "きゃ", name: "kya", block: "yoon", row: 0, column: 0 };
export const kyu_h: Letter = { symbol: "きゅ", name: "kyu", block: "yoon", row: 0, column: 1 };
export const kyo_h: Letter = { symbol: "きょ", name: "kyo", block: "yoon", row: 0, column: 2 };

export const gya_h: Letter = { symbol: "ぎゃ", name: "gya", block: "yoon", row: 1, column: 0 };
export const gyu_h: Letter = { symbol: "ぎゅ", name: "gyu", block: "yoon", row: 1, column: 1 };
export const gyo_h: Letter = { symbol: "ぎょ", name: "gyo", block: "yoon", row: 1, column: 2 };

export const sha_h: Letter = { symbol: "しゃ", name: "sha", block: "yoon", row: 2, column: 0 };
export const shu_h: Letter = { symbol: "しゅ", name: "shu", block: "yoon", row: 2, column: 1 };
export const sho_h: Letter = { symbol: "しょ", name: "sho", block: "yoon", row: 2, column: 2 };

export const ja_h: Letter = { symbol: "じゃ", name: "ja", block: "yoon", row: 3, column: 0 };
export const ju_h: Letter = { symbol: "じゅ", name: "ju", block: "yoon", row: 3, column: 1 };
export const jo_h: Letter = { symbol: "じょ", name: "jo", block: "yoon", row: 3, column: 2 };

export const cha_h: Letter = { symbol: "ちゃ", name: "cha", block: "yoon", row: 4, column: 0 };
export const chu_h: Letter = { symbol: "ちゅ", name: "chu", block: "yoon", row: 4, column: 1 };
export const cho_h: Letter = { symbol: "ちょ", name: "cho", block: "yoon", row: 4, column: 2 };

export const nya_h: Letter = { symbol: "にゃ", name: "nya", block: "yoon", row: 5, column: 0 };
export const nyu_h: Letter = { symbol: "にゅ", name: "nyu", block: "yoon", row: 5, column: 1 };
export const nyo_h: Letter = { symbol: "にょ", name: "nyo", block: "yoon", row: 5, column: 2 };

export const hya_h: Letter = { symbol: "ひゃ", name: "hya", block: "yoon", row: 6, column: 0 };
export const hyu_h: Letter = { symbol: "ひゅ", name: "hyu", block: "yoon", row: 6, column: 1 };
export const hyo_h: Letter = { symbol: "ひょ", name: "hyo", block: "yoon", row: 6, column: 2 };

export const bya_h: Letter = { symbol: "びゃ", name: "bya", block: "yoon", row: 7, column: 0 };
export const byu_h: Letter = { symbol: "びゅ", name: "byu", block: "yoon", row: 7, column: 1 };
export const byo_h: Letter = { symbol: "びょ", name: "byo", block: "yoon", row: 7, column: 2 };

export const pya_h: Letter = { symbol: "ぴゃ", name: "pya", block: "yoon", row: 8, column: 0 };
export const pyu_h: Letter = { symbol: "ぴゅ", name: "pyu", block: "yoon", row: 8, column: 1 };
export const pyo_h: Letter = { symbol: "ぴょ", name: "pyo", block: "yoon", row: 8, column: 2 };

export const mya_h: Letter = { symbol: "みゃ", name: "mya", block: "yoon", row: 9, column: 0 };
export const myu_h: Letter = { symbol: "みゅ", name: "myu", block: "yoon", row: 9, column: 1 };
export const myo_h: Letter = { symbol: "みょ", name: "myo", block: "yoon", row: 9, column: 2 };

export const rya_h: Letter = { symbol: "りゃ", name: "rya", block: "yoon", row: 10, column: 0 };
export const ryu_h: Letter = { symbol: "りゅ", name: "ryu", block: "yoon", row: 10, column: 1 };
export const ryo_h: Letter = { symbol: "りょ", name: "ryo", block: "yoon", row: 10, column: 2 };

// Sokuon (Small tsu)
export const kk_h: Letter = { symbol: "っ+k", name: "kk", block: "sokuon", row: 0, column: 0 };
export const ss_h: Letter = { symbol: "っ+s", name: "ss", block: "sokuon", row: 0, column: 1 };
export const tt_h: Letter = { symbol: "っ+t", name: "tt", block: "sokuon", row: 0, column: 2 };
export const pp_h: Letter = { symbol: "っ+p", name: "pp", block: "sokuon", row: 0, column: 3 };

// Choon (Long vowels)
export const aa_h: Letter = { symbol: "ああ", name: "aa", block: "choon", row: 0, column: 0 };
export const ii_h: Letter = { symbol: "いい", name: "ii", block: "choon", row: 0, column: 1 };
export const uu_h: Letter = { symbol: "うう", name: "uu", block: "choon", row: 0, column: 2 };
export const ee_h: Letter = { symbol: "ええ", name: "ee", block: "choon", row: 0, column: 3 };
export const oo_h: Letter = { symbol: "おお", name: "oo", block: "choon", row: 0, column: 4 };

export const ei_h: Letter = { symbol: "えい", name: "ei", block: "choon", row: 1, column: 0 };
export const ou_h: Letter = { symbol: "おう", name: "ou", block: "choon", row: 1, column: 1 };

const hiraganaLettersSeedData = [
  a_h,
  i_h,
  u_h,
  e_h,
  o_h,
  ka_h,
  ki_h,
  ku_h,
  ke_h,
  ko_h,
  sa_h,
  shi_h,
  su_h,
  se_h,
  so_h,
  ta_h,
  chi_h,
  tsu_h,
  te_h,
  to_h,
  na_h,
  ni_h,
  nu_h,
  ne_h,
  no_h,
  ha_h,
  hi_h,
  fu_h,
  he_h,
  ho_h,
  ma_h,
  mi_h,
  mu_h,
  me_h,
  mo_h,
  ya_h,
  yu_h,
  yo_h,
  ra_h,
  ri_h,
  ru_h,
  re_h,
  ro_h,
  wa_h,
  wo_h,
  n_h,
  ga_h,
  gi_h,
  gu_h,
  ge_h,
  go_h,
  za_h,
  ji_h,
  zu_h,
  ze_h,
  zo_h,
  da_h,
  ji2_h,
  zu2_h,
  de_h,
  do__h,
  ba_h,
  bi_h,
  bu_h,
  be_h,
  bo_h,
  pa_h,
  pi_h,
  pu_h,
  pe_h,
  po_h,
  kya_h,
  kyu_h,
  kyo_h,
  gya_h,
  gyu_h,
  gyo_h,
  sha_h,
  shu_h,
  sho_h,
  ja_h,
  ju_h,
  jo_h,
  cha_h,
  chu_h,
  cho_h,
  nya_h,
  nyu_h,
  nyo_h,
  hya_h,
  hyu_h,
  hyo_h,
  bya_h,
  byu_h,
  byo_h,
  pya_h,
  pyu_h,
  pyo_h,
  mya_h,
  myu_h,
  myo_h,
  rya_h,
  ryu_h,
  ryo_h,
  kk_h,
  ss_h,
  tt_h,
  pp_h,
  aa_h,
  ii_h,
  uu_h,
  ee_h,
  oo_h,
  ei_h,
  ou_h,
];


export default hiraganaLettersSeedData