/** Typographic wordmark — PLACEHOLDER until the real Keisha Agro Farm logo is supplied. */
export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span role="img" aria-label="Keisha Agro Farm" className={`inline-flex items-end gap-2 leading-none ${light ? 'text-ivory' : 'text-ink'} ${className}`}>
      <span className="relative font-sans text-[1.65rem] font-[800] tracking-[-0.055em]">
        ke
        <span className="relative">
          ı
          <span aria-hidden className="absolute left-1/2 top-[0.05em] size-[0.24em] -translate-x-1/2 rounded-full bg-pitaya" />
        </span>
        sha
      </span>
      <span className="mb-[0.28rem] font-sans text-[0.55rem] font-semibold uppercase leading-[1.05] tracking-[0.2em] opacity-70">
        Agro
        <br />
        Farm
      </span>
    </span>
  )
}
