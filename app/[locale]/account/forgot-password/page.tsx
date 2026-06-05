import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { ForgotPasswordForm } from "@/components/account/forgot-password-form"

export default async function ForgotPasswordPage() {
  const t = await getTranslations("Auth")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <h1 className="mt-6 font-serif text-4xl">{t("forgotTitle")}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("forgotSubtitle")}
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("rememberedPassword")}{" "}
          <Link href="/account/login" className="text-foreground underline-offset-4 hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </main>
  )
}
