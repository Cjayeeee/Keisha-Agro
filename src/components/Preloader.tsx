import { useRef } from 'react'
import { gsap, useGSAP, ease } from '../lib/gsap'
import { DragonFruit } from './DragonFruit'

/**
 * Short brand intro (~1.5s). Shown once per session; skipped entirely for
 * reduced-motion users. Content underneath is already rendered & usable.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ onComplete: onDone })
      tl.from('[data-pl-fruit]', { scale: 0.2, rotate: -60, autoAlpha: 0, duration: 0.9, ease: ease.out })
        .from('[data-pl-char]', { yPercent: 110, duration: 0.8, ease: ease.out, stagger: 0.04 }, 0.15)
        .to('[data-pl-bar]', { scaleX: 1, duration: 0.9, ease: ease.inOut }, 0.1)
        .to('[data-pl-fruit]', { scale: 14, duration: 0.9, ease: 'power4.in' }, 1.0)
        .to('[data-pl-char]', { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.02 }, 1.0)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: ease.inOut }, 1.35)
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-forest text-ivory"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="flex flex-col items-center gap-6">
        <div data-pl-fruit className="w-16">
          <DragonFruit view="cut" flesh="white" shadow={false} title="" />
        </div>
        <div className="flex overflow-hidden font-sans text-4xl font-[800] tracking-[-0.055em]">
          {'keisha'.split('').map((c, i) => (
            <span key={i} data-pl-char className="inline-block">
              {c}
            </span>
          ))}
        </div>
        <div className="h-px w-40 bg-ivory/20">
          <div data-pl-bar className="h-full origin-left scale-x-0 bg-pitaya" />
        </div>
      </div>
    </div>
  )
}
