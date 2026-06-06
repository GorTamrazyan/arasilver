-- ARASILVER — editable text settings (announcement bar, etc.).
-- Generic key/value store for small pieces of site copy the admin can edit.
-- Run this in the Supabase SQL editor.

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Public read: every visitor needs to see the announcement bar text.
drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings
  for select using (true);

-- Only admins can change them.
drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Seed the announcement bar text per locale (one item per line).
-- Defaults mirror the bundled translations; admins can overwrite them.
insert into public.site_settings (key, value) values
  ('announcement_ru', E'Бесплатная доставка по России от 5 000 ₽\nРучная работа · Серебро 925\nНовая коллекция «Луна» уже в продаже\nПодарочная упаковка в каждом заказе'),
  ('announcement_en', E'Free worldwide shipping over $200\nHandmade · 925 Sterling Silver\nNew «Luna» collection now available\nGift packaging with every order'),
  ('announcement_hy', E'Անվճար առաքում Հայաստանով մեկ՝ 20 000 ֏-ից\nՁեռագործ · Արծաթ 925\nՆոր «Լուսին» հավաքածուն արդեն վաճառքում\nՆվիրատու փաթեթավորում յուրաքանչյուր պատվերում')
on conflict (key) do nothing;
