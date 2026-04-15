import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
}

export default function SectionWrapper({ children, className = '' }: SectionWrapperProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </section>
  )
}