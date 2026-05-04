import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? null

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`)
      const { data: { user } } = await supabase.auth.getUser()
      const isAdmin = user?.user_metadata?.is_admin === true
      return NextResponse.redirect(`${origin}${isAdmin ? "/admin" : "/account"}`)
    }
  }

  return NextResponse.redirect(`${origin}/account/login?error=auth`)
}
