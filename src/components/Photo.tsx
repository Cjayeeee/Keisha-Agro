import type { Shot } from '../content'
import { DragonFruit } from './DragonFruit'

type Tone = 'forest' | 'sand' | 'pitaya' | 'ink' | 'leaf'
const tones: Record<Tone, string> = {
  forest: 'bg-forest text-ivory/70',
  sand: 'bg-sand text-ink/55',
  pitaya: 'bg-pitaya text-ivory/80',
  ink: 'bg-ink text-ivory/60',
  leaf: 'bg-leaf text-forest-deep/70',
}

type Props = {
  shot: Shot
  tone?: Tone
  className?: string
  /** Show a faint fruit motif in the placeholder */
  motif?: 'whole' | 'cut' | 'flower' | false
  sizes?: string
  eager?: boolean
}

/**
 * Real photo when `shot.src` is set; otherwise an art-directed placeholder
 * that tells the client exactly which photo belongs here.
 * The inner [data-inner] layer is what parallax/reveal animations move.
 */
export function Photo({ shot, tone = 'sand', className = '', motif = false, sizes = '50vw', eager }: Props) {
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <div data-inner className="absolute inset-[-8%] will-change-transform">
        {shot.src ? (
          <img
            src={shot.src}
            alt={shot.alt}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div role="img" aria-label={`Placeholder: ${shot.alt}`} className={`relative h-full w-full ${tones[tone]}`}>
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 14px)' }}
            />
            {motif && (
              <div className="absolute inset-0 grid place-items-center opacity-25">
                <DragonFruit view={motif} shadow={false} className="h-[55%] w-auto" title="" />
              </div>
            )}
          </div>
        )}
      </div>
      {!shot.src && (
        <figcaption className={`pointer-events-none absolute inset-0 flex flex-col justify-between p-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] ${tones[tone].split(' ')[1]}`}>
          <span className="flex justify-between">
            <span>Photo</span>
            <span aria-hidden>+</span>
          </span>
          <span>{shot.label}</span>
        </figcaption>
      )}
    </figure>
  )
}
