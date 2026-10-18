import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { onNear } from '../lib/reveal'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { brand, contact, nav, socials } from '../content'
import { isPlaceholder } from '../lib/util'
import { Halftone } from './Halftone'
import { Button } from './Button'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          gsap.from(q('[data-wm]'), {
            yPercent: 100,
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: { trigger: q('[data-wordmark]')[0], start: 'top 95%', once: true },
          })
          gsap.from(q('[data-wm-dot]'), {
            scale: 0,
            rotate: -180,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.5,
            scrollTrigger: { trigger: q('[data-wordmark]')[0], start: 'top 95%', once: true },
          })
          gsap.from(q('[data-ffade]'), {
            y: 24,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  const year = new Date().getFullYear()
  const head = 'mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45'

  return (
    <footer ref={root} className="relative overflow-hidden bg-ivory pt-[12vh]">
      <Halftone dot="rgba(229,45,114,0.22)" mask="linear-gradient(180deg, transparent, #000 40%, transparent 85%)" />
      <div className="relative grid gap-12 px-[4vw] lg:grid-cols-12">
        <div data-ffade className="lg:col-span-6">
          <p className="display text-[clamp(2.6rem,3.8vw,4rem)]">
            Ready when <span className="serif-i text-pitaya">the fruit is.</span>
          </p>
          <p className="mt-4 max-w-sm text-mute">{brand.tagline}</p>
          <div className="mt-8">
            <Button href="#enquire">Enquire now</Button>
          </div>
        </div>
        <nav data-ffade aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
          <p className={head}>Explore</p>
          <ul className="flex flex-col gap-2">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="u-link font-display text-2xl uppercase">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-ffade className="lg:col-span-2">
          <p className={head}>Contact</p>
          <ul className="flex flex-col gap-2 text-[15px]">
            <li>{isPlaceholder(contact.email) ? <span className="text-ink/60">{contact.email}</span> : <a className="u-link" href={`mailto:${contact.email}`}>{contact.email}</a>}</li>
            <li>{isPlaceholder(contact.phone) ? <span className="text-ink/60">{contact.phone}</span> : <a className="u-link" href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>}</li>
            <li className={isPlaceholder(contact.location) ? 'text-ink/60' : ''}>{contact.location}</li>
          </ul>
        </div>
        <div data-ffade className="lg:col-span-2">
          <p className={head}>Follow</p>
          <ul className="flex flex-col gap-2 text-[15px]">
            {socials.map((s) => (
              <li key={s.label}>
                <a className="u-link" href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-[10vh] flex flex-col gap-4 px-[4vw] text-[13px] text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {brand.name}. All rights reserved.
        </p>
        <a href="#top" className="group inline-flex items-center gap-2 text-ink">
          Back to top
          <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden />
        </a>
      </div>

      {/* Giant closing wordmark */}
      <div data-wordmark aria-hidden className="relative mt-6 flex justify-center overflow-hidden px-[2vw] pt-[4vw] leading-[0.78]">
        <span className="flex font-sans text-[29vw] font-[800] tracking-[-0.07em] text-ink">
          {'ke'.split('').map((c, i) => (
            <span key={i} data-wm className="inline-block">
              {c}
            </span>
          ))}
          <span data-wm className="relative inline-block">
            ı
            <span data-wm-dot className="absolute left-1/2 top-[-0.035em] block size-[0.17em] -translate-x-1/2 rounded-full bg-pitaya" />
          </span>
          {'sha'.split('').map((c, i) => (
            <span key={i} data-wm className="inline-block">
              {c}
            </span>
          ))}
        </span>
      </div>
    </footer>
  )
}
