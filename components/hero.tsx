import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export function Hero({
  imageUrl,
  heading,
}: {
  imageUrl: string
  heading: {
    captionLabel: string
    captionTitle: string
    captionSilver: string
    captionPrice: string
  }
}) {
  const t = useTranslations("Hero")

  return (
    <section id="top" className="relative border-b border-border/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pt-10 pb-16 md:grid-cols-12 md:gap-8 md:px-10 md:pt-16 md:pb-24">
        {/* Copy */}
        <div className="md:col-span-6 md:pt-10">
          <p className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
            {t("collection")}
          </p>

          <h1 className="font-serif text-5xl leading-[1.05] text-balance text-foreground md:text-7xl lg:text-[5.5rem]">
            {t("title1")}
            <br />
            {t("title2")}
            <br />
            <em className="font-light italic text-muted-foreground">{t("titleItalic")}</em>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            {t("lede")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-xs tracking-[0.25em] text-background uppercase transition-colors hover:bg-foreground/85"
            >
              {t("viewCatalog")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#about"
              className="text-xs tracking-[0.25em] text-foreground uppercase underline underline-offset-8 transition-opacity hover:opacity-70"
            >
              {t("ourStory")}
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-8">
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {t("statSilver")}
              </dt>
              <dd className="mt-2 font-serif text-3xl">925</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {t("statWorks")}
              </dt>
              <dd className="mt-2 font-serif text-3xl">120+</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {t("statClients")}
              </dt>
              <dd className="mt-2 font-serif text-3xl">14k</dd>
            </div>
          </dl>
        </div>

        {/* Image */}
        <div className="relative md:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={t("heroAlt")}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Overlay caption card */}
          <div className="absolute bottom-6 left-6 max-w-[240px] bg-background/95 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
              {heading.captionLabel}
            </p>
            <p className="mt-2 font-serif text-lg leading-snug text-foreground">
              {heading.captionTitle} <span className="italic text-muted-foreground">{heading.captionSilver}</span>
            </p>
            <p className="mt-3 text-sm text-foreground/80">{heading.captionPrice}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
