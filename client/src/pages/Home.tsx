import Hero from '../components/pages/home/Hero'
import ServicesPreview from '../components/pages/home/ServicesPreview'
import AboutPreview from '../components/pages/home/AboutPreview'
import ContactCTA from '../components/pages/home/ContactCTA'

export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesPreview />
      <AboutPreview />
      <ContactCTA />
    </div>
  )
}