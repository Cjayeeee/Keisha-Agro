import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Loader2, Mail, MessageCircle, Phone, AlertCircle } from 'lucide-react'
import { gsap, useGSAP, mq } from '../lib/gsap'
import { revealLines, onNear } from '../lib/reveal'
import { contact, enquiryTypes } from '../content'
import { isPlaceholder } from '../lib/util'
import { Halftone } from './Halftone'
import { Button } from './Button'

/**
 * Enquiry form.
 * Sending: set VITE_FORM_ENDPOINT (see .env.example) to any service that
 * accepts a JSON POST (Formspree, Basin, your own API…). Without it the form
 * still validates, but says plainly that online sending isn't connected and
 * offers the visitor an email fallback; it never fakes a "sent" message.
 */
const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || ''

type Values = { name: string; email: string; phone: string; type: string; quantity: string; message: string; company: string }
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured'

const empty: Values = { name: '', email: '', phone: '', type: '', quantity: '', message: '', company: '' }

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
  const hasEmail = v.email.trim() !== ''
  const hasPhone = v.phone.trim() !== ''
  if (!hasEmail && !hasPhone) e.email = 'Add an email or a phone number so we can reply.'
  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email address doesn’t look right.'
  if (hasPhone && v.phone.replace(/[^\d]/g, '').length < 7) e.phone = 'That phone number looks too short.'
  if (!v.type) e.type = 'Choose what your enquiry is about.'
  if (v.message.trim().length < 10) e.message = 'A short message helps: at least a sentence.'
  return e
}

