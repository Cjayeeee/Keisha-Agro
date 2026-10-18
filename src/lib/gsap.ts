import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Shared motion language — one place to tune the whole site. */
export const ease = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power3.out',
}
export const dur = { xs: 0.4, s: 0.7, m: 1.1, l: 1.5 }

/** Media query helpers for gsap.matchMedia() */
export const mq = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
