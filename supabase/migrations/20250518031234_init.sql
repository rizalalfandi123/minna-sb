create extension if not exists moddatetime schema extensions;

create table "public"."letter_blocks" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null default ''::text,
    "description" text not null default ''::text,
    "id" uuid not null default gen_random_uuid(),
    "deleted" boolean not null default false
);


alter table "public"."letter_blocks" enable row level security;

create table "public"."letter_levels" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "number" integer not null,
    "letter_type_id" uuid not null,
    "deleted" boolean not null default false,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."letter_levels" enable row level security;

create table "public"."letter_positions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "row" integer not null,
    "column" integer not null,
    "deleted" boolean not null
);


alter table "public"."letter_positions" enable row level security;

create table "public"."letter_progress" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "deleted" boolean not null default false,
    "is_completed" boolean not null,
    "letter_level_id" uuid not null default gen_random_uuid()
);


alter table "public"."letter_progress" enable row level security;

create table "public"."letter_questions" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "question" jsonb not null,
    "number" integer not null,
    "deleted" boolean not null default false,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."letter_questions" enable row level security;

create table "public"."letter_questions_to_letter_levels" (
    "letter_question_id" uuid not null,
    "letter_level_id" uuid not null
);


alter table "public"."letter_questions_to_letter_levels" enable row level security;

create table "public"."letter_types" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null default ''::text,
    "deleted" boolean not null default false
);


alter table "public"."letter_types" enable row level security;

create table "public"."letters" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "deleted" boolean not null default false,
    "name" text not null,
    "symbol" text not null,
    "type_id" uuid not null,
    "position_id" uuid not null,
    "block_id" uuid not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."letters" enable row level security;

create table "public"."letters_to_letter_levels" (
    "letter_id" uuid not null,
    "letter_level_id" uuid not null
);


alter table "public"."letters_to_letter_levels" enable row level security;

CREATE UNIQUE INDEX letter_blocks_name_key ON public.letter_blocks USING btree (name);

CREATE UNIQUE INDEX letter_blocks_pkey ON public.letter_blocks USING btree (id);

CREATE UNIQUE INDEX letter_levels_number_key ON public.letter_levels USING btree (number);

CREATE UNIQUE INDEX letter_levels_pkey ON public.letter_levels USING btree (id);

CREATE UNIQUE INDEX letter_positions_column_key ON public.letter_positions USING btree ("column");

CREATE UNIQUE INDEX letter_positions_pkey ON public.letter_positions USING btree (id);

CREATE UNIQUE INDEX letter_positions_row_key ON public.letter_positions USING btree ("row");

CREATE UNIQUE INDEX letter_progress_pkey ON public.letter_progress USING btree (id);

CREATE UNIQUE INDEX letter_questions_pkey ON public.letter_questions USING btree (id);

CREATE UNIQUE INDEX letter_questions_to_letter_levels_pkey ON public.letter_questions_to_letter_levels USING btree (letter_question_id, letter_level_id);

CREATE UNIQUE INDEX letter_types_name_key ON public.letter_types USING btree (name);

CREATE UNIQUE INDEX letter_types_pkey ON public.letter_types USING btree (id);

CREATE UNIQUE INDEX letters_pkey ON public.letters USING btree (id);

CREATE UNIQUE INDEX letters_to_letter_levels_pkey ON public.letters_to_letter_levels USING btree (letter_id, letter_level_id);

alter table "public"."letter_blocks" add constraint "letter_blocks_pkey" PRIMARY KEY using index "letter_blocks_pkey";

alter table "public"."letter_levels" add constraint "letter_levels_pkey" PRIMARY KEY using index "letter_levels_pkey";

alter table "public"."letter_positions" add constraint "letter_positions_pkey" PRIMARY KEY using index "letter_positions_pkey";

alter table "public"."letter_progress" add constraint "letter_progress_pkey" PRIMARY KEY using index "letter_progress_pkey";

alter table "public"."letter_questions" add constraint "letter_questions_pkey" PRIMARY KEY using index "letter_questions_pkey";

alter table "public"."letter_questions_to_letter_levels" add constraint "letter_questions_to_letter_levels_pkey" PRIMARY KEY using index "letter_questions_to_letter_levels_pkey";

alter table "public"."letter_types" add constraint "letter_types_pkey" PRIMARY KEY using index "letter_types_pkey";

alter table "public"."letters" add constraint "letters_pkey" PRIMARY KEY using index "letters_pkey";

alter table "public"."letters_to_letter_levels" add constraint "letters_to_letter_levels_pkey" PRIMARY KEY using index "letters_to_letter_levels_pkey";

alter table "public"."letter_blocks" add constraint "letter_blocks_name_key" UNIQUE using index "letter_blocks_name_key";

