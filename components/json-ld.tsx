/**
 * Renders a JSON-LD structured-data block. Server component — emits a
 * <script type="application/ld+json"> that crawlers read for rich results.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // When given multiple entities, wrap them in an @graph so the emitted
  // document keeps a single top-level "@context". Emitting a bare array
  // leaves no "@context" key, which breaks consumers that read
  // parsed["@context"] (SEO extensions, structured-data parsers).
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data.map(stripContext) }
    : data

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user-controlled HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}

/** Drops a per-entity "@context" — it lives on the wrapping @graph object. */
function stripContext({ "@context": _ctx, ...rest }: Record<string, unknown>) {
  return rest
}
