"use client"

import { useState, useTransition } from "react"
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from "@/app/actions/account"
import type { Address, AddressInput } from "@/lib/types"

const emptyForm: AddressInput = {
  full_name: "",
  phone: "",
  street: "",
  city: "",
  country: "Россия",
  postal: null,
  is_default: false,
}

export function AddressesManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [form, setForm] = useState<AddressInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  function openEdit(addr: Address) {
    setEditing(addr)
    setForm({
      full_name: addr.full_name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      country: addr.country,
      postal: addr.postal,
      is_default: addr.is_default,
    })
    setError(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setError(null)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = editing
        ? await updateAddress(editing.id, form)
        : await addAddress(form)
      if (!result.ok) { setError(result.error); return }
      // Refresh page data after server action via reload
      window.location.reload()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    })
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      await setDefaultAddress(id)
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: a.id === id }))
      )
    })
  }

  return (
    <div className="space-y-8">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">Нет сохранённых адресов.</p>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-border p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-base">{addr.full_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{addr.street}, {addr.city}</p>
                <p className="text-sm text-muted-foreground">{addr.country}{addr.postal ? `, ${addr.postal}` : ""}</p>
                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                {addr.is_default && (
                  <span className="mt-2 inline-block text-[10px] tracking-[0.2em] text-foreground uppercase">По умолчанию</span>
                )}
              </div>
              <div className="flex flex-col gap-2 text-right shrink-0">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs tracking-[0.15em] text-muted-foreground uppercase hover:text-foreground"
                >
                  Изменить
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isPending}
                    className="text-xs tracking-[0.15em] text-muted-foreground uppercase hover:text-foreground"
                  >
                    По умолчанию
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                  className="text-xs tracking-[0.15em] text-muted-foreground uppercase hover:text-destructive"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={openAdd}
          className="border border-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          + Добавить адрес
        </button>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="space-y-6 border border-border p-8">
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {editing ? "Изменить адрес" : "Новый адрес"}
          </p>
          <Field label="Имя и фамилия" value={form.full_name} onChange={(v) => setForm((f) => ({ ...f, full_name: v }))} required />
          <Field label="Телефон" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} required />
          <Field label="Улица, дом, квартира" value={form.street} onChange={(v) => setForm((f) => ({ ...f, street: v }))} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Город" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} required />
            <Field label="Индекс" value={form.postal ?? ""} onChange={(v) => setForm((f) => ({ ...f, postal: v || null }))} />
          </div>
          <Field label="Страна" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} required />
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">Использовать по умолчанию</span>
          </label>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-foreground px-8 py-3 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Сохраняем..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-8 py-3 text-xs tracking-[0.25em] text-muted-foreground uppercase hover:text-foreground"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {label}{required && <span aria-hidden> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
      />
    </label>
  )
}
