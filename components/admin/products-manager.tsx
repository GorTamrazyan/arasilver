"use client"

import Image from "next/image"
import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react"
import { deleteProduct, upsertProduct, type ProductInput } from "@/app/actions/admin"
import { uploadProductImage } from "@/app/actions/images"
import { formatPrice } from "@/lib/format"
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/types"

const CATEGORIES: ProductCategory[] = ["rings", "earrings", "pendants", "bracelets", "necklaces"]

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [editing, setEditing] = useState<Product | "new" | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function onDelete(id: string) {
    if (!confirm("Удалить товар? Это действие нельзя отменить.")) return
    startTransition(async () => {
      await deleteProduct(id)
      router.refresh()
    })
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Новый товар
        </button>
      </div>

      {initialProducts.length === 0 ? (
        <div className="border border-border bg-secondary/20 p-16 text-center">
          <p className="font-serif text-2xl italic text-muted-foreground">Нет товаров</p>
          <p className="mt-3 text-sm text-muted-foreground">Добавьте первое украшение в каталог.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialProducts.map((p) => (
            <article key={p.id} className="flex gap-4 border border-border bg-background p-4">
              <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-muted">
                {p.image_url && (
                  <Image src={p.image_url || "/placeholder.svg"} alt={p.name} fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                    {CATEGORY_LABELS[p.category]}
                  </p>
                  <h3 className="mt-1 font-serif text-lg leading-tight">{p.name}</h3>
                  <p className="mt-2 text-sm tabular-nums">{formatPrice(Number(p.price), p.currency)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Остаток: {p.stock}
                    {!p.is_active && <span className="ml-2 text-destructive">· Скрыт</span>}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase hover:border-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                    Править
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "")
  const [imgUploading, setImgUploading] = useState(false)
  const imgInputRef = useRef<HTMLInputElement>(null)

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append("file", file)
    const res = await uploadProductImage(fd)
    if (res.ok) setImageUrl(res.url)
    else setError(res.error)
    setImgUploading(false)
    if (imgInputRef.current) imgInputRef.current.value = ""
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const input: ProductInput = {
      id: product?.id,
      slug: String(fd.get("slug") ?? "").trim(),
      name: String(fd.get("name") ?? "").trim(),
      category: String(fd.get("category")) as ProductCategory,
      description: String(fd.get("description") ?? ""),
      price: Number(fd.get("price") ?? 0),
      image_url: String(fd.get("image_url") ?? ""),
      material: String(fd.get("material") ?? "925 Sterling Silver"),
      stock: Number(fd.get("stock") ?? 0),
      is_active: fd.get("is_active") === "on",
    }
    const res = await upsertProduct(input)
    if (res.ok) {
      onSaved()
    } else {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm">
      <div className="mt-10 w-full max-w-2xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-2xl">{product ? "Редактировать товар" : "Новый товар"}</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Название" name="name" defaultValue={product?.name} required />
            <Input label="Slug (URL)" name="slug" defaultValue={product?.slug} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Категория</span>
              <select
                name="category"
                defaultValue={product?.category ?? "rings"}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Цена (USD)" name="price" type="number" step="0.01" defaultValue={product?.price?.toString()} required />
            <Input label="Остаток" name="stock" type="number" defaultValue={product?.stock?.toString() ?? "0"} required />
          </div>
          <div className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Фото товара</span>
            <div className="flex items-start gap-4">
              <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-muted">
                {imageUrl && <Image src={imageUrl} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={imgInputRef} type="file" accept="image/*" onChange={onImageFile} className="hidden" />
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={imgUploading}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-foreground disabled:opacity-60"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {imgUploading ? "Загружаем..." : "Загрузить фото"}
                </button>
                <input
                  type="text"
                  name="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="или вставьте URL"
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
          <Input label="Материал" name="material" defaultValue={product?.material ?? "925 Sterling Silver"} />
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Описание</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? product.is_active : true}
              className="h-4 w-4 accent-foreground"
            />
            Показывать в каталоге
          </label>

          {error && (
            <div className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-foreground px-6 py-3 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Input({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  step,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string | number
  placeholder?: string
  step?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={step}
        className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
      />
    </label>
  )
}
