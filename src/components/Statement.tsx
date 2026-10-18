import { useRef } from 'react'
import { onNear } from '../lib/reveal'
import { gsap, useGSAP, mq, SplitText } from '../lib/gsap'
import { Halftone } from './Halftone'
import { Button } from './Button'

/** Forest band with halftone; words ink themselves in as you scroll. */
export function Statement() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          SplitText.create(root.current!.querySelector('[data-words]')!, {
            type: 'words',
            aria: 'none',
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.16 },
                {
                  opacity: 1,
                  stagger: 0.1,
                  ease: 'none',
                  scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 45%', scrub: true },
                },
              ),
          })
          gsap.from('[data-st-cta]', {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: '[data-st-cta]', start: 'top 92%', once: true },
          })
        })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-label="Brand statement" className="relative overflow-hidden bg-forest px-[4vw] py-[18vh] text-ivory">
      <Halftone dot="rgba(139,166,106,0.32)" />
      <div className="relative mx-auto max-w-[1400px] text-center">
        <p data-words className="display text-[clamp(3rem,8.4vw,8.6rem)] !leading-[0.92]">
          Vivid outside. Vivid within. Grown to be <span className="text-pitaya">remembered.</span>
        </p>
        <div data-st-cta className="mt-12 flex justify-center">
          <Button href="#fruit" variant="pitaya">
            Meet the fruit
          </Button>
        </div>
      </div>
    </section>
  )
}
