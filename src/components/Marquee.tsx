import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, mq } from '../lib/gsap'

const items = ['Organic dragon fruit', 'Grown at Keisha Agro Farm', 'Enquire direct from the farm', 'Soil to slice']

function Dot() {
  return (
    <svg viewBox="0 0 20 24" className="mx-[0.5em] inline-block h-[0.55em] w-auto align-middle" aria-hidden>
      <ellipse cx="10" cy="13" rx="9" ry="11" fill="#F7F3E9" />
      <ellipse cx="10" cy="13" rx="6" ry="8" fill="#173D2C" />
    </svg>
  )
}

/** Magenta ticker; reverses direction with scroll direction. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>('.marquee-track')
      if (!track) return
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        const anims = track.getAnimations()
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => anims.forEach((a) => (a.playbackRate = self.direction === 1 ? 1 : -1)),
        })
        return () => st.kill()
      })
    },
    { scope: root },
  )
  const row = (
    <div className="flex shrink-0 items-center pr-[0.5em]">
      {items.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap">
          {t}
          <Dot />
        </span>
      ))}
    </div>
  )
  return (
    <div ref={root} className="relative z-10 -rotate-[1.2deg] overflow-hidden bg-pitaya py-4 text-ivory">
      <p className="sr-only">Organic dragon fruit, grown at Keisha Agro Farm.</p>
      <div aria-hidden className="marquee-track display flex w-max text-[clamp(2rem,4.6vw,4rem)]">
        {row}
        {row}
      </div>
    </div>
  )
}
