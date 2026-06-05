-- Re-point existing image references from /public/*.jpg to the Cloudinary CDN.
-- The image files were uploaded to the "arasilver/library" folder on Cloudinary.
-- Safe to run multiple times (only touches rows that still use a /public path).

-- Products: prepend the Cloudinary base to the seeded "/name.jpg" paths.
update public.products
set image_url = 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library' || image_url
where image_url like '/%.jpg';

-- Site banner slots: same for any slot still pointing at /public.
update public.site_images
set url = 'https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library' || url,
    updated_at = now()
where url like '/%.jpg';
