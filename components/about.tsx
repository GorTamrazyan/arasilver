import Image from "next/image"
import { useTranslations } from "next-intl"

export function About({ imageUrl }: { imageUrl: string }) {
  const t = useTranslations("About")

  return (
    <section id="about" className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-12 md:gap-12 md:px-10 md:py-28">
        {/* Image */}
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={t("atelierAlt")}
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
            {t("kicker")}
          </p>

          <h2 className="font-serif text-4xl leading-[1.1] text-balance text-foreground md:text-6xl">
            {t("title")}{" "}
            <em className="font-light italic text-muted-foreground">
              {t("titleItalic")}
            </em>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-8 text-sm leading-relaxed text-foreground/80 md:grid-cols-2">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>

          {/* Values */}
          <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-border/60 pt-10 sm:grid-cols-3">
            <div>
              <dt className="font-serif text-2xl text-foreground">{t("value1Title")}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("value1")}
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-foreground">{t("value2Title")}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("value2")}
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl text-foreground">{t("value3Title")}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("value3")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