export function Enquiry() {
  const root = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = gsap.utils.selector(root)
      mm.add(mq.motion, (ctx) => {
        onNear(ctx, root.current, () => {
          revealLines(q('[data-title]')[0])
          gsap.from(q('[data-efade]'), {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: q('[data-ebody]')[0], start: 'top 80%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  // Pre-fill from product CTAs
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ type?: string; message?: string }>).detail || {}
      setValues((v) => ({ ...v, type: d.type ?? v.type, message: v.message || d.message || '' }))
    }
    window.addEventListener('kaf:enquire', on)
    return () => window.removeEventListener('kaf:enquire', on)
  }, [])

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (touched[k]) setErrors(validate(next))
    if (status === 'error' || status === 'unconfigured') setStatus('idle')
  }
  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(values))
  }
  const show = (k: keyof Values) => (touched[k] ? errors[k] : undefined)

  const mailto = () => {
    const body = [
      `Name: ${values.name}`,
      values.email && `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      `Enquiry: ${values.type}`,
      values.quantity && `Quantity: ${values.quantity}`,
      '',
      values.message,
    ]
      .filter((x): x is string => typeof x === 'string')
      .join('\n')
    return `mailto:${contact.email}?subject=${encodeURIComponent(`Enquiry: ${values.type}`)}&body=${encodeURIComponent(body)}`
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, phone: true, type: true, message: true })
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    if (values.company) return // honeypot: silently ignore bots
    if (!ENDPOINT) {
      setStatus('unconfigured')
      return
    }
    setStatus('sending')
    try {
      const { company: _hp, ...payload } = values
      void _hp
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, source: 'keisha-agro-farm-website' }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setValues(empty)
      setTouched({})
    } catch {
      setStatus('error')
    }
  }

  const emailReal = !isPlaceholder(contact.email)
  const phoneReal = !isPlaceholder(contact.phone)

  const label = 'block text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory/60'
  const err = (k: keyof Values) =>
    show(k) ? (
      <p id={`${k}-err`} className="mt-2 text-sm text-[#ff9cc0]">
        {show(k)}
      </p>
    ) : null

  return (
    <section ref={root} id="enquire" aria-labelledby="enquire-title" className="relative overflow-hidden bg-forest px-[4vw] pb-[14vh] pt-[16vh] text-ivory">
      <Halftone dot="rgba(139,166,106,0.28)" mask="linear-gradient(90deg, transparent 0%, #000 30%, transparent 55%, #000 85%)" />
      <div className="relative">
        <h2 id="enquire-title" data-title className="display max-w-[16ch] text-[clamp(3.4rem,8.6vw,9rem)]">
          Your next harvest starts with <span className="text-pitaya">one message.</span>
        </h2>

        <div data-ebody className="mt-[8vh] grid gap-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <p data-efade className="max-w-sm border-l border-ivory/25 pl-5 text-lg leading-relaxed text-ivory/80">
              Tell us what you’re looking for, whether a box for home, stock for your shop or a regular bulk supply, and the farm will get back to you.
            </p>
            <ul className="mt-10 flex flex-col gap-4">
              <li data-efade className="flex items-center gap-3">
                <Mail className="size-5 text-leaf" aria-hidden />
                {emailReal ? (
                  <a className="u-link" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-ivory/60">{contact.email}</span>
                )}
              </li>
              <li data-efade className="flex items-center gap-3">
                <Phone className="size-5 text-leaf" aria-hidden />
                {phoneReal ? (
                  <a className="u-link" href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-ivory/60">{contact.phone}</span>
                )}
              </li>
              {contact.whatsapp && (
                <li data-efade className="flex items-center gap-3">
                  <MessageCircle className="size-5 text-leaf" aria-hidden />
                  <a className="u-link" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <form ref={formRef} onSubmit={submit} noValidate className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6" aria-describedby="form-status">
            <div data-efade>
              <label htmlFor="name" className={label}>
                Name *
              </label>
              <input id="name" name="name" autoComplete="name" className="field" value={values.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!show('name')} aria-describedby={show('name') ? 'name-err' : undefined} placeholder="Your full name" />
              {err('name')}
            </div>
            <div data-efade>
              <label htmlFor="type" className={label}>
                Enquiry *
              </label>
              <select id="type" name="type" className="field appearance-none" value={values.type} onChange={set('type')} onBlur={blur('type')} aria-invalid={!!show('type')} aria-describedby={show('type') ? 'type-err' : undefined}>
                <option value="" disabled>
                  Choose one…
                </option>
                {enquiryTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {err('type')}
            </div>
            <div data-efade>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className="field" value={values.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={!!show('email')} aria-describedby={show('email') ? 'email-err' : 'contact-hint'} placeholder="you@example.com" />
              {err('email')}
            </div>
            <div data-efade>
              <label htmlFor="phone" className={label}>
                Phone
              </label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} aria-invalid={!!show('phone')} aria-describedby={show('phone') ? 'phone-err' : 'contact-hint'} placeholder="Optional if you gave an email" />
              {err('phone')}
            </div>
            <p id="contact-hint" className="-mt-5 text-xs text-ivory/65 sm:col-span-2">
              Give us an email or a phone number, whichever you prefer.
            </p>
            <div data-efade className="sm:col-span-2">
              <label htmlFor="quantity" className={label}>
                Approx. quantity
              </label>
              <input id="quantity" name="quantity" className="field" value={values.quantity} onChange={set('quantity')} placeholder="e.g. a few kilos, weekly crates…" />
            </div>
            <div data-efade className="sm:col-span-2">
              <label htmlFor="message" className={label}>
                Message *
              </label>
              <textarea id="message" name="message" rows={4} className="field resize-y" value={values.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={!!show('message')} aria-describedby={show('message') ? 'message-err' : undefined} placeholder="What would you like to know?" />
              {err('message')}
            </div>
            {/* Honeypot */}
            <div aria-hidden className="absolute left-[-9999px]">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
            </div>

            <div data-efade className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center">
              <Button type="submit" variant="pitaya" size="lg" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </Button>
              <div id="form-status" role="status" aria-live="polite" className="text-sm">
                {status === 'sending' && (
                  <span className="flex items-center gap-2 text-ivory/70">
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Sending your enquiry…
                  </span>
                )}
                {status === 'sent' && (
                  <span className="flex items-center gap-2 text-leaf">
                    <Check className="size-4" aria-hidden /> Thank you, your enquiry has been sent. The farm will reply soon.
                  </span>
                )}
                {status === 'error' && (
                  <span className="flex items-start gap-2 text-[#ff9cc0]">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      Something went wrong and your message wasn’t sent. Please try again
                      {emailReal ? (
                        <>
                          {' '}
                          or{' '}
                          <a className="underline" href={mailto()}>
                            email the farm directly
                          </a>
                        </>
                      ) : null}
                      .
                    </span>
                  </span>
                )}
                {status === 'unconfigured' && (
                  <span className="flex items-start gap-2 text-ivory/80">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-pitaya" aria-hidden />
                    <span>
                      Online sending isn’t connected yet, so this message hasn’t been sent.{' '}
                      {emailReal ? (
                        <a className="underline" href={mailto()}>
                          Open it in your email app instead
                        </a>
                      ) : (
                        'Please contact the farm using the details on this page.'
                      )}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
