import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/account/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <p className="mt-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl">Вход</h1>
        </div>

        {error === "auth" && (
          <div className="mb-6 border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Ошибка подтверждения. Попробуйте войти снова.
          </div>
        )}

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Нет аккаунта?{" "}
          <Link href="/account/register" className="text-foreground underline-offset-4 hover:underline">
            Создать
          </Link>
        </p>

        <div className="mt-12 text-center">
          <Link href="/" className="text-xs tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground">
            ← На сайт
          </Link>
        </div>
      </div>
    </main>
  )
}
