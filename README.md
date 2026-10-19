# Keisha Agro Farm, website

A single-page site for an organic dragon-fruit farm, built with React, Vite, TypeScript, Tailwind CSS v4 and GSAP (ScrollTrigger and SplitText).

```bash
npm install
npm run dev       # local development
npm run build     # production build → dist/
npm run preview   # serve the production build
```

## Before launch: replace the placeholders

**All business content lives in `src/content.ts`.** Anything written in `[square brackets]` is a placeholder. The site doesn't make claims you haven't confirmed, so fill these in yourself:

| What | Where |
| --- | --- |
| Email, phone, WhatsApp, location, harvest season | `contact` |
| Social profile URLs | `socials` |
| Varieties you actually sell (flesh colour drives the artwork) | `varieties` |
| Sizes, packaging, order types, pricing | `specs` |
| Your growing, harvesting and packing practice | `process` |
| Farm story: land, people, season | `farmStory` |
| Differentiators (name a certification only if you hold one) | `reasons` |
| Photos | `photos` (see below) |
| Logo | `src/components/Logo.tsx` (typographic placeholder) |
| Domain, OG image | `index.html` (canonical, `og:image` → `/public/og-image.jpg`) |

### Photos
Your originals stay in `public/images/`. The site uses optimised copies in `public/images/opt/` (WebP, a large and an 800px version of each), and `src/content.ts → photos` decides which photo appears where. To add a new photo, export it as `name.webp` (about 1600px on the long edge) and `name-800.webp`, put both in `opt/`, and point a `src` at `/images/opt/name.webp`. `position` sets which part of the photo stays in view when a frame crops it.

**Photos still missing** (these frames still show placeholders):
- **Packed boxes or crates ready to leave the farm.** Shown in the "Packing" row of "From cactus to crate".

Nice to have: someone picking fruit by hand, a close-up of several ripe fruits together, a wide landscape shot with less sky for "Where it grows", and a sharper close-up of the fruit.

The dragon-fruit drawings (`DragonFruit.tsx`) are generic vector illustrations used as brand graphics alongside the photos.

### WhatsApp
Set `contact.whatsapp` to an international number with digits only, for example `919876543210`. This shows the WhatsApp links. Leave it empty to hide them.

## Enquiry form
The form checks input in the browser. If the visitor gives an email, it must be valid. They must give an email or a phone number, plus a message and an enquiry type. There's a hidden honeypot field to catch spam bots.

To send enquiries, copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` to any service that accepts a JSON `POST`, such as Formspree, Basin or your own API. Until you do, the form says plainly that online sending isn't connected. Once a real email is set, it offers to open the message in the visitor's email app. It never pretends a message was sent.

## Structure
```
src/
  content.ts            ← all copy & business data
  lib/gsap.ts           ← plugin registration + shared easing/durations/media queries
  lib/reveal.ts         ← line / fade / image reveal helpers + lazy section init
  hooks/useMagnetic.ts  ← magnetic buttons (fine pointers only)
  components/           ← one file per section
```
Section order: Preloader → Header → Hero → Marquee → Intro → Statement → Anatomy (horizontal on desktop) → Product → Process → FarmStory → Field → Why → Enquiry → Footer.

## Motion system
- Easing: `expo.out` for reveals and `power4.inOut` for masks and wipes. Changing them in `lib/gsap.ts` changes the whole site.
- All animations live inside `useGSAP` and `gsap.matchMedia()`, so they're reverted on unmount and when a media query changes. This is safe under React StrictMode.
- **Reduced motion:** visitors who ask for reduced motion skip the preloader, scroll animations and pinning, and get a normal vertical layout.
- **Desktop only (≥1024px):** horizontal Anatomy scroll, sticky farm-story wipes, cursor tilt and magnetic buttons. Tablets and phones get simpler, touch-friendly versions.
- Animations for each section are only set up when it comes within about one screen of the viewport (`onNear`). This keeps the first load light.
- No WebGL. The art direction doesn't need it, and leaving it out keeps the site fast on phones.

## Measured (Lighthouse 12, local production build, first visit with preloader)
| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile (simulated slow 4G + 4× CPU) | 70 | 97 | 100 | 100 |
| Desktop | 79 | 97 | 100 | 100 |

CLS was 0 on both. LCP was 2.6s on mobile and 0.7s on desktop. Most of the remaining cost is main-thread time from the motion system and inline SVG artwork. Scores will change once real photography is added, so re-run Lighthouse after adding images.

## Fonts
Anton (display), Bodoni Moda Italic (accent words) and Inter Tight (text). All three are SIL Open Font License, self-hosted in `public/fonts`, and limited to the Latin character set.
