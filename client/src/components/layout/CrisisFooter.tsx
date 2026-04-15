import { Heart } from 'lucide-react'

/**
 * CrisisFooter — mandatory on every route.
 * Never conditional. Never hidden. Never collapsible.
 */
export default function CrisisFooter() {
  return (
    <aside
      role="complementary"
      aria-label="Crisis support information"
      className="border-t-2 border-sage bg-sage/20 py-6 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-3">
          <Heart size={16} className="text-emerald mt-1 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-body text-sm text-grey-deep leading-relaxed">
              If you&apos;re in crisis right now, please reach out for immediate support.{' '}
              <strong className="font-medium">You are not alone.</strong>
            </p>
            <ul className="mt-2 font-body text-sm text-grey-deep space-y-1">
              <li>
                <strong>Samaritans</strong> &mdash;{' '}
                <a
                  href="tel:116123"
                  className="text-emerald underline underline-offset-2 hover:text-sage"
                  aria-label="Call Samaritans on 116 123"
                >
                  116 123
                </a>{' '}
                (free, 24/7, any time, any reason)
              </li>
              <li>
                <strong>Emergency</strong> &mdash;{' '}
                <a
                  href="tel:999"
                  className="text-emerald underline underline-offset-2 hover:text-sage"
                  aria-label="Call emergency services on 999"
                >
                  999
                </a>
              </li>
              <li>
                <strong>NHS Mental Health Crisis Line</strong> &mdash;{' '}
                <a
                  href="tel:111"
                  className="text-emerald underline underline-offset-2 hover:text-sage"
                  aria-label="Call NHS 111 and select the mental health option"
                >
                  111
                </a>{' '}
                (select the mental health option)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}
