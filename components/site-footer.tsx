"use client"

import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function SiteFooter() {
  const t = useTranslations("Footer")
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
        {/* Top: newsletter */}
        <div className="grid grid-cols-1 gap-10 border-b border-background/15 pb-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-balance md:text-5xl">
              {t("newsletterTitle")}{" "}
              <em className="font-light italic text-background/60">
                {t("newsletterTitleItalic")}
              </em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-background/70">
              {t("newsletterLede")}
            </p>
          </div>

          <form
            className="flex items-end gap-0 self-end border-b border-background/30"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="email" className="sr-only">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent py-4 text-sm text-background placeholder:text-background/40 focus:outline-none"
            />
            <button
              type="submit"
              className="group flex items-center gap-2 py-4 text-xs tracking-[0.25em] text-background uppercase"
            >
              {t("subscribe")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </form>
        </div>

        {/* Middle: columns */}
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:gap-12">
          <div>
            <h3 className="mb-5 text-xs tracking-[0.25em] text-background/60 uppercase">
              {t("colShopTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-background/90">
              <li><a href="#" className="hover:text-background">{t("colShopRings")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colShopEarrings")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colShopPendants")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colShopBracelets")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-xs tracking-[0.25em] text-background/60 uppercase">
              {t("colBrandTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-background/90">
              <li><a href="#about" className="hover:text-background">{t("colBrandAbout")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colBrandAtelier")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colBrandMaterials")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colBrandJournal")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-xs tracking-[0.25em] text-background/60 uppercase">
              {t("colHelpTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-background/90">
              <li><a href="#" className="hover:text-background">{t("colHelpShipping")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colHelpReturns")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colHelpSizes")}</a></li>
              <li><a href="#" className="hover:text-background">{t("colHelpCare")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-xs tracking-[0.25em] text-background/60 uppercase">
              {t("colContactTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-background/90">
              <li>
                <a
                  href="https://instagram.com/arasilver"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-background"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href="mailto:hello@arasilver.store" className="hover:text-background">
                  hello@arasilver.store
                </a>
              </li>
              <li>
                <a href="tel:+37412345678" className="hover:text-background">
                  +374 1 234 5678
                </a>
              </li>
              <li className="text-background/60">{t("colContactCity")}</li>
            </ul>
          </div>
        </div>

        {/* Big brand wordmark */}
        <div className="overflow-hidden border-t border-background/15 pt-10">
          <p className="font-serif text-[20vw] leading-none tracking-[0.05em] text-background/10 select-none md:text-[16vw]">
            ARASILVER
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-background/55 md:flex-row md:items-center">
          <p>{t("copyright", { year })}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-background">{t("privacy")}</a>
            <a href="#" className="hover:text-background">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