alter table "public"."letter_levels" add constraint "letter_levels_letter_type_id_fkey" FOREIGN KEY (letter_type_id) REFERENCES letter_types(id) not valid;

alter table "public"."letter_levels" validate constraint "letter_levels_letter_type_id_fkey";

alter table "public"."letter_levels" add constraint "letter_levels_number_key" UNIQUE using index "letter_levels_number_key";

alter table "public"."letter_positions" add constraint "letter_positions_column_key" UNIQUE using index "letter_positions_column_key";

alter table "public"."letter_positions" add constraint "letter_positions_row_key" UNIQUE using index "letter_positions_row_key";

alter table "public"."letter_progress" add constraint "letter_progress_letter_level_id_fkey" FOREIGN KEY (letter_level_id) REFERENCES letter_levels(id) not valid;

alter table "public"."letter_progress" validate constraint "letter_progress_letter_level_id_fkey";

alter table "public"."letter_questions_to_letter_levels" add constraint "letter_questions_to_letter_levels_letter_level_id_fkey" FOREIGN KEY (letter_level_id) REFERENCES letter_levels(id) not valid;

alter table "public"."letter_questions_to_letter_levels" validate constraint "letter_questions_to_letter_levels_letter_level_id_fkey";

alter table "public"."letter_questions_to_letter_levels" add constraint "letter_questions_to_letter_levels_letter_question_id_fkey" FOREIGN KEY (letter_question_id) REFERENCES letter_questions(id) not valid;

alter table "public"."letter_questions_to_letter_levels" validate constraint "letter_questions_to_letter_levels_letter_question_id_fkey";

alter table "public"."letter_types" add constraint "letter_types_name_key" UNIQUE using index "letter_types_name_key";

alter table "public"."letters" add constraint "letters_block_id_fkey" FOREIGN KEY (block_id) REFERENCES letter_blocks(id) not valid;

alter table "public"."letters" validate constraint "letters_block_id_fkey";

alter table "public"."letters" add constraint "letters_position_id_fkey" FOREIGN KEY (position_id) REFERENCES letter_positions(id) not valid;

alter table "public"."letters" validate constraint "letters_position_id_fkey";

alter table "public"."letters" add constraint "letters_type_id_fkey" FOREIGN KEY (type_id) REFERENCES letter_types(id) not valid;

alter table "public"."letters" validate constraint "letters_type_id_fkey";

alter table "public"."letters_to_letter_levels" add constraint "letters_to_letter_levels_letter_id_fkey" FOREIGN KEY (letter_id) REFERENCES letters(id) not valid;

alter table "public"."letters_to_letter_levels" validate constraint "letters_to_letter_levels_letter_id_fkey";

alter table "public"."letters_to_letter_levels" add constraint "letters_to_letter_levels_letter_level_id_fkey" FOREIGN KEY (letter_level_id) REFERENCES letter_levels(id) not valid;

alter table "public"."letters_to_letter_levels" validate constraint "letters_to_letter_levels_letter_level_id_fkey";

grant delete on table "public"."letter_blocks" to "anon";

grant insert on table "public"."letter_blocks" to "anon";

grant references on table "public"."letter_blocks" to "anon";

grant select on table "public"."letter_blocks" to "anon";

grant trigger on table "public"."letter_blocks" to "anon";

grant truncate on table "public"."letter_blocks" to "anon";

grant update on table "public"."letter_blocks" to "anon";

grant delete on table "public"."letter_blocks" to "authenticated";

grant insert on table "public"."letter_blocks" to "authenticated";

grant references on table "public"."letter_blocks" to "authenticated";

grant select on table "public"."letter_blocks" to "authenticated";

grant trigger on table "public"."letter_blocks" to "authenticated";

grant truncate on table "public"."letter_blocks" to "authenticated";

grant update on table "public"."letter_blocks" to "authenticated";

grant delete on table "public"."letter_blocks" to "service_role";

grant insert on table "public"."letter_blocks" to "service_role";

grant references on table "public"."letter_blocks" to "service_role";

grant select on table "public"."letter_blocks" to "service_role";

grant trigger on table "public"."letter_blocks" to "service_role";

grant truncate on table "public"."letter_blocks" to "service_role";

grant update on table "public"."letter_blocks" to "service_role";

grant delete on table "public"."letter_levels" to "anon";

grant insert on table "public"."letter_levels" to "anon";

grant references on table "public"."letter_levels" to "anon";

grant select on table "public"."letter_levels" to "anon";

grant trigger on table "public"."letter_levels" to "anon";

grant truncate on table "public"."letter_levels" to "anon";

grant update on table "public"."letter_levels" to "anon";

grant delete on table "public"."letter_levels" to "authenticated";

