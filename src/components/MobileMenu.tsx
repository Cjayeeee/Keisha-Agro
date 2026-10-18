import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { gsap, useGSAP, ease } from '../lib/gsap'
import { contact, nav, socials } from '../content'
import { isPlaceholder } from '../lib/util'
import { Logo } from './Logo'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: 'visible' })
        .fromTo(root.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: ease.inOut })
        .from('[data-mm-link]', { yPercent: 110, duration: 0.8, ease: ease.out, stagger: 0.06 }, 0.35)
        .from('[data-mm-meta]', { autoAlpha: 0, y: 12, duration: 0.6, ease: ease.soft, stagger: 0.05 }, 0.55)
    },
    { scope: root },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      tl.current.timeScale(1).play()
      root.current?.querySelector<HTMLButtonElement>('[data-close]')?.focus()
    } else tl.current.timeScale(1.6).reverse()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-[60] flex flex-col bg-forest px-[6vw] pb-8 pt-5 text-ivory lg:hidden"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <div className="flex h-[72px] items-center justify-between">
        <Logo light />
        <button data-close type="button" onClick={onClose} className="grid h-12 w-12 place-items-center" aria-label="Close menu">
          <X className="size-7" />
        </button>
      </div>
      <ul className="mt-10 flex flex-col gap-1">
        {nav.map((n, i) => (
          <li key={n.href} className="overflow-hidden">
            <a data-mm-link href={n.href} onClick={onClose} className="flex items-baseline gap-4 py-1">
              <span className="font-sans text-xs text-leaf">0{i + 1}</span>
              <span className="display text-[clamp(3.2rem,14vw,5.5rem)]">{n.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3 text-sm text-ivory/70">
        {!isPlaceholder(contact.email) && (
          <a data-mm-meta href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        )}
        <div data-mm-meta className="flex gap-5">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="u-link">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
