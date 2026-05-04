import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/account/profile-form"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <ProfileForm
      fullName={user?.user_metadata?.full_name ?? ""}
      phone={user?.user_metadata?.phone ?? ""}
      email={user?.email ?? ""}
    />
  )
}
