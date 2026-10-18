import { useEffect, type RefObject } from 'react'
import { gsap, mq } from '../lib/gsap'

/** Magnetic hover for pointer:fine devices only. Touch devices get nothing. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.28) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia(mq.fine).matches || !window.matchMedia(mq.motion).matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [ref, strength])
}
