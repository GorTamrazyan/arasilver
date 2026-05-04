import Link from "next/link"
import { ResetPasswordForm } from "@/components/account/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em]">
            ARASILVER
          </Link>
          <p className="mt-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl">Новый пароль</h1>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  )
}
