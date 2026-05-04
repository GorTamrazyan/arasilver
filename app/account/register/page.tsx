import Link from "next/link"
import { RegisterForm } from "@/components/account/register-form"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <p className="mt-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl">Регистрация</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Отслеживайте заказы, сохраняйте избранные украшения и быстро оформляйте покупки.
          </p>
        </div>

        <RegisterForm prefillEmail={email} />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/account/login" className="text-foreground underline-offset-4 hover:underline">
            Войти
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
