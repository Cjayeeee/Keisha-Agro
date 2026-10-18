type Props = { dot?: string; mask?: string; className?: string }
/** Halftone dot texture layer. Decorative only. */
export function Halftone({ dot, mask, className = '' }: Props) {
  return <div aria-hidden className={`halftone ${className}`} style={{ ['--dot' as string]: dot, ['--mask' as string]: mask }} />
}