grant insert on table "public"."letter_levels" to "authenticated";

grant references on table "public"."letter_levels" to "authenticated";

grant select on table "public"."letter_levels" to "authenticated";

grant trigger on table "public"."letter_levels" to "authenticated";

grant truncate on table "public"."letter_levels" to "authenticated";

grant update on table "public"."letter_levels" to "authenticated";

grant delete on table "public"."letter_levels" to "service_role";

grant insert on table "public"."letter_levels" to "service_role";

grant references on table "public"."letter_levels" to "service_role";

grant select on table "public"."letter_levels" to "service_role";

grant trigger on table "public"."letter_levels" to "service_role";

grant truncate on table "public"."letter_levels" to "service_role";

grant update on table "public"."letter_levels" to "service_role";

grant delete on table "public"."letter_positions" to "anon";

grant insert on table "public"."letter_positions" to "anon";

grant references on table "public"."letter_positions" to "anon";

grant select on table "public"."letter_positions" to "anon";

grant trigger on table "public"."letter_positions" to "anon";

grant truncate on table "public"."letter_positions" to "anon";

grant update on table "public"."letter_positions" to "anon";

grant delete on table "public"."letter_positions" to "authenticated";

grant insert on table "public"."letter_positions" to "authenticated";

grant references on table "public"."letter_positions" to "authenticated";

grant select on table "public"."letter_positions" to "authenticated";

grant trigger on table "public"."letter_positions" to "authenticated";

grant truncate on table "public"."letter_positions" to "authenticated";

grant update on table "public"."letter_positions" to "authenticated";

grant delete on table "public"."letter_positions" to "service_role";

grant insert on table "public"."letter_positions" to "service_role";

grant references on table "public"."letter_positions" to "service_role";

grant select on table "public"."letter_positions" to "service_role";

grant trigger on table "public"."letter_positions" to "service_role";

grant truncate on table "public"."letter_positions" to "service_role";

grant update on table "public"."letter_positions" to "service_role";

grant delete on table "public"."letter_progress" to "anon";

grant insert on table "public"."letter_progress" to "anon";

grant references on table "public"."letter_progress" to "anon";

grant select on table "public"."letter_progress" to "anon";

grant trigger on table "public"."letter_progress" to "anon";

grant truncate on table "public"."letter_progress" to "anon";

grant update on table "public"."letter_progress" to "anon";

grant delete on table "public"."letter_progress" to "authenticated";

grant insert on table "public"."letter_progress" to "authenticated";

grant references on table "public"."letter_progress" to "authenticated";

grant select on table "public"."letter_progress" to "authenticated";

grant trigger on table "public"."letter_progress" to "authenticated";

grant truncate on table "public"."letter_progress" to "authenticated";

grant update on table "public"."letter_progress" to "authenticated";

grant delete on table "public"."letter_progress" to "service_role";

grant insert on table "public"."letter_progress" to "service_role";

grant references on table "public"."letter_progress" to "service_role";

grant select on table "public"."letter_progress" to "service_role";

grant trigger on table "public"."letter_progress" to "service_role";

grant truncate on table "public"."letter_progress" to "service_role";

grant update on table "public"."letter_progress" to "service_role";

grant delete on table "public"."letter_questions" to "anon";

grant insert on table "public"."letter_questions" to "anon";

grant references on table "public"."letter_questions" to "anon";

grant select on table "public"."letter_questions" to "anon";

grant trigger on table "public"."letter_questions" to "anon";

grant truncate on table "public"."letter_questions" to "anon";

grant update on table "public"."letter_questions" to "anon";

grant delete on table "public"."letter_questions" to "authenticated";

grant insert on table "public"."letter_questions" to "authenticated";

grant references on table "public"."letter_questions" to "authenticated";

grant select on table "public"."letter_questions" to "authenticated";

grant trigger on table "public"."letter_questions" to "authenticated";

grant truncate on table "public"."letter_questions" to "authenticated";

grant update on table "public"."letter_questions" to "authenticated";

grant delete on table "public"."letter_questions" to "service_role";

grant insert on table "public"."letter_questions" to "service_role";

grant references on table "public"."letter_questions" to "service_role";

grant select on table "public"."letter_questions" to "service_role";

grant trigger on table "public"."letter_questions" to "service_role";

grant truncate on table "public"."letter_questions" to "service_role";

grant update on table "public"."letter_questions" to "service_role";

grant delete on table "public"."letter_questions_to_letter_levels" to "anon";

grant insert on table "public"."letter_questions_to_letter_levels" to "anon";

grant references on table "public"."letter_questions_to_letter_levels" to "anon";

grant select on table "public"."letter_questions_to_letter_levels" to "anon";

grant trigger on table "public"."letter_questions_to_letter_levels" to "anon";

