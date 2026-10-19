import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, ease } from '../lib/gsap'
import { brand, nav } from '../content'
import { Logo } from './Logo'
import { Button } from './Button'
import { MobileMenu } from './MobileMenu'

export function Header({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  // Hide on scroll down, reveal on scroll up.
  useGSAP(() => {
    const bar = root.current
    if (!bar) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const y = self.scroll()
        setSolid(y > 40)
        if (open) return
        if (y > 400 && self.direction === 1) gsap.to(bar, { yPercent: -100, duration: 0.5, ease: 'power3.out', overwrite: true })
        else if (self.direction === -1 || y < 400) gsap.to(bar, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: true })
      },
    })
    return () => st.kill()
  }, [open])

  // Entrance: primed on mount (hidden under the preloader), played when ready
  const intro = useRef<gsap.core.Timeline | null>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready
  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        intro.current = gsap.timeline({ paused: true }).from('[data-nav-in]', {
          yPercent: -120,
          autoAlpha: 0,
          duration: 1,
          ease: ease.out,
          stagger: 0.06,
          delay: 0.35,
        })
        if (readyRef.current) intro.current.play()
      })
    },
    { scope: root },
  )

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header ref={root} className="fixed inset-x-0 top-0 z-50">
        <div className="relative bg-ink text-ivory">
          <p className="mx-auto flex h-8 items-center justify-center gap-3 px-4 text-center text-[12px] tracking-wide">
            <span className="truncate">{brand.tagline}</span>
            <a href="#enquire" className="u-link hidden shrink-0 font-semibold underline-offset-4 sm:inline">
              Enquire now
            </a>
          </p>
        </div>
        <div
          className={`transition-[background-color,box-shadow] duration-500 ${solid ? 'bg-ivory/92 shadow-[0_1px_0_rgba(23,27,23,0.08)] backdrop-blur-md' : 'bg-transparent'}`}
        >
          <nav aria-label="Primary" className="flex h-[72px] items-center justify-between px-[4vw]">
            <div className="flex items-center gap-8">
              <a href="#top" data-nav-in>
                <Logo />
              </a>
              <span aria-hidden data-nav-in className="hidden h-8 w-px bg-ink/15 lg:block" />
              <ul className="hidden items-center gap-8 lg:flex">
                {nav.map((n) => (
                  <li key={n.href} data-nav-in>
                    <a href={n.href} className="u-link text-[15px] text-ink/70 transition-colors hover:text-ink">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-nav-in className="hidden lg:block">
              <Button href="#enquire">Get in touch</Button>
            </div>
            <button
              data-nav-in
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-12 w-12 place-items-center lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="flex w-7 flex-col gap-[7px]">
                <span className="h-[2px] w-full bg-ink" />
                <span className="h-[2px] w-2/3 self-end bg-ink" />
              </span>
            </button>
          </nav>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
