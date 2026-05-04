import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function Hero() {
  return (
    <section id="top" className="relative border-b border-border/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pt-10 pb-16 md:grid-cols-12 md:gap-8 md:px-10 md:pt-16 md:pb-24">
        {/* Copy */}
        <div className="md:col-span-6 md:pt-10">
          <p className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
            Коллекция 2026
          </p>

          <h1 className="font-serif text-5xl leading-[1.05] text-balance text-foreground md:text-7xl lg:text-[5.5rem]">
            Серебро,
            <br />
            созданное
            <br />
            <em className="font-light italic text-muted-foreground">вручную</em>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            ARASILVER — небольшая ювелирная мастерская. Мы создаём авторские
            украшения из серебра 925 пробы, где каждая деталь продумана
            и отполирована вручную.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="/shop"
              className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-xs tracking-[0.25em] text-background uppercase transition-colors hover:bg-foreground/85"
            >
              Смотреть каталог
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#about"
              className="text-xs tracking-[0.25em] text-foreground uppercase underline underline-offset-8 transition-opacity hover:opacity-70"
            >
              Наша история
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-8">
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Проба
              </dt>
              <dd className="mt-2 font-serif text-3xl">925</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Работ
              </dt>
              <dd className="mt-2 font-serif text-3xl">120+</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Клиенты
              </dt>
              <dd className="mt-2 font-serif text-3xl">14k</dd>
            </div>
          </dl>
        </div>

        {/* Image */}
        <div className="relative md:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <Image
              src="/hero-jewelry.jpg"
              alt="Женская рука с серебряными кольцами ARASILVER"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Overlay caption card */}
          <div className="absolute bottom-6 left-6 max-w-[240px] bg-background/95 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
              Образ №14
            </p>
            <p className="mt-2 font-serif text-lg leading-snug text-foreground">
              «Стопка колец Luna» <span className="italic text-muted-foreground">— серебро 925</span>
            </p>
            <p className="mt-3 text-sm text-foreground/80">от 3 200 ₽</p>
          </div>
        </div>
      </div>
    </section>
  )
}
