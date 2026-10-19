/**
 * ─────────────────────────────────────────────────────────────
 *  KEISHA AGRO FARM: SITE CONTENT
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
    'Keisha Agro Farm grows organic dragon fruits, the vivid, night-blooming cactus fruit, and sells them directly from the farm. Explore the fruit, see where it comes from, and send us an enquiry.',
}

/** Contact details. Leave a value as an empty string to hide it. */
export const contact = {
  email: '[hello@yourfarm.com]',
  phone: '[+00 00000 00000]',
  /** International format, digits only, e.g. "919876543210". Empty = WhatsApp button hidden. */
  whatsapp: '',
  location: 'Nimbavi, Shrigonda',
  season: '[Harvest season, e.g. Month to Month]',
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
 * Photography. Optimised copies live in /public/images/opt as
 * name.webp (large) + name-800.webp (small); `src` points at the large one
 * and <Photo /> builds the responsive srcset automatically.
 * `position` is the CSS object-position used when the frame crops the photo.
 * While `src` is empty an art-directed placeholder is shown with the `label`
 * so you know which photo is still missing.
 */
export type Shot = { src: string; alt: string; label: string; position?: string }

const img = (name: string) => `/images/opt/${name}.webp`

const shots = {
  fruit: { src: img('TheFruit'), alt: 'A ripe magenta dragon fruit growing on the cactus at Keisha Agro Farm', label: 'Fruit on the vine', position: '45% 50%' },
  flower: { src: img('moreFlower'), alt: 'An open dragon fruit flower with a yellow centre, visited by bees', label: 'In bloom', position: '50% 35%' },
  flowerSky: { src: img('onlyFlower'), alt: 'A dragon fruit flower opening against the sky', label: 'The flower opens', position: '40% 50%' },
  flowerDried: { src: img('Flowerdried'), alt: 'A spent dragon fruit flower hanging from the cactus after blooming', label: 'After the bloom', position: '50% 40%' },
  stem: { src: img('CloseupPlant'), alt: 'Close-up of a dragon fruit cactus stem with water droplets', label: 'The cactus', position: '35% 50%' },
  rows: { src: img('morePlants'), alt: 'Rows of dragon fruit cactus with ripening fruit along a mulched path', label: 'Cactus rows', position: '50% 55%' },
  wide: { src: img('plants'), alt: 'Wide view across the dragon fruit plantation at Keisha Agro Farm', label: 'The plantation', position: '50% 78%' },
  planting: { src: img('Plantation'), alt: 'Planting dragon fruit cuttings beside a support post at the farm', label: 'Planting day', position: '50% 45%' },
  weighing: { src: img('fruitOnScale'), alt: 'Harvested dragon fruits being weighed on a digital scale', label: 'Weighing the harvest', position: '40% 45%' },
  canopy: { src: img('plant'), alt: 'A dragon fruit cactus trained over its support post, with buds and flowers', label: 'The canopy', position: '50% 55%' },
  halved: { src: img('DragonHalf'), alt: 'Two halves of a red-fleshed dragon fruit from Keisha Agro Farm, showing the magenta flesh and black seeds', label: 'Halved fruit', position: '50% 62%' },
  family: { src: img('whoGrowa'), alt: 'The family behind Keisha Agro Farm standing together on the plantation', label: 'Who grows it', position: '45% 60%' },
  grower: { src: img('withFlower'), alt: 'A grower at Keisha Agro Farm smiling beside a dragon fruit flower', label: 'The people', position: '50% 12%' },
}

/** Still needed: see README "Photos still missing" */
const todo = {
    dispatch: { src: '', alt: 'Packed boxes ready to leave the farm', label: 'Ready to go' },
}

export const photos = {
  /** Tilted strip in the hero */
  strip: [shots.fruit, shots.flower, shots.halved, shots.rows] as Shot[],
  /** Who-we-are section: large frame + small overlapping frame */
  intro: [shots.rows, shots.halved] as Shot[],
  /** Thumbnails under the product details */
  product: [shots.halved, shots.fruit, shots.weighing] as Shot[],
  /** Indexed by `process[].shots` */
  process: [shots.planting, shots.canopy, shots.flower, shots.fruit, shots.weighing, todo.dispatch] as Shot[],
  /** Farm story chapters: Land, People, Season */
  farm: [shots.wide, shots.family, shots.fruit] as Shot[],
  /** Photo wall */
  field: [shots.stem, shots.flowerSky, shots.halved, shots.planting, shots.canopy, shots.weighing] as Shot[],
}

/** Anatomy chapters: general botanical facts about dragon fruit (pitaya). */
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
    body: 'Cut ours open and the flesh is a deep, vivid magenta, flecked with tiny black seeds you eat along with it.',
    view: 'cut' as const,
  },
]

/**
 * Varieties you actually grow. `flesh` controls the illustration colour.
 * Remove any entry you do not sell.
 */
export const varieties = [
  { name: '[Variety name]', flesh: 'red' as const, note: '[Short description: taste, colour, size]' },
]

/** Product spec rows. Fill in only what is confirmed. */
export const specs = [
  { label: 'Grown at', value: 'Nimbavi, Shrigonda' },
  { label: 'Sizes / grades', value: '[e.g. by weight per fruit]' },
  { label: 'Packaging', value: '[e.g. box sizes]' },
  { label: 'Order types', value: '[Retail / Bulk, to confirm]' },
  { label: 'Pricing', value: 'On request' },
]

/** Cultivation process: general steps; replace bracketed text with your practice. */
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
    body: '[Introduce the family or team behind the farm: who they are and how they started growing dragon fruit.]',
  },
  {
    kicker: 'The Season',
    title: 'When it’s ready',
    body: '[Explain your harvest season and when buyers should get in touch to secure fruit.]',
  },
]

/** Differentiators. Keep only what is true. */
export const reasons = [
  { no: '01', title: 'Straight from the grower', body: 'You deal with the farm that grows the fruit, with no middle layer between field and enquiry.' },
  { no: '02', title: 'Grown organically', body: '[Describe your organic practices. Name a certification only if you hold one.]' },
  { no: '03', title: 'Retail & bulk', body: '[Confirm the order types and quantities you can supply.]' },
  { no: '04', title: '[Your differentiator]', body: '[Freshness, varieties, packaging or distribution, whatever is genuinely yours.]' },
]

export const enquiryTypes = ['Retail order', 'Bulk / wholesale', 'Availability', 'Something else']
