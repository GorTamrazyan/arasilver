import Image from "next/image"
import { Instagram } from "lucide-react"

const posts = [
  "/product-earrings.jpg",
  "/product-ring.jpg",
  "/editorial-model.jpg",
  "/product-pendant.jpg",
  "/atelier.jpg",
  "/product-bracelet.jpg",
]

export function InstagramFeed() {
  return (
    <section id="instagram" className="border-b border-border/60">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <p className="flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
            @arasilver
            <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
          </p>
          <h2 className="font-serif text-4xl leading-tight text-balance text-foreground md:text-5xl">
            Следите за нами в{" "}
            <em className="font-light italic text-muted-foreground">Instagram</em>
          </h2>
          <a
            href="https://instagram.com/arasilver"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-flex items-center gap-2 text-xs tracking-[0.25em] text-foreground uppercase underline underline-offset-8 transition-opacity hover:opacity-70"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Подписаться
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {posts.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/arasilver"
              target="_blank"
              rel="noreferrer noopener"
              className="group relative block aspect-square overflow-hidden bg-muted"
              aria-label={`Публикация ${i + 1} в Instagram`}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/30">
                <Instagram
                  className="h-6 w-6 text-background opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
