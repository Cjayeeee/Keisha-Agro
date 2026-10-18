import { useRef } from 'react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealFade, revealImage, revealLines, onNear } from '../lib/reveal'
import { photos } from '../content'
import { Photo } from './Photo'

export function Intro() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          const q = gsap.utils.selector(root)
          revealLines(q('[data-title]')[0])
          revealFade(q('[data-fade]'), q('[data-copy]')[0])
          q('[data-reveal]').forEach((el, i) => revealImage(el, i * 0.15))
          q('[data-par]').forEach((el) => {
            gsap.fromTo(
              el.querySelector('[data-inner]'),
              { yPercent: -6 },
              { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          })
          gsap.to(q('[data-float]'), {
            yPercent: -35,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="intro" aria-labelledby="intro-title" className="relative px-[4vw] pb-[14vh] pt-[18vh]">
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65 lg:col-span-2">
          <span className="font-display text-2xl tracking-normal text-ink/60">Ø1</span> Who we are
        </p>
        <h2 id="intro-title" data-title className="display text-[clamp(3.4rem,9vw,9.5rem)] lg:col-span-10">
          A farm devoted to one <span className="serif-i text-pitaya">remarkable</span> fruit.
        </h2>
      </div>

      <div className="mt-[10vh] grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="relative lg:col-span-5 lg:col-start-2">
          <div data-reveal data-par>
            <Photo shot={photos.farm[0]} tone="forest" motif="whole" className="aspect-[4/5] w-full" />
          </div>
          <div data-float className="absolute -bottom-10 -right-2 w-[42%] sm:-right-12 lg:-right-20">
            <div data-reveal>
              <Photo shot={photos.strip[2]} tone="pitaya" motif="cut" className="aspect-square w-full ring-8 ring-ivory" />
            </div>
          </div>
        </div>
        <div data-copy className="flex flex-col justify-end gap-6 pt-10 lg:col-span-4 lg:col-start-9 lg:pt-0">
          <p data-fade className="text-[1.35rem] leading-snug text-ink md:text-2xl">
            Keisha Agro Farm grows organic dragon fruits and sells them directly to the people who eat, cook with and stock them.
          </p>
          <p data-fade className="leading-relaxed text-mute">
            [Add two or three sentences in your own words: when the farm started, where it is, and why you chose to grow dragon fruit.]
          </p>
          <a data-fade href="#farm" className="u-link w-fit font-display text-xl uppercase">
            Read the farm story →
          </a>
        </div>
      </div>
    </section>
  )
}
