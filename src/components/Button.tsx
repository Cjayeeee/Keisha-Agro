import { useRef, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'

type Variant = 'ink' | 'pitaya' | 'ivory' | 'ghost' | 'ghost-light'

const styles: Record<Variant, string> = {
  ink: 'bg-ink text-ivory hover:bg-forest',
  pitaya: 'bg-pitaya text-ivory hover:bg-pitaya-deep',
  ivory: 'bg-ivory text-ink hover:bg-white',
  ghost: 'text-ink ring-1 ring-ink/25 hover:ring-ink',
  'ghost-light': 'text-ivory ring-1 ring-ivory/35 hover:ring-ivory',
}

type Props = {
  children: ReactNode
  href?: string
  variant?: Variant
  external?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: 'md' | 'lg'
}

/** Text-roll button: the label slides up and is replaced by a copy. */
export function Button({ children, href, variant = 'ink', external, type = 'button', onClick, disabled, className = '', size = 'md' }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  useMagnetic(ref, 0.22)
  const Icon = external ? ArrowUpRight : ArrowRight
  const pad = size === 'lg' ? 'h-16 px-8 text-[1.35rem]' : 'h-13 px-6 text-[1.08rem]'
  const cls = `group relative inline-flex items-center gap-3 ${pad} font-display uppercase tracking-[0.01em] leading-none transition-colors duration-500 ease-[var(--ease-out-expo)] disabled:opacity-60 disabled:pointer-events-none ${styles[variant]} ${className}`
  const inner = (
    <>
      <span className="relative block overflow-hidden py-[0.12em]">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-[130%]">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-[130%] py-[0.12em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      <Icon aria-hidden className="size-[1.05em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" strokeWidth={2.2} />
    </>
  )
  if (href)
    return (
      <a ref={ref} href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={onClick}>
        {inner}
      </a>
    )
  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}
