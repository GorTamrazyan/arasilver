import Image from "next/image"
import { useTranslations } from "next-intl"

export function Editorial({
  imageUrl,
  heading,
}: {
  imageUrl: string
  heading: { kicker: string; title: string; titleItalic: string; lede: string }
}) {
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
            {heading.kicker}
          </p>
          <h2 className="max-w-3xl font-serif text-5xl leading-[1.05] text-balance text-background md:text-7xl">
            {heading.title}{" "}
            <em className="font-light italic">{heading.titleItalic}</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-background/85">
            {heading.lede}
          </p>
        </div>
      </div>
    </section>
  )
}
