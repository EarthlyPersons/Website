interface QuoteComponentProps {
  quote: string
  author?: string
}

export default function QuoteComponent({ quote, author }: QuoteComponentProps) {
  return (
    <blockquote className="font-quote italic text-lg text-grey-deep border-l-4 border-emerald pl-4 my-8">
      "{quote}"
      {author && <cite className="block mt-2 text-grey-soft">— {author}</cite>}
    </blockquote>
  )
}