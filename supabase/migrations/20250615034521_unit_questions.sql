create extension if not exists "pgjwt" with schema "extensions";


create table "public"."unit_questions" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "question" jsonb not null,
    "deleted" boolean not null default false,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."unit_questions" enable row level security;

create table "public"."units" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "deleted" boolean not null default false
);


alter table "public"."units" enable row level security;

alter table "public"."letter_progress" drop column "is_completed";

CREATE UNIQUE INDEX unit_questions_pkey ON public.unit_questions USING btree (id);

CREATE UNIQUE INDEX units_pkey ON public.units USING btree (id);

alter table "public"."unit_questions" add constraint "unit_questions_pkey" PRIMARY KEY using index "unit_questions_pkey";

alter table "public"."units" add constraint "units_pkey" PRIMARY KEY using index "units_pkey";

grant delete on table "public"."unit_questions" to "anon";

grant insert on table "public"."unit_questions" to "anon";

grant references on table "public"."unit_questions" to "anon";

grant select on table "public"."unit_questions" to "anon";

grant trigger on table "public"."unit_questions" to "anon";

grant truncate on table "public"."unit_questions" to "anon";

grant update on table "public"."unit_questions" to "anon";

grant delete on table "public"."unit_questions" to "authenticated";

grant insert on table "public"."unit_questions" to "authenticated";

grant references on table "public"."unit_questions" to "authenticated";

grant select on table "public"."unit_questions" to "authenticated";

grant trigger on table "public"."unit_questions" to "authenticated";

grant truncate on table "public"."unit_questions" to "authenticated";

grant update on table "public"."unit_questions" to "authenticated";

grant delete on table "public"."unit_questions" to "prisma";

grant insert on table "public"."unit_questions" to "prisma";

grant references on table "public"."unit_questions" to "prisma";

grant select on table "public"."unit_questions" to "prisma";

grant trigger on table "public"."unit_questions" to "prisma";

grant truncate on table "public"."unit_questions" to "prisma";

grant update on table "public"."unit_questions" to "prisma";

grant delete on table "public"."unit_questions" to "service_role";

grant insert on table "public"."unit_questions" to "service_role";

grant references on table "public"."unit_questions" to "service_role";

grant select on table "public"."unit_questions" to "service_role";

grant trigger on table "public"."unit_questions" to "service_role";

grant truncate on table "public"."unit_questions" to "service_role";

grant update on table "public"."unit_questions" to "service_role";

grant delete on table "public"."units" to "anon";

grant insert on table "public"."units" to "anon";

grant references on table "public"."units" to "anon";

grant select on table "public"."units" to "anon";

grant trigger on table "public"."units" to "anon";

grant truncate on table "public"."units" to "anon";

grant update on table "public"."units" to "anon";

grant delete on table "public"."units" to "authenticated";

grant insert on table "public"."units" to "authenticated";

grant references on table "public"."units" to "authenticated";

grant select on table "public"."units" to "authenticated";

grant trigger on table "public"."units" to "authenticated";

grant truncate on table "public"."units" to "authenticated";

grant update on table "public"."units" to "authenticated";

grant delete on table "public"."units" to "prisma";

grant insert on table "public"."units" to "prisma";

grant references on table "public"."units" to "prisma";

grant select on table "public"."units" to "prisma";

grant trigger on table "public"."units" to "prisma";

grant truncate on table "public"."units" to "prisma";

grant update on table "public"."units" to "prisma";

grant delete on table "public"."units" to "service_role";

grant insert on table "public"."units" to "service_role";

grant references on table "public"."units" to "service_role";

grant select on table "public"."units" to "service_role";

grant trigger on table "public"."units" to "service_role";

grant truncate on table "public"."units" to "service_role";

grant update on table "public"."units" to "service_role";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


