export function AnnouncementBar() {
  const items = [
    "Бесплатная доставка по России от 5 000 ₽",
    "Ручная работа · Серебро 925",
    "Новая коллекция «Луна» уже в продаже",
    "Подарочная упаковка в каждом заказе",
  ]

  return (
    <div className="overflow-hidden border-b border-border/60 bg-foreground text-background">
      <div className="flex whitespace-nowrap py-2.5 animate-marquee" style={{ width: "max-content" }}>
        {[...items, ...items, ...items].map((text, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-8 text-[11px] tracking-[0.3em] uppercase"
          >
            {text}
            <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-background/60" />
          </span>
        ))}
      </div>
    </div>
  )
}
