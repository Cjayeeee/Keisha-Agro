import { useRef } from 'react'
import { gsap, useGSAP, mq, ScrollTrigger } from '../lib/gsap'
import { revealLines, onNear } from '../lib/reveal'
import { farmStory, photos } from '../content'
import { Photo } from './Photo'

const tones = ['forest', 'leaf', 'pitaya'] as const

/** Sticky photo frame (desktop) whose image wipes to the next chapter as you read. */
export function FarmStory() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.desktop, (ctx) => {
        onNear(ctx, root.current, () => {
          const frames = q('[data-frame]')
          const chapters = q('[data-chapter]')
          frames.forEach((f, i) => {
            if (i === 0) return
            gsap.fromTo(
              f,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'none',
                scrollTrigger: { trigger: chapters[i], start: 'top 80%', end: 'top 30%', scrub: true },
              },
            )
            gsap.fromTo(
              f.querySelector('[data-inner]'),
              { scale: 1.3 },
              { scale: 1, ease: 'none', scrollTrigger: { trigger: chapters[i], start: 'top 80%', end: 'top 30%', scrub: true } },
            )
          })
          chapters.forEach((c, i) => {
            ScrollTrigger.create({
              trigger: c,
              start: 'top 55%',
              end: 'bottom 55%',
              onToggle: (self) => {
                if (self.isActive) q('[data-count]')[0].textContent = `0${i + 1}`
              },
            })
          })
        })
      })
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          q('[data-chapter]').forEach((c) => {
            gsap.from(c.querySelectorAll('[data-ctxt]'), {
              y: 40,
              autoAlpha: 0,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: c, start: 'top 75%', once: true },
            })
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="farm" aria-labelledby="farm-title" className="relative bg-forest text-ivory">
      <div className="px-[4vw] pb-[8vh] pt-[16vh]">
        <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/70">
          <span className="font-display text-2xl tracking-normal text-ivory/60">Ø5</span> The farm
        </p>
        <h2 id="farm-title" data-title className="display mt-6 max-w-[14ch] text-[clamp(3.4rem,9vw,9.5rem)]">
          Rooted in <span className="serif-i text-pitaya">one place.</span>
        </h2>
      </div>

      <div className="grid px-[4vw] pb-[16vh] lg:grid-cols-12 lg:gap-x-10">
        {/* Sticky frame (desktop) */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[14vh] h-[72vh]">
            {photos.farm.map((s, i) => (
              <div key={i} data-frame className="absolute inset-0" style={{ zIndex: i }}>
                <Photo shot={s} tone={tones[i]} motif={i === 2 ? 'whole' : false} className="h-full w-full" />
              </div>
            ))}
            <p className="absolute -bottom-10 left-0 font-display text-xl" aria-hidden>
              <span data-count>01</span>
              <span className="text-ivory/60"> / 0{photos.farm.length}</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          {farmStory.map((c, i) => (
            <article key={c.kicker} data-chapter className="flex flex-col justify-center gap-6 border-t border-ivory/15 py-14 lg:min-h-[80vh] lg:py-0">
              <Photo shot={photos.farm[i]} tone={tones[i]} className="aspect-[4/3] w-full lg:hidden" />
              <p data-ctxt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf">
                0{i + 1} / {c.kicker}
              </p>
              <h3 data-ctxt className="display text-[clamp(2.8rem,5vw,5rem)] !leading-[1.04]">
                {c.title}
              </h3>
              <p data-ctxt className="max-w-md text-lg leading-relaxed text-ivory/75">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
