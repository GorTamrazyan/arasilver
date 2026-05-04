import Link from "next/link"
import { AdminSignUpForm } from "@/components/admin/admin-sign-up-form"

export default function AdminSignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <p className="mt-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">Создать аккаунт</p>
          <h1 className="mt-3 font-serif text-4xl">Регистрация</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Первый созданный аккаунт автоматически получает права администратора.
          </p>
        </div>

        <AdminSignUpForm />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/admin/login" className="text-foreground underline-offset-4 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </main>
  )
}
