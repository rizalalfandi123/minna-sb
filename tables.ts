export const tables = [
  { name: "letter_types", omit: { created_at: true, updated_at: true } },
  { name: "letter_blocks", omit: { created_at: true, updated_at: true } },
  { name: "letter_positions", omit: { created_at: true, updated_at: true } },
  { name: "letters", omit: { created_at: true, updated_at: true } },
  { name: "letter_questions", omit: { created_at: true, updated_at: true } },
  { name: "letter_levels", omit: { created_at: true, updated_at: true } },
  { name: "unit_questions", omit: { created_at: true, updated_at: true } },
  { name: "units", omit: { created_at: true, updated_at: true } },
  { name: "letter_questions_to_letter_levels" },
  { name: "letters_to_letter_levels" },
];
