import { useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealFade, revealLines, onNear } from '../lib/reveal'
import { contact, photos, specs, varieties } from '../content'
import { isPlaceholder } from '../lib/util'
import { DragonFruit } from './DragonFruit'
import { Photo } from './Photo'
import { Button } from './Button'

/** Ask the enquiry form to pre-fill itself. */
export function prefillEnquiry(detail: { type?: string; message?: string }) {
  window.dispatchEvent(new CustomEvent('kaf:enquire', { detail }))
}

export function Product() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const v = varieties[active]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          revealFade(q('[data-fade]'), q('[data-info]')[0], 0.06)
          gsap.from(stage.current, {
            clipPath: 'inset(12% 12% 12% 12%)',
            duration: 1.4,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: stage.current, start: 'top 80%', once: true },
          })
        })
      })
      // Subtle 3D tilt for pointer devices
      mm.add(`${mq.fine} and ${mq.motion}`, () => {
        const el = stage.current
        const art = el?.querySelector('[data-tilt]')
        if (!el || !art) return
        gsap.set(art, { transformPerspective: 900 })
        const rx = gsap.quickTo(art, 'rotationX', { duration: 0.8, ease: 'power3.out' })
        const ry = gsap.quickTo(art, 'rotationY', { duration: 0.8, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 16)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: root },
  )

  // Variety switch transition
  useGSAP(
    () => {
      if (!window.matchMedia(mq.motion).matches) return
      gsap.fromTo('[data-swap]', { rotate: -50, scale: 0.6, autoAlpha: 0 }, { rotate: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'expo.out' })
      gsap.fromTo('[data-swap-txt]', { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' })
    },
    { scope: root, dependencies: [active], revertOnUpdate: false },
  )

  const wa = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello Keisha Agro Farm, I'd like to enquire about your ${v.name.toLowerCase()}.`)}`
    : ''

  return (
    <section ref={root} id="product" aria-labelledby="product-title" className="relative px-[4vw] py-[16vh]">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        {/* Stage */}
        <div ref={stage} className="relative overflow-hidden bg-sand lg:sticky lg:top-[120px] lg:col-span-7 lg:h-[calc(100svh-160px)]">
          <div className="absolute left-5 right-5 top-5 flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65">
            <span className="overflow-hidden">
              <span data-swap-txt className="block">
                Fig. 0{active + 1} / {v.flesh === 'red' ? 'Red flesh' : 'White flesh'}
              </span>
            </span>
            <span>Illustration</span>
          </div>
          <div data-tilt className="relative mx-auto flex aspect-square max-h-full items-center justify-center lg:aspect-auto lg:h-full">
            <div className="absolute left-[12%] top-[16%] w-[38%] rotate-[-14deg] opacity-95">
              <DragonFruit view="whole" seed={31} className="w-full" />
            </div>
            <div data-swap className="absolute bottom-[10%] right-[12%] w-[44%]">
              <DragonFruit key={active} view="cut" flesh={v.flesh} seed={40 + active} shadow={false} className="w-full drop-shadow-[0_40px_40px_rgba(23,27,23,0.25)]" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div data-info className="lg:col-span-5 lg:py-6">
          <p className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65">
            <span className="font-display text-2xl tracking-normal text-ink/60">Ø3</span> What we grow
          </p>
          <h2 id="product-title" data-title className="display mt-6 text-[clamp(3.4rem,6.4vw,6.6rem)]">
            Organic dragon <span className="serif-i text-pitaya">fruit.</span>
          </h2>

          {varieties.length > 1 && (
            <div data-fade role="tablist" aria-label="Varieties" className="mt-10 flex flex-wrap gap-2">
              {varieties.map((x, i) => (
                <button
                  key={i}
                  role="tab"
                  type="button"
                  id={`var-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls="var-panel"
                  onClick={() => setActive(i)}
                  className={`flex h-11 items-center gap-2 px-4 text-sm font-medium ring-1 transition-colors duration-300 ${
                    active === i ? 'bg-ink text-ivory ring-ink' : 'text-ink ring-ink/20 hover:ring-ink'
                  }`}
                >
                  <span aria-hidden className={`size-3 rounded-full ring-2 ring-pitaya ${x.flesh === 'red' ? 'bg-pitaya-deep' : 'bg-ivory'}`} />
                  {x.name}
                </button>
              ))}
            </div>
          )}

          <div id="var-panel" {...(varieties.length > 1 ? { role: 'tabpanel', 'aria-labelledby': `var-tab-${active}` } : {})} className="mt-6">
            <p data-fade className="text-lg leading-relaxed text-mute">
              {v.note}
            </p>
          </div>

          <dl data-fade className="mt-10 border-t border-ink/15">
            {specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-ink/15 py-4 text-[15px]">
                <dt className="text-ink/65">{s.label}</dt>
                <dd className={isPlaceholder(s.value) ? 'text-ink/60' : 'text-ink'}>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <Button href="#enquire" onClick={() => prefillEnquiry({ type: 'Retail order', message: `I'm interested in ${v.name}.` })}>
              Enquire about this fruit
            </Button>
            <Button href="#enquire" variant="ghost" onClick={() => prefillEnquiry({ type: 'Bulk / wholesale' })}>
              Request bulk pricing
            </Button>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center gap-2 px-2 text-sm font-medium text-forest underline-offset-4 hover:underline">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp the farm
              </a>
            )}
          </div>

          <div data-fade className="mt-12 grid grid-cols-3 gap-3">
            {photos.product.map((s, i) => (
              <Photo key={i} shot={s} tone={(['forest', 'pitaya', 'leaf'] as const)[i]} className="aspect-[3/4]" sizes="15vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
