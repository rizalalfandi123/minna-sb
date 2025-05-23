alter table "public"."letter_questions" drop column "number";

alter table "public"."letter_questions_to_letter_levels" add column "number" integer not null default 1;


