import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { RegisterForm } from "@/components/account/register-form"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const t = await getTranslations("Auth")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <h1 className="mt-6 font-serif text-4xl">{t("registerTitle")}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("registerSubtitle")}
          </p>
        </div>

        <RegisterForm prefillEmail={email} />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/account/login" className="text-foreground underline-offset-4 hover:underline">
            {t("login")}
          </Link>
        </p>

        <div className="mt-12 text-center">
          <Link href="/" className="text-xs tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground">
            {t("backToSite")}
          </Link>
        </div>
      </div>
    </main>
  )
}