grant truncate on table "public"."letter_questions_to_letter_levels" to "anon";

grant update on table "public"."letter_questions_to_letter_levels" to "anon";

grant delete on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant insert on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant references on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant select on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant trigger on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant truncate on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant update on table "public"."letter_questions_to_letter_levels" to "authenticated";

grant delete on table "public"."letter_questions_to_letter_levels" to "service_role";

grant insert on table "public"."letter_questions_to_letter_levels" to "service_role";

grant references on table "public"."letter_questions_to_letter_levels" to "service_role";

grant select on table "public"."letter_questions_to_letter_levels" to "service_role";

grant trigger on table "public"."letter_questions_to_letter_levels" to "service_role";

grant truncate on table "public"."letter_questions_to_letter_levels" to "service_role";

grant update on table "public"."letter_questions_to_letter_levels" to "service_role";

grant delete on table "public"."letter_types" to "anon";

grant insert on table "public"."letter_types" to "anon";

grant references on table "public"."letter_types" to "anon";

grant select on table "public"."letter_types" to "anon";

grant trigger on table "public"."letter_types" to "anon";

grant truncate on table "public"."letter_types" to "anon";

grant update on table "public"."letter_types" to "anon";

grant delete on table "public"."letter_types" to "authenticated";

grant insert on table "public"."letter_types" to "authenticated";

grant references on table "public"."letter_types" to "authenticated";

grant select on table "public"."letter_types" to "authenticated";

grant trigger on table "public"."letter_types" to "authenticated";

grant truncate on table "public"."letter_types" to "authenticated";

grant update on table "public"."letter_types" to "authenticated";

grant delete on table "public"."letter_types" to "service_role";

grant insert on table "public"."letter_types" to "service_role";

grant references on table "public"."letter_types" to "service_role";

grant select on table "public"."letter_types" to "service_role";

grant trigger on table "public"."letter_types" to "service_role";

grant truncate on table "public"."letter_types" to "service_role";

grant update on table "public"."letter_types" to "service_role";

grant delete on table "public"."letters" to "anon";

grant insert on table "public"."letters" to "anon";

grant references on table "public"."letters" to "anon";

grant select on table "public"."letters" to "anon";

grant trigger on table "public"."letters" to "anon";

grant truncate on table "public"."letters" to "anon";

grant update on table "public"."letters" to "anon";

grant delete on table "public"."letters" to "authenticated";

grant insert on table "public"."letters" to "authenticated";

grant references on table "public"."letters" to "authenticated";

grant select on table "public"."letters" to "authenticated";

grant trigger on table "public"."letters" to "authenticated";

grant truncate on table "public"."letters" to "authenticated";

grant update on table "public"."letters" to "authenticated";

grant delete on table "public"."letters" to "service_role";

grant insert on table "public"."letters" to "service_role";

grant references on table "public"."letters" to "service_role";

grant select on table "public"."letters" to "service_role";

grant trigger on table "public"."letters" to "service_role";

grant truncate on table "public"."letters" to "service_role";

grant update on table "public"."letters" to "service_role";

grant delete on table "public"."letters_to_letter_levels" to "anon";

grant insert on table "public"."letters_to_letter_levels" to "anon";

grant references on table "public"."letters_to_letter_levels" to "anon";

grant select on table "public"."letters_to_letter_levels" to "anon";

grant trigger on table "public"."letters_to_letter_levels" to "anon";

grant truncate on table "public"."letters_to_letter_levels" to "anon";

grant update on table "public"."letters_to_letter_levels" to "anon";

grant delete on table "public"."letters_to_letter_levels" to "authenticated";

grant insert on table "public"."letters_to_letter_levels" to "authenticated";

grant references on table "public"."letters_to_letter_levels" to "authenticated";

grant select on table "public"."letters_to_letter_levels" to "authenticated";

grant trigger on table "public"."letters_to_letter_levels" to "authenticated";

grant truncate on table "public"."letters_to_letter_levels" to "authenticated";

grant update on table "public"."letters_to_letter_levels" to "authenticated";

grant delete on table "public"."letters_to_letter_levels" to "service_role";

grant insert on table "public"."letters_to_letter_levels" to "service_role";

grant references on table "public"."letters_to_letter_levels" to "service_role";

grant select on table "public"."letters_to_letter_levels" to "service_role";

grant trigger on table "public"."letters_to_letter_levels" to "service_role";

grant truncate on table "public"."letters_to_letter_levels" to "service_role";

grant update on table "public"."letters_to_letter_levels" to "service_role";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_blocks FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_levels FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_positions FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_progress FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_questions FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letter_types FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.letters FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

alter table "public"."letter_positions" alter column "deleted" set default false;
