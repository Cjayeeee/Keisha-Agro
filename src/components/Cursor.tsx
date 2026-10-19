import { useEffect, useRef } from 'react'
import { gsap, mq } from '../lib/gsap'
import '../cursor.css'

/**
 * Custom cursor: a magenta dot that tracks the pointer exactly, plus a ring
 * that follows with a soft lag.
 *  - Links / buttons: the ring grows and fills.
 *  - Elements with data-cursor="Label": the ring becomes a disc showing the label.
 *  - Text fields: the custom cursor hides and the native text caret returns.
 *  - Inside [data-cursor-invert] (magenta surfaces) it turns ivory so it stays visible.
 * Only enabled for a mouse/trackpad (hover + fine pointer) with motion allowed;
 * touch devices and reduced-motion users keep the normal cursor.
 */
const INTERACTIVE = 'a, button, [role="tab"], select, label, summary'
const TEXT = 'input, textarea, [contenteditable="true"]'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const enabled = window.matchMedia(`${mq.fine} and ${mq.motion}`)
    if (!enabled.matches || !dot.current || !ring.current) return
    const d = dot.current
    const r = ring.current
    const root = document.documentElement
    root.classList.add('has-cursor')

    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3.out' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) {
        // jump into place on first move so it doesn't fly in from the corner
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        root.classList.add('cursor-visible')
        shown = true
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const setState = (state: string, text = '') => {
      r.dataset.state = state
      d.dataset.state = state
      if (label.current) label.current.textContent = text
    }

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (!t || !t.closest) return
      // On magenta surfaces the magenta cursor would vanish, so switch it to ivory
      const invert = !!t.closest('[data-cursor-invert]')
      d.classList.toggle('is-invert', invert)
      r.classList.toggle('is-invert', invert)
      if (t.closest(TEXT)) return setState('text')
      const labelled = t.closest<HTMLElement>('body [data-cursor]')
      if (labelled?.dataset.cursor && !t.closest(INTERACTIVE)) return setState('label', labelled.dataset.cursor)
      if (t.closest(INTERACTIVE)) return setState('link')
      setState('default')
    }

    const down = () => r.classList.add('is-down')
    const up = () => r.classList.remove('is-down')
    const leave = () => {
      d.style.opacity = '0'
      r.style.opacity = '0'
    }
    const enter = () => {
      d.style.opacity = ''
      r.style.opacity = ''
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)

    return () => {
      root.classList.remove('has-cursor')
      root.classList.remove('cursor-visible')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
      gsap.killTweensOf([d, r])
    }
  }, [])

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring" data-state="default">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" data-state="default" />
    </div>
  )
}
