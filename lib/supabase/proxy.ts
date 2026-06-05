import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Refreshes the Supabase session on top of an existing response (typically the
 * one returned by next-intl's middleware), then applies auth rules for
 * `/admin` and `/account`. The caller passes:
 *   - `response`: the response next-intl already built (cookies are attached to it)
 *   - `barePath`: pathname with the locale prefix stripped (e.g. "/admin/login")
 *   - `localePrefix`: locale prefix to keep when redirecting (e.g. "/ru")
 *
 * Returns either the (possibly cookie-mutated) `response` or a redirect.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
  barePath: string,
  localePrefix: string,
): Promise<NextResponse> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  const isAdminPublic =
    barePath.startsWith("/admin/login") || barePath.startsWith("/admin/sign-up")

  if (barePath.startsWith("/admin") && !isAdminPublic) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/admin/login`
      return NextResponse.redirect(url)
    }
    const isAdmin = user.user_metadata?.is_admin === true
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/admin/login`
      url.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(url)
    }
  }

  // Protect account routes
  const isAccountPublic =
    barePath.startsWith("/account/login") ||
    barePath.startsWith("/account/register") ||
    barePath.startsWith("/account/forgot-password") ||
    barePath.startsWith("/account/reset-password")

  if (barePath.startsWith("/account") && !isAccountPublic) {
    if (!user) {
      const url = request.nextUrl.clone()
      const next = request.nextUrl.pathname + request.nextUrl.search
      url.pathname = `${localePrefix}/account/login`
      url.searchParams.set("next", next)
      return NextResponse.redirect(url)
    }
  }

  return response
}
