import { cn } from '../../lib/utils'

interface QuoteComponentProps {
  /** Preferred prop name (matches project spec) */
  text?: string
  /** Legacy alias used by older components */
  quote?: string
  author?: string
  className?: string
  variant?: 'default' | 'hero' | 'subtle'
}

export default function QuoteComponent({
  text,
  quote,
  author,
  className,
  variant = 'default',
}: QuoteComponentProps) {
  const displayText = (text ?? quote ?? '').trim()
  const variants = {
    default: 'bg-cream border-l-4 border-sage py-8 px-8',
    hero: 'bg-transparent py-12 px-8 text-center',
    subtle: 'bg-mint/20 rounded-2xl py-6 px-6',
  }

  if (!displayText) return null

  return (
    <figure
      className={cn('my-8 max-w-2xl', variants[variant], className)}
      aria-label={author ? `Quote by ${author}` : 'Quote'}
    >
      <blockquote>
        <p className="font-quote text-xl md:text-2xl italic text-emerald leading-relaxed">
          &ldquo;{displayText}&rdquo;
        </p>
      </blockquote>
      {author ? (
        <figcaption className="mt-4 font-body text-sm text-grey-soft">&mdash; {author}</figcaption>
      ) : null}
    </figure>
  )
}
