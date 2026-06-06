-- ARASILVER — editable home-page headlines (Hero + Editorial).
-- Reuses the generic public.site_settings store from 005_site_settings.sql.
-- Keys follow `text_<section>_<field>_<locale>`. Seeding is optional: the app
-- falls back to the bundled defaults for any missing key.
-- Run this in the Supabase SQL editor (after 005_site_settings.sql).

insert into public.site_settings (key, value) values
  -- Hero caption card (overlaid on the photo)
  ('text_hero_captionLabel_hy', 'Կերպար №14'),
  ('text_hero_captionTitle_hy', '«Luna մատանիների շարք»'),
  ('text_hero_captionSilver_hy', '— արծաթ 925'),
  ('text_hero_captionPrice_hy', '12 000 ֏-ից'),
  ('text_hero_captionLabel_ru', 'Образ №14'),
  ('text_hero_captionTitle_ru', '«Стопка колец Luna»'),
  ('text_hero_captionSilver_ru', '— серебро 925'),
  ('text_hero_captionPrice_ru', 'от 3 200 ₽'),
  ('text_hero_captionLabel_en', 'Look №14'),
  ('text_hero_captionTitle_en', '«Luna ring stack»'),
  ('text_hero_captionSilver_en', '— 925 silver'),
  ('text_hero_captionPrice_en', 'from $34'),
  -- Editorial overlay (kicker + headline + lede)
  ('text_editorial_kicker_hy', 'Լուքբուք · Գարուն 2026'),
  ('text_editorial_title_hy', 'Լուսինը'),
  ('text_editorial_titleItalic_hy', 'ծովի վրա'),
  ('text_editorial_lede_hy', 'Նոր հավաքածուն՝ տուրք լուսնի լույսին և ափի լռությանը։ Օրգանական ձևեր, փափուկ կորեր և փայլատ արծաթ։'),
  ('text_editorial_kicker_ru', 'Лукбук · Весна 2026'),
  ('text_editorial_title_ru', 'Луна над'),
  ('text_editorial_titleItalic_ru', 'морем'),
  ('text_editorial_lede_ru', 'Новая коллекция — оммаж лунному свету и тишине побережья. Органические формы, мягкие изгибы и матовое серебро.'),
  ('text_editorial_kicker_en', 'Lookbook · Spring 2026'),
  ('text_editorial_title_en', 'Moon above'),
  ('text_editorial_titleItalic_en', 'the sea'),
  ('text_editorial_lede_en', 'The new collection is an ode to moonlight and the quiet of the coast. Organic shapes, soft curves and matte silver.')
on conflict (key) do nothing;
