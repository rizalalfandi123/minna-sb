alter table "public"."letter_positions" drop constraint "letter_positions_column_key";

alter table "public"."letter_positions" drop constraint "letter_positions_row_key";

drop index if exists "public"."letter_positions_column_key";

drop index if exists "public"."letter_positions_row_key";


