import { useRef } from 'react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealLines, onNear } from '../lib/reveal'
import { photos, process } from '../content'
import { Photo } from './Photo'

/** Numbered cultivation rows. Hover/focus floods a row with magenta and reveals its photos. */
export function Process() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          q('[data-row]').forEach((row) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } })
            tl.from(row.querySelector('[data-rule]'), { scaleX: 0, duration: 1.2, ease: 'power4.inOut' })
              .from(row.querySelectorAll('[data-rtxt]'), { yPercent: 100, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.2)
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="grow" aria-labelledby="grow-title" className="relative pb-[14vh] pt-[16vh]">
      <div className="grid gap-8 px-[4vw] lg:grid-cols-12">
        <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65 lg:col-span-2">
          <span className="font-display text-2xl tracking-normal text-ink/60">Ø4</span> How it grows
        </p>
        <h2 id="grow-title" data-title className="display text-[clamp(3.4rem,9vw,9.5rem)] lg:col-span-10">
          From cactus <span className="serif-i text-pitaya">to crate.</span>
        </h2>
      </div>

      <ol className="mt-[8vh]">
        {process.map((p) => (
          <li key={p.no} data-row className="group relative isolate">
            <span data-rule aria-hidden className="absolute inset-x-[2vw] top-0 h-px origin-left bg-ink/15" />
            <span
              aria-hidden
              className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-pitaya transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
            />
            <div className="grid items-center gap-4 px-[4vw] py-8 transition-colors duration-500 group-hover:text-ivory group-focus-visible:text-ivory lg:grid-cols-12 lg:py-10">
              <div className="flex items-start gap-3 overflow-hidden lg:col-span-6">
                <span data-rtxt className="font-display text-2xl text-ink/60 transition-colors group-hover:text-ivory/70">
                  Ø{p.no.slice(1)}
                </span>
                <h3 className="display text-[clamp(3rem,7vw,7.2rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] lg:group-hover:translate-x-4">
                  <span data-rtxt className="block">
                    {p.title}
                  </span>
                </h3>
              </div>
              {/* Photo pair — desktop hover only, decorative */}
              <div aria-hidden className="pointer-events-none hidden h-28 items-center justify-center gap-3 lg:col-span-3 lg:flex">
                {p.shots.map((s, i) => (
                  <div
                    key={i}
                    className="w-24 translate-y-6 scale-75 opacity-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                    style={{ transitionDelay: `${i * 70}ms`, rotate: i ? '7deg' : '-6deg' }}
                  >
                    <Photo shot={photos.process[s]} tone={i ? 'forest' : 'sand'} className="aspect-[3/4] w-full" sizes="96px" />
                  </div>
                ))}
              </div>
              <p data-rtxt className="max-w-md text-[1.02rem] leading-relaxed text-mute transition-colors group-hover:text-ivory group-focus-visible:text-ivory lg:col-span-3 lg:justify-self-end lg:text-right">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <span aria-hidden className="mx-[2vw] block h-px bg-ink/15" />
    </section>
  )
}
