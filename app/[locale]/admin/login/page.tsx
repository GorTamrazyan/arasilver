import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations("Auth")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <p className="mt-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">{t("adminPanel")}</p>
          <h1 className="mt-3 font-serif text-4xl">{t("loginTitle")}</h1>
        </div>

        {error === "unauthorized" && (
          <div className="mb-6 border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {t("adminUnauthorized")}
          </div>
        )}

        <AdminLoginForm />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/admin/sign-up" className="text-foreground underline-offset-4 hover:underline">
            {t("createLink")}
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
