import { useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { Preloader } from './components/Preloader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Intro } from './components/Intro'
import { Statement } from './components/Statement'
import { Anatomy } from './components/Anatomy'
import { Product } from './components/Product'
import { Process } from './components/Process'
import { FarmStory } from './components/FarmStory'
import { Field } from './components/Field'
import { Why } from './components/Why'
import { Enquiry } from './components/Enquiry'
import { Footer } from './components/Footer'

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem('kaf-intro')
  } catch {
    return true
  }
}

export default function App() {
  const [intro] = useState(shouldPlayIntro)
  const [ready, setReady] = useState(!intro)
  const [showLoader, setShowLoader] = useState(intro)

  useEffect(() => {
    // Recalculate trigger positions once web fonts settle (prevents offset pins)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const done = () => {
    try {
      sessionStorage.setItem('kaf-intro', '1')
    } catch {
      /* storage unavailable — fine */
    }
    setShowLoader(false)
    setReady(true)
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory">
        Skip to content
      </a>
      {showLoader && <Preloader onDone={done} />}
      <Header ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <Intro />
        <Statement />
        <Anatomy />
        <Product />
        <Process />
        <FarmStory />
        <Field />
        <Why />
        <Enquiry />
      </main>
      <Footer />
    </>
  )
}
