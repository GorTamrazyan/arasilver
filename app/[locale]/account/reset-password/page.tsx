import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { ResetPasswordForm } from "@/components/account/reset-password-form"

export default async function ResetPasswordPage() {
  const t = await getTranslations("Auth")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <h1 className="mt-6 font-serif text-4xl">{t("resetTitle")}</h1>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  )
}
