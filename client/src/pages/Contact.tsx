import EnquiryForm from '../components/pages/contact/EnquiryForm'
import SectionWrapper from '../components/shared/SectionWrapper'

export default function Contact() {
  return (
    <SectionWrapper>
      <h1 className="font-display text-3xl md:text-4xl text-grey-deep text-center mb-4">
        Let&apos;s talk
      </h1>
      <p className="font-body text-lg text-grey-soft text-center max-w-2xl mx-auto mb-12 leading-relaxed">
        If something in you is hoping for a little more steadiness, you are welcome here. You do not
        need to explain everything perfectly. Share what feels possible today, and we can take the
        next step together.
      </p>
      <div className="max-w-xl mx-auto">
        <EnquiryForm />
      </div>
    </SectionWrapper>
  )
}
