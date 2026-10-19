import { useEffect, useRef } from 'react'
import { gsap, useGSAP, ease, mq } from '../lib/gsap'
import { brand, contact, photos } from '../content'
import { DragonFruit } from './DragonFruit'
import { Photo } from './Photo'
import { Button } from './Button'

function FilmStrip() {
  // Real farm photos only; the first two load eagerly because they're on screen at load
  const cards = photos.strip.map((shot, i) => (
    <Photo key={i} shot={shot} className="aspect-[3/4]" sizes="(min-width:1024px) 15vw, 34vw" eager={i < 2} />
  ))
  return (
    <div
      aria-hidden
      data-strip
      className="strip-mask pointer-events-none absolute right-[3vw] top-[-12%] z-0 h-[125%] w-[34vw] rotate-[7deg] overflow-hidden sm:w-[22vw] lg:right-[12vw] lg:w-[15vw]"
    >
      <div className="strip-track flex flex-col gap-3">
        {[...cards, ...cards].map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </div>
    </div>
  )
}

function Badge() {
  const text = 'ORGANIC DRAGON FRUIT · KEISHA AGRO FARM · '
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_22s_linear_infinite]" aria-hidden>
      <defs>
        <path id="badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
      </defs>
      <circle cx="60" cy="60" r="59" fill="#173D2C" />
      <text fill="#F7F3E9" fontFamily="Inter Tight Variable, sans-serif" fontSize="9.6" fontWeight="600">
        <textPath href="#badge-circle" textLength="287" lengthAdjust="spacing">{text}</textPath>
      </text>
      <circle cx="60" cy="60" r="5" fill="#E52D72" />
    </svg>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready

  // Play the (already-primed) intro the moment the preloader starts to leave.
  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        // Built paused on mount, so the hidden start state is applied
        // underneath the preloader, so the headline never flashes in full first.
        const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } })
        intro.current = tl
        if (readyRef.current) tl.play()
        tl.from('[data-char]', { yPercent: 115, duration: 1.3, stagger: 0.045 })
          .from('[data-fruit-o]', { scale: 0.1, rotate: -120, duration: 1.7 }, 0.1)
          .from('[data-to]', { yPercent: 60, autoAlpha: 0, duration: 1.1 }, 0.45)
          .from('[data-badge]', { scale: 0, duration: 1.1 }, 0.7)
          .from('[data-strip]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: ease.inOut }, 0)
          .from('[data-hero-fade]', { y: 26, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.6)
          .from('[data-hero-rule]', { scaleX: 0, duration: 1.2, ease: ease.inOut }, 0.6)

        // Scroll: lines drift apart, fruit keeps turning, strip lags behind.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to('[data-line="1"]', { xPercent: -8, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 6, ease: 'none', scrollTrigger: st })
        gsap.to('[data-fruit-spin]', { rotate: 140, ease: 'none', scrollTrigger: st })
        gsap.to('[data-strip]', { yPercent: -12, ease: 'none', scrollTrigger: st })
      })

      // Cursor-responsive fruit (desktop pointer only)
      mm.add(`${mq.fine} and ${mq.motion}`, () => {
        const el = root.current?.querySelector('[data-fruit-tilt]')
        if (!el) return
        const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 24)
          yTo((e.clientY / window.innerHeight - 0.5) * 18)
        }
        window.addEventListener('pointermove', move)
        return () => window.removeEventListener('pointermove', move)
      })
    },
    { scope: root },
  )

  const chars = (s: string) =>
    s.split('').map((c, i) => (
      <span key={i} className="-mt-[0.1em] inline-block overflow-hidden pt-[0.1em]">
        <span data-char className="inline-block">
          {c}
        </span>
      </span>
    ))

  return (
    <section ref={root} id="top" className="relative overflow-hidden bg-ivory pt-[104px]" aria-labelledby="hero-title">
      <FilmStrip />

      <div className="relative z-10 px-[4vw] pt-[6vh] lg:pt-[4vh]">
        <h1 id="hero-title" className="display text-[clamp(6rem,21vw,21rem)] !leading-[0.93] text-ink">
          <span className="sr-only">Keisha Agro Farm: organic dragon fruits, from soil to slice.</span>
          <span aria-hidden className="block">
            <span data-line="1" className="flex items-end">
              <span className="inline-flex items-end">
                {chars('S')}
                {/* The O is a halved dragon fruit */}
                <span data-fruit-o className="relative mx-[0.015em] mb-[0.005em] inline-block h-[0.86em] w-[0.6em]">
                  <span data-fruit-tilt className="absolute inset-0 block">
                    <span data-fruit-spin className="absolute inset-0 block">
                      <DragonFruit view="cut" flesh="red" seed={5} shadow={false} className="h-full w-full" title="" />
                    </span>
                  </span>
                </span>
                {chars('IL')}
              </span>
              <span data-to className="serif-i ml-[0.08em] pb-[0.1em] text-[0.62em] leading-none text-pitaya">
                to
              </span>
            </span>
            <span data-line="2" className="relative block pl-[9vw] lg:pl-[17vw]">
              <span data-badge className="absolute left-[1vw] top-1/2 hidden h-[0.42em] w-[0.42em] -translate-y-1/2 lg:block">
                <Badge />
              </span>
              {chars('SLICE.')}
            </span>
          </span>
        </h1>

        <div className="mt-[5vh] grid gap-10 pb-12 lg:mt-[4vh] lg:grid-cols-12 lg:items-end lg:pb-14">
          <div className="lg:col-span-6">
            <p data-hero-fade className="max-w-[34rem] text-[1.06rem] leading-relaxed text-mute md:text-lg">
              {brand.intro}
            </p>
            <span data-hero-rule aria-hidden className="mt-7 block h-px w-16 origin-left bg-ink/25" />
            <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
              <Button href="#fruit" size="lg">
                Explore our dragon fruits
              </Button>
              <Button href="#farm" variant="ghost" size="lg">
                Our farming story
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6 lg:col-span-3 lg:col-start-7 lg:flex-col lg:items-start">
          <dl className="grid grid-cols-2 gap-6 text-sm lg:grid-cols-1 lg:gap-4">
            <div data-hero-fade>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65">Grown at</dt>
              <dd className="mt-1 text-ink">{contact.location}</dd>
            </div>
            <div data-hero-fade>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65">Season</dt>
              <dd className="mt-1 text-ink">{contact.season}</dd>
            </div>
          </dl>
            <a data-hero-fade href="#intro" className="group flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70 group-hover:text-ink">Scroll</span>
              <span aria-hidden className="scroll-cue relative block h-12 w-px overflow-hidden bg-ink/15 text-pitaya" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
