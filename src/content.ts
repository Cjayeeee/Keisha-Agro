/**
 * ─────────────────────────────────────────────────────────────
 *  KEISHA AGRO FARM — SITE CONTENT
 *  Every business fact on the site lives in this file.
 *  Anything in [square brackets] is a PLACEHOLDER that must be
 *  confirmed or replaced before launch. Do not publish claims
 *  (certifications, prices, delivery promises) you cannot verify.
 * ─────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'Keisha Agro Farm',
  short: 'keisha',
  tagline: 'Organic dragon fruits, grown at Keisha Agro Farm.',
  // Short, verified-safe statement used in the hero.
  intro:
    'Keisha Agro Farm grows organic dragon fruits — the vivid, night-blooming cactus fruit — and sells them directly from the farm. Explore the fruit, see where it comes from, and send us an enquiry.',
}

/** Contact details. Leave a value as an empty string to hide it. */
export const contact = {
  email: '[hello@yourfarm.com]',
  phone: '[+00 00000 00000]',
  /** International format, digits only, e.g. "919876543210". Empty = WhatsApp button hidden. */
  whatsapp: '',
  location: '[Farm location, Region]',
  season: '[Harvest season — e.g. Month to Month]',
}

export const socials: { label: string; href: string }[] = [
  { label: 'Instagram', href: '#' }, // TODO: real profile URL
  { label: 'Facebook', href: '#' }, // TODO
  { label: 'YouTube', href: '#' }, // TODO
]

export const nav = [
  { label: 'The Fruit', href: '#fruit' },
  { label: 'How It Grows', href: '#grow' },
  { label: 'The Farm', href: '#farm' },
  { label: 'Enquire', href: '#enquire' },
]

/**
 * Photography. Drop real files into /public/images and set `src`
 * (e.g. '/images/hero-01.jpg'). While `src` is empty an art-directed
 * placeholder is shown with the `label` so you know what to shoot.
 */
export type Shot = { src: string; alt: string; label: string }

export const photos = {
  strip: [
    { src: '', alt: 'Dragon fruit hanging on the cactus at Keisha Agro Farm', label: 'Fruit on the vine' },
    { src: '', alt: 'Freshly harvested dragon fruits in a crate', label: 'Harvest crate' },
    { src: '', alt: 'Hands holding a halved dragon fruit', label: 'Halved fruit, in hand' },
    { src: '', alt: 'Rows of dragon fruit cactus at the farm', label: 'Cactus rows' },
  ] as Shot[],
  process: [
    { src: '', alt: 'The farm land before planting', label: 'The land' },
    { src: '', alt: 'Young dragon fruit cactus on its support post', label: 'Young cactus' },
    { src: '', alt: 'Dragon fruit flower open at night', label: 'Night flower' },
    { src: '', alt: 'Picking ripe dragon fruit', label: 'Picking' },
    { src: '', alt: 'Dragon fruits being packed', label: 'Packing' },
    { src: '', alt: 'Packed boxes ready to leave the farm', label: 'Ready to go' },
  ] as Shot[],
  farm: [
    { src: '', alt: 'Wide view of Keisha Agro Farm', label: 'Wide farm view' },
    { src: '', alt: 'The Keisha Agro Farm team', label: 'The team' },
    { src: '', alt: 'Ripe dragon fruits during harvest season', label: 'Harvest season' },
  ] as Shot[],
  field: [
    { src: '', alt: 'Dragon fruit close-up', label: 'Skin close-up' },
    { src: '', alt: 'Cactus at golden hour', label: 'Golden hour' },
    { src: '', alt: 'Cut fruit on a table', label: 'On the table' },
    { src: '', alt: 'Bracts of the dragon fruit', label: 'Bract detail' },
    { src: '', alt: 'A grower inspecting the plants', label: 'Inspecting plants' },
    { src: '', alt: 'Fruit in packaging', label: 'Packed fruit' },
  ] as Shot[],
}

/** Anatomy chapters — general botanical facts about dragon fruit (pitaya). */
export const anatomy = [
  {
    no: '01',
    title: 'A flower that lives one night',
    body: 'Every dragon fruit begins as a large white flower on a climbing cactus. It opens after dusk and usually closes by the next morning.',
    view: 'flower' as const,
  },
  {
    no: '02',
    title: 'Scales, not leaves',
    body: 'The skin is wrapped in soft, flame-like bracts that blush from magenta to green at the tips. They are the fruit’s signature silhouette.',
    view: 'whole' as const,
  },
  {
    no: '03',
    title: 'Speckled within',
    body: 'Cut it open and the flesh is white or deep magenta, depending on the variety, flecked with tiny black seeds you eat along with it.',
    view: 'cut' as const,
  },
]

/**
 * Varieties you actually grow. `flesh` controls the illustration colour.
 * Remove any entry you do not sell.
 */
export const varieties = [
  { name: '[Variety name]', flesh: 'red' as const, note: '[Short description — taste, colour, size]' },
  { name: '[Variety name]', flesh: 'white' as const, note: '[Short description — taste, colour, size]' },
]

/** Product spec rows. Fill in only what is confirmed. */
export const specs = [
  { label: 'Grown at', value: '[Farm location]' },
  { label: 'Sizes / grades', value: '[e.g. by weight per fruit]' },
  { label: 'Packaging', value: '[e.g. box sizes]' },
  { label: 'Order types', value: '[Retail / Bulk — confirm]' },
  { label: 'Pricing', value: 'On request' },
]

/** Cultivation process — general steps; replace bracketed text with your practice. */
export const process = [
  {
    no: '01',
    title: 'The Land',
    body: 'Dragon fruit is a climbing cactus that needs sun and free-draining soil. [Describe your land and how you prepare it.]',
    shots: [0, 1],
  },
  {
    no: '02',
    title: 'The Cactus',
    body: 'Each plant climbs a support post and is trained into a canopy where the fruit hangs. [Describe your planting and care.]',
    shots: [1, 2],
  },
  {
    no: '03',
    title: 'The Harvest',
    body: 'Fruit is picked by hand once its skin has turned fully coloured. [Describe when and how you harvest.]',
    shots: [3, 2],
  },
  {
    no: '04',
    title: 'The Packing',
    body: 'Fruit is sorted and packed at the farm before it leaves. [Describe your grading, packing and dispatch.]',
    shots: [4, 5],
  },
]

/** Farm story chapters (pinned section). */
export const farmStory = [
  {
    kicker: 'The Land',
    title: 'Where it grows',
    body: '[Tell visitors where Keisha Agro Farm is, how large it is, and what makes the place special.]',
  },
  {
    kicker: 'The People',
    title: 'Who grows it',
    body: '[Introduce the family or team behind the farm — who they are and how they started growing dragon fruit.]',
  },
  {
    kicker: 'The Season',
    title: 'When it’s ready',
    body: '[Explain your harvest season and when buyers should get in touch to secure fruit.]',
  },
]

/** Differentiators. Keep only what is true. */
export const reasons = [
  { no: '01', title: 'Straight from the grower', body: 'You deal with the farm that grows the fruit — no middle layer between field and enquiry.' },
  { no: '02', title: 'Grown organically', body: '[Describe your organic practices. Name a certification only if you hold one.]' },
  { no: '03', title: 'Retail & bulk', body: '[Confirm the order types and quantities you can supply.]' },
  { no: '04', title: '[Your differentiator]', body: '[Freshness, varieties, packaging or distribution — whatever is genuinely yours.]' },
]

export const enquiryTypes = ['Retail order', 'Bulk / wholesale', 'Availability', 'Something else']
