import { gsap, SplitText, ScrollTrigger, ease } from './gsap'

/**
 * Masked line reveal for headings. Returns nothing; cleanup is handled by
 * the surrounding useGSAP/matchMedia context (SplitText reverts with it).
 */
export function revealLines(el: Element | null, opts: { trigger?: Element | null; delay?: number; start?: string } = {}) {
  if (!el) return
  const target = el as HTMLElement
  // autoSplit re-splits after web fonts load / on resize; the reveal itself only ever plays once.
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      if (target.dataset.revealed) return
      return gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.1,
        ease: ease.out,
        stagger: 0.08,
        delay: opts.delay ?? 0,
        scrollTrigger: { trigger: opts.trigger ?? el, start: opts.start ?? 'top 85%', once: true },
        onComplete: () => {
          target.dataset.revealed = '1'
        },
      })
    },
  })
}

/** Simple fade + rise for supporting copy. */
export function revealFade(targets: gsap.TweenTarget, trigger: Element | null, stagger = 0.08) {
  gsap.from(targets, {
    y: 24,
    autoAlpha: 0,
    duration: 0.9,
    ease: ease.soft,
    stagger,
    scrollTrigger: { trigger, start: 'top 85%', once: true },
  })
}

/** Clip-path image reveal (bottom → top) with a gentle inner scale. */
export function revealImage(frame: Element | null, delay = 0) {
  if (!frame) return
  const inner = frame.querySelector('[data-inner]')
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true }, delay })
  tl.from(frame, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: ease.inOut })
  if (inner) tl.from(inner, { scale: 1.25, duration: 1.6, ease: ease.out }, 0)
}

/**
 * Build a section's animations only when it comes within ~1 screen of the
 * viewport. Spreads setup cost across the scroll instead of the first load
 * (keeps Total Blocking Time low). Animations are recorded in `ctx` so they
 * are still reverted on unmount / media-query change.
 */
export function onNear(ctx: gsap.Context, trigger: Element | null | undefined, build: () => void) {
  if (!trigger) return
  ScrollTrigger.create({
    trigger,
    start: 'top bottom+=100%',
    once: true,
    onEnter: () => ctx.add(build),
  })
}
