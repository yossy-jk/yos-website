'use client'
import FadeIn from '@/components/FadeIn'
import Button from '@/components/Button'

export default function FeeGuarantee() {
  return (
    <section
      className="fee-guarantee-section"
      aria-labelledby="fee-guarantee-heading"
    >
      <div className={WRAP}>
        <div className={PAD}>
          <FadeIn>
            <div className="fee-guarantee-inner">

              {/* ─── Seal ─── */}
              <div className="fee-guarantee-seal-wrap" aria-hidden="true">
                <div className="fee-guarantee-seal">
                  <span className="fee-guarantee-seal-mult">3x</span>
                  <span className="fee-guarantee-seal-label">
                    FEE<br />GUARANTEE
                  </span>
                </div>
              </div>

              {/* ─── Text ─── */}
              <div className="fee-guarantee-text">
                <p className="fee-guarantee-eyebrow">OUR GUARANTEE</p>
                <h2
                  id="fee-guarantee-heading"
                  className="fee-guarantee-heading"
                >
                  We pay for ourselves. Three times over.
                </h2>
                <p className="fee-guarantee-body">
                  You only pay our professional fee once we&apos;ve secured you at least three times that fee
                  in measurable value — rent-free periods, fit-out contributions, make-good reductions,
                  reduced rent across your term and negotiated incentives, combined.
                  If we don&apos;t get you there, you don&apos;t pay it.
                </p>
                <p className="fee-guarantee-reassure">
                  No lock-in. No conflict of interest. We work only for you — never the landlord.
                </p>
                <Button href="/contact" variant="outline-light" size="lg">
                  Book a no-obligation chat
                </Button>
              </div>

            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

const WRAP  = 'max-w-screen-xl mx-auto'
const PAD   = 'padding-left: clamp(1.5rem,8vw,10rem); padding-right: clamp(1.5rem,8vw,10rem)'
