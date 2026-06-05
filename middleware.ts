import createMiddleware from "next-intl/middleware"
import { type NextRequest } from "next/server"
import { routing } from "@/i18n/routing"
import { updateSession } from "@/lib/supabase/proxy"

const intlMiddleware = createMiddleware(routing)

/**
 * Paths that need Supabase session refresh + auth gating. Anything else (home,
 * shop, product, checkout, etc.) goes through ONLY next-intl middleware and
 * skips the Supabase round-trip — saving ~80–250 ms per navigation.
 *
 * The cart on public pages is client-side, so it doesn't need a refreshed
 * server session to render. The signed-in dropdown in the header refreshes
 * itself via the client SDK.
 */
const PROTECTED_PREFIXES = ["/account", "/admin"]

function isProtected(barePath: string) {
  return PROTECTED_PREFIXES.some((p) => barePath === p || barePath.startsWith(p + "/"))
}

export async function middleware(request: NextRequest) {
  // Let next-intl decide on locale prefix / redirects first.
  const response = intlMiddleware(request)

  // If next-intl already issued a redirect (e.g. add locale prefix), short-
  // circuit; the next hop will go through middleware again.
  if (response.headers.get("location")) return response

  // Strip locale prefix so the protected check is locale-agnostic.
  const segments = request.nextUrl.pathname.split("/").filter(Boolean)
  const maybeLocale = segments[0]
  const hasLocale = (routing.locales as readonly string[]).includes(maybeLocale)
  const barePath = hasLocale ? "/" + segments.slice(1).join("/") : request.nextUrl.pathname
  const localePrefix = hasLocale ? `/${maybeLocale}` : `/${routing.defaultLocale}`

  // Public path → done. No Supabase call.
  if (!isProtected(barePath)) return response

  // Protected path → refresh session and enforce auth.
  return await updateSession(request, response, barePath, localePrefix)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
