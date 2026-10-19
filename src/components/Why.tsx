import { useRef } from 'react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealLines, onNear } from '../lib/reveal'
import { reasons } from '../content'
import { Halftone } from './Halftone'

export function Why() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          q('[data-reason]').forEach((r, i) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 85%', once: true }, delay: (i % 2) * 0.12 })
            tl.from(r.querySelector('[data-line]'), { scaleX: 0, duration: 1.1, ease: 'power4.inOut' })
              .from(r.querySelector('[data-num]'), { yPercent: 100, duration: 1.1, ease: 'expo.out' }, 0.15)
              .from(r.querySelectorAll('[data-wtxt]'), { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.3)
          })
        })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-labelledby="why-title" className="relative overflow-hidden bg-sand px-[4vw] py-[16vh]">
      <Halftone dot="rgba(229,45,114,0.16)" mask="radial-gradient(ellipse at 85% 10%, #000, transparent 55%)" />
      <div className="relative grid gap-8 lg:grid-cols-12">
        <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65 lg:col-span-2">
          <span className="font-display text-2xl tracking-normal text-ink/60">Ø6</span> Why Keisha
        </p>
        <h2 id="why-title" data-title className="display text-[clamp(3.4rem,9vw,9.5rem)] lg:col-span-10">
          Grown here. <span className="serif-i text-pitaya">Sold straight.</span>
        </h2>
      </div>
      <ul className="relative mt-[10vh] grid gap-x-10 gap-y-16 md:grid-cols-2 lg:pl-[16.6%]">
        {reasons.map((r) => (
          <li key={r.no} data-reason className="relative pt-8">
            <span data-line aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20" />
            <div className="flex items-start gap-6">
              <span className="overflow-hidden">
                <span data-num aria-hidden className="display outline-text block text-[clamp(4.5rem,8vw,7.5rem)] text-pitaya">
                  {r.no}
                </span>
              </span>
              <div className="pt-2">
                <h3 data-wtxt className="display text-[clamp(1.9rem,2.8vw,2.8rem)] !leading-[1.06]">
                  {r.title}
                </h3>
                <p data-wtxt className="mt-3 max-w-sm leading-relaxed text-mute">
                  {r.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
