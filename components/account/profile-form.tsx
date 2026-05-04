"use client"

import { useState } from "react"
import { updateProfile, changePassword } from "@/app/actions/account"

type Props = {
  fullName: string
  phone: string
  email: string
}

export function ProfileForm({ fullName, phone, email }: Props) {
  const [name, setName] = useState(fullName)
  const [phoneVal, setPhone] = useState(phone)
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [passLoading, setPassLoading] = useState(false)

  async function onProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg(null)
    const result = await updateProfile({ full_name: name, phone: phoneVal })
    setProfileMsg(result.ok ? { ok: true, text: "Сохранено" } : { ok: false, text: result.error })
    setProfileLoading(false)
  }

  async function onPassSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (next !== confirm) {
      setPassMsg({ ok: false, text: "Пароли не совпадают" })
      return
    }
    setPassLoading(true)
    setPassMsg(null)
    const result = await changePassword({ current, next })
    if (result.ok) {
      setPassMsg({ ok: true, text: "Пароль изменён" })
      setCurrent("")
      setNext("")
      setConfirm("")
    } else {
      setPassMsg({ ok: false, text: result.error })
    }
    setPassLoading(false)
  }

  return (
    <div className="space-y-16">
      <form onSubmit={onProfileSubmit} className="space-y-6 max-w-lg">
        <h2 className="font-serif text-2xl">Личные данные</h2>
        <label className="block">
          <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Имя</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Email</span>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Телефон</span>
          <input
            type="tel"
            value={phoneVal}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 ..."
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
          />
        </label>
        {profileMsg && (
          <p className={`text-sm ${profileMsg.ok ? "text-foreground" : "text-destructive"}`}>{profileMsg.text}</p>
        )}
        <button
          type="submit"
          disabled={profileLoading}
          className="bg-foreground px-8 py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {profileLoading ? "Сохраняем..." : "Сохранить"}
        </button>
      </form>

      <div className="border-t border-border/60 pt-10">
        <form onSubmit={onPassSubmit} className="space-y-6 max-w-lg">
          <h2 className="font-serif text-2xl">Изменить пароль</h2>
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Текущий пароль</span>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Новый пароль</span>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Повторите пароль</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          {passMsg && (
            <p className={`text-sm ${passMsg.ok ? "text-foreground" : "text-destructive"}`}>{passMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={passLoading}
            className="bg-foreground px-8 py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {passLoading ? "Сохраняем..." : "Изменить пароль"}
          </button>
        </form>
      </div>
    </div>
  )
}
