import { createClient } from "@/lib/supabase/server"
import { AddressesManager } from "@/components/account/addresses-manager"
import type { Address } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user!.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })

  const addresses = (data ?? []) as Address[]

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl">Адреса доставки</h2>
      <AddressesManager initialAddresses={addresses} />
    </div>
  )
}
