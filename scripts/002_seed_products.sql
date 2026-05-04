-- Seed initial ARASILVER product catalog

insert into public.products (slug, name, category, description, price, currency, image_url, material, stock, is_active)
values
  (
    'luna-ring',
    'Кольцо Luna',
    'rings',
    'Скульптурное кольцо из стерлингового серебра 925 пробы с фактурой ручной ковки. Каждое изделие уникально благодаря авторской обработке поверхности.',
    148.00,
    'USD',
    '/product-ring.jpg',
    '925 Sterling Silver',
    12,
    true
  ),
  (
    'mira-earrings',
    'Серьги Mira',
    'earrings',
    'Изящные серьги-подвески с органическими линиями. Лёгкие, комфортные для ежедневного ношения. Застёжка швенза с силиконовой фиксацией.',
    96.00,
    'USD',
    '/product-earrings.jpg',
    '925 Sterling Silver',
    18,
    true
  ),
  (
    'pearl-pendant',
    'Подвеска Pearl',
    'pendants',
    'Минималистичная подвеска с натуральным пресноводным жемчугом на серебряной цепочке длиной 45 см. Тонкая работа и выверенные пропорции.',
    124.00,
    'USD',
    '/product-pendant.jpg',
    '925 Sterling Silver, Pearl',
    9,
    true
  ),
  (
    'chain-bracelet',
    'Браслет Chain',
    'bracelets',
    'Тонкий серебряный браслет с плетением «якорь». Регулируемая длина 16–19 см, надёжный карабин. Подходит для многослойного ношения.',
    88.00,
    'USD',
    '/product-bracelet.jpg',
    '925 Sterling Silver',
    22,
    true
  ),
  (
    'duo-ring',
    'Кольцо Duo',
    'rings',
    'Двойное кольцо с переплетённой структурой. Символ соединения двух начал. Матовая и полированная поверхности на контрасте.',
    132.00,
    'USD',
    '/product-ring.jpg',
    '925 Sterling Silver',
    14,
    true
  ),
  (
    'droplet-earrings',
    'Серьги Droplet',
    'earrings',
    'Серьги-капли с зеркальной полировкой. Классическая форма в современной интерпретации. Вес пары — 4.2 г.',
    78.00,
    'USD',
    '/product-earrings.jpg',
    '925 Sterling Silver',
    20,
    true
  ),
  (
    'moon-pendant',
    'Подвеска Moon',
    'pendants',
    'Подвеска в форме растущей луны на цепочке 50 см. Тёплая текстура с мягким отражением света. Идеальна как базовое украшение.',
    108.00,
    'USD',
    '/product-pendant.jpg',
    '925 Sterling Silver',
    11,
    true
  ),
  (
    'layer-bracelet',
    'Браслет Layer',
    'bracelets',
    'Массивный браслет из плоских звеньев. Выразительное украшение с хорошим весом и драпировкой на запястье.',
    156.00,
    'USD',
    '/product-bracelet.jpg',
    '925 Sterling Silver',
    7,
    true
  )
on conflict (slug) do nothing;
