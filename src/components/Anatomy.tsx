import { useRef } from 'react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { anatomy } from '../content'
import { DragonFruit } from './DragonFruit'

const panelTone = ['bg-forest text-ivory', 'bg-sand text-ink', 'bg-leaf text-ink']
const numTone = ['text-leaf', 'text-pitaya', 'text-forest-deep/60']

/**
 * Horizontal storytelling on desktop (pinned, scrubbed). The row layout is
 * applied by the same media query in CSS, so there is no layout jump on init.
 * On tablet/mobile and for reduced motion it is a normal vertical stack.
 */
export function Anatomy() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)

      mm.add(mq.desktop, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        gsap.to(q('[data-progress]'), {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
        q('[data-panel]').forEach((panel) => {
          const art = panel.querySelector('[data-art]')
          const txt = panel.querySelectorAll('[data-ptxt]')
          if (art)
            gsap.fromTo(
              art,
              { rotate: -25, scale: 0.75 },
              {
                rotate: 15,
                scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
              },
            )
          gsap.from(txt, {
            y: 60,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 65%' },
          })
        })
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        q('[data-panel]').forEach((panel) => {
          gsap.from(panel.querySelectorAll('[data-ptxt], [data-art]'), {
            y: 40,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
          })
        })
      })

      mm.add(mq.motion, () => revealLines(q('[data-title]')[0]))
    },
    { scope: root },
  )

  return (
    <section ref={root} id="fruit" aria-labelledby="fruit-title" data-cursor="Scroll" className="anat relative overflow-hidden bg-ivory">
      <div ref={track} className="anat-track flex flex-col">
        {/* Intro panel */}
        <div className="anat-panel anat-intro flex flex-col justify-between gap-16 px-[4vw] py-[14vh]">
          <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65">
            <span className="font-display text-2xl tracking-normal text-ink/60">Ø2</span> The fruit
          </p>
          <h2 id="fruit-title" data-title className="display text-[clamp(4rem,11vw,12rem)]">
            The fruit,
            <br />
            <span className="serif-i text-pitaya">up close.</span>
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-mute">
            Dragon fruit, also called pitaya, grows on a climbing cactus. Three details make it unlike any other fruit.
            <span className="mt-4 hidden items-center gap-3 font-display text-base uppercase text-ink lg:flex">
              Keep scrolling <span aria-hidden>→</span>
            </span>
          </p>
        </div>

        {anatomy.map((a, i) => (
          <article key={a.no} data-panel className={`anat-panel relative flex flex-col justify-between overflow-hidden px-[6vw] py-[12vh] lg:px-[4vw] ${panelTone[i]}`}>
            <span data-ptxt aria-hidden className={`display outline-text text-[clamp(7rem,16vw,17rem)] ${numTone[i]}`}>
              {a.no}
            </span>
            <div data-art className="pointer-events-none my-8 flex justify-center lg:absolute lg:right-[4vw] lg:top-1/2 lg:my-0 lg:h-[64vh] lg:-translate-y-1/2">
              <DragonFruit
                view={a.view}
                flesh="red"
                seed={20 + i}
                shadow={false}
                className="h-[44vh] w-auto max-w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)] lg:h-full"
              />
            </div>
            <div className="relative max-w-[26rem]">
              <h3 data-ptxt className="display text-[clamp(2.6rem,4.6vw,4.6rem)] !leading-[1.15]">
                {a.title}
              </h3>
              <p data-ptxt className="mt-5 text-[1.05rem] leading-relaxed opacity-80">
                {a.body}
              </p>
            </div>
          </article>
        ))}

        {/* Outro panel */}
        <div className="anat-panel anat-outro flex flex-col justify-end bg-ink px-[6vw] py-[12vh] text-ivory lg:px-[4vw]">
          <p className="display text-[clamp(4rem,9vw,9rem)]">
            Now,
            <br />
            <span className="serif-i text-pitaya">ours.</span>
          </p>
          <a href="#product" className="u-link mt-8 w-fit font-display text-xl uppercase">
            See what we grow →
          </a>
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-[4vw] bottom-6 hidden h-px bg-ink/10 lg:block">
        <div data-progress className="h-full origin-left scale-x-0 bg-pitaya" />
      </div>
    </section>
  )
}
