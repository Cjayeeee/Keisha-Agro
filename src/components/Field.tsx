import { useRef } from 'react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealImage, revealLines, onNear } from '../lib/reveal'
import { photos } from '../content'
import { Photo } from './Photo'
import { Button } from './Button'

const tones = ['sand', 'forest', 'pitaya', 'leaf', 'ink', 'sand'] as const
const aspects = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-square']

/** Editorial photo wall with columns drifting at different speeds. */
export function Field() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          q('[data-reveal]').forEach((el, i) => revealImage(el, (i % 3) * 0.1))
          gsap.from(q('[data-hl]'), {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 1,
            ease: 'power4.inOut',
            delay: 0.4,
            scrollTrigger: { trigger: q('[data-title]')[0], start: 'top 80%', once: true },
          })
        })
      })
      mm.add(mq.desktop, (ctx) => {
        onNear(ctx, root.current, () => {
          q('[data-col]').forEach((col, i) => {
            gsap.fromTo(
              col,
              { yPercent: i === 1 ? 10 : 0 },
              { yPercent: i === 1 ? -10 : -4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          })
        })
      })
    },
    { scope: root },
  )

  const cols = [0, 1, 2].map((c) => photos.field.map((s, i) => ({ s, i })).filter(({ i }) => i % 3 === c))

  return (
    <section ref={root} aria-labelledby="field-title" className="relative overflow-hidden px-[4vw] py-[16vh]">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="order-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:order-1 lg:col-span-8 lg:gap-4">
          {cols.map((col, c) => (
            <div key={c} data-col className={`flex flex-col gap-3 lg:gap-4 ${c === 1 ? 'sm:pt-24' : ''} ${c === 2 ? 'hidden sm:flex' : ''}`}>
              {col.map(({ s, i }) => (
                <figure key={i}>
                  <div data-reveal>
                    <Photo shot={s} tone={tones[i]} motif={i === 2 ? 'cut' : i === 4 ? 'flower' : false} className={`${aspects[i]} w-full`} sizes="(min-width:1024px) 22vw, 45vw" />
                  </div>
                  <figcaption className="mt-2 font-display text-sm uppercase text-ink/70">{s.label}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
        <div className="order-1 lg:order-2 lg:col-span-4">
          <div className="lg:sticky lg:top-[18vh] lg:text-right">
            <h2 id="field-title" data-title className="display text-[clamp(3.2rem,5.6vw,6rem)]">
              From field to your{' '}
              <span className="relative inline-block px-[0.08em] text-ivory">
                <span data-hl aria-hidden className="absolute inset-0 -z-0 bg-pitaya" />
                <span className="relative">table.</span>
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-mute lg:ml-auto lg:max-w-sm">
              Moments from the farm, from planting day and the first flowers to the fruit on the scale.
            </p>
            <div className="mt-8 lg:flex lg:justify-end">
              <Button href="#enquire" variant="ink">
                Contact the farm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
