import SectionWrapper from '../components/shared/SectionWrapper'

export default function Privacy() {
  return (
    <SectionWrapper>
      <h1 className="font-display text-3xl md:text-4xl text-grey-deep mb-6">Privacy</h1>
      <div className="space-y-6 font-body text-base text-grey-soft leading-relaxed">
        <p>
          This page describes how I handle personal information when you use this website. It is
          written in plain language so you can make an informed choice. If anything is unclear, you
          are welcome to ask me directly.
        </p>
        <h2 className="font-display text-xl text-grey-deep">What I collect</h2>
        <p>
          If you use the enquiry form, I collect the details you choose to provide (such as your
          name, email address, message, and how you heard about my practice). Technical information
          may also be processed by my hosting provider for security and reliability (for example, to
          reduce spam).
        </p>
        <h2 className="font-display text-xl text-grey-deep">Why I use it</h2>
        <p>
          I use your information to respond to your enquiry and to keep a secure record of our
          contact, in line with professional and insurance requirements. I do not sell your data,
          and I do not use it for marketing lists.
        </p>
        <h2 className="font-display text-xl text-grey-deep">How long I keep it</h2>
        <p>
          I keep enquiry records only as long as needed for professional practice, legal
          obligations, and legitimate administration. If you would like to request access,
          correction, or deletion, you can email me and I will respond within a reasonable
          timeframe.
        </p>
        <h2 className="font-display text-xl text-grey-deep">Your rights</h2>
        <p>
          Depending on where you live, you may have rights under data protection law (including the
          UK GDPR). You may have the right to object, restrict processing, or lodge a concern with a
          supervisory authority. If you want to exercise a right, please contact me and I will help
          where I can.
        </p>
        <p className="text-sm text-grey-soft">
          This policy should be reviewed with your own legal or professional advisers before
          publication if you need site-specific legal certainty.
        </p>
      </div>
    </SectionWrapper>
  )
}
