import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export default function CleaningPage() {
  return (
    <>
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-72px bg-near-black">
        <div className="max-w-7xl mx-auto px-5% w-full pt-20">
          <SectionLabel>Commercial Cleaning</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-8xl leading-tight tracking-tight max-w-3xl mb-8">
            Commercial cleaning for offices that can't afford a bad impression.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12">
            Consistent. Accountable. Newcastle-based. Your space is a reflection of your business. We make sure it shows.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Book a Site Visit
          </Button>
        </div>
      </section>

      {/* WHAT WE CLEAN */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <SectionLabel>What we clean</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            Every property type. Same standard.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {[
              {
                type: 'Commercial Offices',
                services: [
                  'Daily office cleaning',
                  'Kitchen and break room',
                  'Washroom maintenance',
                  'Carpet and hard floor care',
                  'Glass and window cleaning'
                ],
                note: 'Professional environments demand professional cleaning.'
              },
              {
                type: 'Medical Practices',
                services: [
                  'Clinical-grade disinfection',
                  'Infection control protocols',
                  'Medical waste handling',
                  'Biohazard-compliant procedures',
                  'NDIS and privacy compliance'
                ],
                note: 'We understand the standards medical facilities need to meet.'
              },
              {
                type: 'Childcare Centres',
                services: [
                  'Child-safe cleaning protocols',
                  'Toy and equipment sanitising',
                  'Play area deep cleaning',
                  'Cot and bedding care',
                  'Non-toxic product use'
                ],
                note: 'Safety and health come first, every single time.'
              },
              {
                type: 'Post-Construction & Industrial',
                services: [
                  'Deep site cleanup',
                  'Dust removal and disposal',
                  'Debris extraction',
                  'Equipment and machinery cleaning',
                  'Final readiness preparation'
                ],
                note: 'We coordinate closely with your building teams.'
              }
            ].map((category, i) => (
              <div key={i} className="bg-warm-grey rounded-lg p-10">
                <h3 className="text-near-black font-bold text-2xl mb-6 border-b-2 border-teal pb-4">
                  {category.type}
                </h3>
                <ul className="space-y-3 mb-6">
                  {category.services.map((service, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                      <span className="text-charcoal font-light text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-mid-grey font-light text-sm italic border-t border-gray-300 pt-4">
                  {category.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE YOS DIFFERENCE */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <SectionLabel>The YOS difference</SectionLabel>
          <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            How we're different from the rest.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="bg-white/5 rounded-lg p-10 border border-white/10">
              <h3 className="text-white font-bold text-2xl mb-6">Same team, every time</h3>
              <p className="text-white/70 font-light text-sm leading-relaxed mb-4">
                No rotating cast of contractors. The same people clean your space every visit. They learn your business. They know what matters.
              </p>
              <p className="text-white/50 font-light text-xs italic">
                Consistency builds trust. Trust builds good outcomes.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-10 border border-white/10">
              <h3 className="text-white font-bold text-2xl mb-6">Monthly quality audits</h3>
              <p className="text-white/70 font-light text-sm leading-relaxed mb-4">
                Sarah personally audits every site each month. Standards are checked. Issues are flagged. Problems are fixed before they matter.
              </p>
              <p className="text-white/50 font-light text-xs italic">
                You get accountability, not excuses.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-10 border border-white/10">
              <h3 className="text-white font-bold text-2xl mb-6">Direct line to Sarah</h3>
              <p className="text-white/70 font-light text-sm leading-relaxed mb-4">
                If something's wrong, you call Sarah. Not a call centre. Not an email queue. The person running the division.
              </p>
              <p className="text-white/50 font-light text-xs italic">
                Real problems get real solutions.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-teal/10 border-l-4 border-teal pl-8 py-6 rounded">
            <p className="text-white font-light text-lg leading-relaxed">
              We're Newcastle-based, Newcastle-owned. We show up because we have skin in the game. Your space matters to us because your space is in our city. That changes how we work.
            </p>
          </div>
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="bg-teal py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-5%">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Ready to move to a better standard?
          </h2>
          <p className="text-white/80 font-light text-xl leading-relaxed mb-12">
            We'll visit your site, understand your needs, and give you a clear proposal. No pressure. No surprises.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
            Book a Site Visit
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
