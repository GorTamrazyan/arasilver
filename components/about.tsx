import Image from "next/image"

export function About() {
  return (
    <section id="about" className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-12 md:gap-12 md:px-10 md:py-28">
        {/* Image */}
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <Image
              src="/atelier.jpg"
              alt="Мастерская ARASILVER"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="md:col-span-7 md:pt-8">
          <p className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
            О бренде
          </p>

          <h2 className="font-serif text-4xl leading-[1.1] text-balance text-foreground md:text-6xl">
            Каждое украшение —{" "}
            <em className="font-light italic text-muted-foreground">
              история, рассказанная руками.
            </em>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-8 text-sm leading-relaxed text-foreground/80 md:grid-cols-2">
            <p>
              ARASILVER появился в 2019 году как небольшая мастерская, где каждое
              украшение создаётся вручную из серебра 925 пробы. Мы верим, что
              настоящая красота рождается в несовершенствах — едва заметных следах
              молотка, органических линиях и мягком блеске.
            </p>
            <p>
              Наши коллекции — это минималистичные формы, вдохновлённые природой
              и архитектурой древних городов. Мы не делаем тысячи одинаковых
              украшений. Каждая работа проходит через руки мастера — от эскиза до
              финальной полировки.
            </p>
          </div>

          {/* Values */}
          <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-border/60 pt-10 sm:grid-cols-3">
            <div>
              <dt className="font-serif text-2xl text-foreground">01 — Материал</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Только серебро 925 пробы, проверенное в сертифицированной
                лаборатории.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-foreground">02 — Ручная работа</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Каждое украшение создаётся в нашей мастерской от начала до конца
                вручную.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-foreground">03 — Гарантия</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Пожизненное обслуживание: чистка и ремонт украшений, купленных у нас.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
