import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function Editorial({ imageUrl }: { imageUrl: string }) {
  const t = useTranslations("Editorial")

  return (
    <section id="collections" className="relative border-b border-border/60">
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden md:h-[80vh]">
        <Image
          src={imageUrl}
          alt={t("modelAlt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
          <p className="mb-4 flex items-center gap-3 text-xs tracking-[0.3em] text-background/80 uppercase">
            <span className="h-px w-8 bg-background/70" aria-hidden="true" />
            {t("kicker")}
          </p>
          <h2 className="max-w-3xl font-serif text-5xl leading-[1.05] text-balance text-background md:text-7xl">
            {t("title")}{" "}
            <em className="font-light italic">{t("titleItalic")}</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-background/85">
            {t("lede")}
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="group inline-flex items-center gap-3 bg-background px-7 py-4 text-xs tracking-[0.25em] text-foreground uppercase transition-colors hover:bg-background/90"
            >
              {t("cta")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
