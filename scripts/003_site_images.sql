-- ARASILVER — editable site images (banners).
-- Image files live in Cloudinary; this table only stores the URLs.
-- Run this in the Supabase SQL editor.

create table if not exists public.site_images (
  key text primary key,
  url text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;

-- Public read: every visitor needs to see the banner images.
drop policy if exists "site_images_select_public" on public.site_images;
create policy "site_images_select_public" on public.site_images
  for select using (true);

-- Only admins can change them.
drop policy if exists "site_images_admin_all" on public.site_images;
create policy "site_images_admin_all" on public.site_images
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Seed the default slots pointing at the Cloudinary-hosted images.
insert into public.site_images (key, url) values
  ('hero',        'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/hero-jewelry.jpg'),
  ('editorial',   'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/editorial-model.jpg'),
  ('about',       'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/atelier.jpg'),
  ('instagram_1', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/product-earrings.jpg'),
  ('instagram_2', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/product-ring.jpg'),
  ('instagram_3', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/editorial-model.jpg'),
  ('instagram_4', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/product-pendant.jpg'),
  ('instagram_5', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/atelier.jpg'),
  ('instagram_6', 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library/product-bracelet.jpg')
on conflict (key) do nothing;
