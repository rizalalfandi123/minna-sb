create policy "public access for letter_blocks"
on "public"."letter_blocks"
as permissive
for select
to public
using (true);


create policy "public access for letter_levels"
on "public"."letter_levels"
as permissive
for select
to public
using (true);


create policy "public access for letter_positions"
on "public"."letter_positions"
as permissive
for select
to public
using (true);


create policy "public access for letter_questions"
on "public"."letter_questions"
as permissive
for select
to public
using (true);


create policy "public access to letter_questions_to_letter_levels"
on "public"."letter_questions_to_letter_levels"
as permissive
for select
to public
using (true);


create policy "public access to letter_types"
on "public"."letter_types"
as permissive
for select
to public
using (true);


create policy "public access to letters"
on "public"."letters"
as permissive
for select
to public
using (true);


create policy "public access to letters_to_letter_levels"
on "public"."letters_to_letter_levels"
as permissive
for select
to public
using (true);



