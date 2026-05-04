-- ============================================================
-- ARASILVER: customer accounts migration
-- Run in Supabase SQL editor AFTER 001_create_schema.sql
-- ============================================================

-- ── 1. Extend orders table ───────────────────────────────────

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_orders_user_id on public.orders(user_id);

-- ── 2. Wishlists ─────────────────────────────────────────────

create table if not exists public.wishlists (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id uuid        not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_wishlists_user_id on public.wishlists(user_id);

alter table public.wishlists enable row level security;

drop policy if exists "wishlists_select_own" on public.wishlists;
create policy "wishlists_select_own" on public.wishlists
  for select using (auth.uid() = user_id);

drop policy if exists "wishlists_insert_own" on public.wishlists;
create policy "wishlists_insert_own" on public.wishlists
  for insert with check (auth.uid() = user_id);

drop policy if exists "wishlists_delete_own" on public.wishlists;
create policy "wishlists_delete_own" on public.wishlists
  for delete using (auth.uid() = user_id);

-- ── 3. Addresses ─────────────────────────────────────────────

create table if not exists public.addresses (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  full_name  text        not null,
  phone      text        not null,
  street     text        not null,
  city       text        not null,
  country    text        not null,
  postal     text,
  is_default boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_addresses_user_id on public.addresses(user_id);

alter table public.addresses enable row level security;

drop policy if exists "addresses_select_own" on public.addresses;
create policy "addresses_select_own" on public.addresses
  for select using (auth.uid() = user_id);

drop policy if exists "addresses_insert_own" on public.addresses;
create policy "addresses_insert_own" on public.addresses
  for insert with check (auth.uid() = user_id);

drop policy if exists "addresses_update_own" on public.addresses;
create policy "addresses_update_own" on public.addresses
  for update using (auth.uid() = user_id);

drop policy if exists "addresses_delete_own" on public.addresses;
create policy "addresses_delete_own" on public.addresses
  for delete using (auth.uid() = user_id);

-- ── 4. Orders: users can view their own orders ───────────────

drop policy if exists "orders_user_select_own" on public.orders;
create policy "orders_user_select_own" on public.orders
  for select using (
    auth.uid() is not null
    and auth.uid() = user_id
  );

drop policy if exists "order_items_user_select_own" on public.order_items;
create policy "order_items_user_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.user_id = auth.uid()
    )
  );

-- ── 5. Link guest orders on signup ───────────────────────────

create or replace function public.link_guest_orders_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
  set user_id = NEW.id
  where customer_email = NEW.email
    and user_id is null;
  return NEW;
end;
$$;

drop trigger if exists on_auth_user_created_link_orders on auth.users;
create trigger on_auth_user_created_link_orders
  after insert on auth.users
  for each row execute procedure public.link_guest_orders_on_signup();
