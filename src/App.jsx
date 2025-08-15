import React, { useEffect, useMemo, useState } from 'react'

const WEBHOOK_URL = '/api/leads'

const logos = [
  { name: 'Stripe', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'Axis', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Axis_Communications_logo.svg' },
  { name: 'Rekor', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Rekor_Systems_logo.svg' },
  { name: 'DRB', src: 'https://upload.wikimedia.org/wikipedia/commons/9/97/DRB_Systems_logo.png' },
]

const clips = [
  { title: 'LPR catches plate in <300ms', src: '/videos/lpr.mp4', poster: '/videos/lpr.jpg' },
  { title: 'Blazing-fast POS flow',        src: '/videos/pos.mp4', poster: '/videos/pos.jpg' },
  { title: 'Churn & cohort analytics',     src: '/videos/analytics.mp4', poster: '/videos/analytics.jpg' },
]

function classNames (...c) { return c.filter(Boolean).join(' ') }

function ArrowRight ({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

const features = [
  { title: 'Instant LPR Memberships', desc: 'License plate recognition turns your lanes into membership scanners—no stickers required.' },
  { title: 'Blazing-Fast POS', desc: 'Stripe S700 handhelds and our optimized workflows get cars moving and cash flowing.' },
  { title: 'Real-Time Sync', desc: 'Two-way sync with legacy systems (DRB, more) so ops never miss a beat.' },
  { title: 'Open APIs', desc: 'Integrate with ERPs, CRMs, analytics, and data lakes with clean, well-documented endpoints.' },
  { title: 'Enterprise-Grade Uptime', desc: 'Multi-region cloud with 5G failover options for bulletproof availability.' },
  { title: 'Analytics that Matter', desc: 'From conversion funnels to churn prevention—actionable dashboards out of the box.' },
]

const faqs = [
  { q: 'Can Roller Up work with our existing tunnel controller?', a: 'Yes. We support common controllers and provide an integration path when one doesn’t exist yet.' },
  { q: 'How fast is deployment?', a: 'Pilot sites can be live in weeks. Hardware and network readiness are the main variables.' },
  { q: 'Do you support multi-site operators?', a: 'Absolutely. Role-based access, org hierarchies, and site-level overrides are built in.' },
  { q: 'Where is data hosted?', a: 'U.S. by default, with EU options available for international operators.' },
]

function useAdminMode () {
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setAdmin(p.get('admin') === '1')
  }, [])
  return admin
}

export default function App () {
  const admin = useAdminMode()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">RU</div>
            <span className="font-semibold tracking-tight">Roller Up</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:opacity-70">Features</a>
            <a href="#integrations" className="hover:opacity-70">Integrations</a>
            <a href="#reel" className="hover:opacity-70">Video</a>
            <a href="#demo" className="hover:opacity-70">Get a demo</a>
          </nav>
          <a href="#demo" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold">Talk to sales</a>
        </div>
      </header>

      <main>
        {/* Hero with background video */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Live at high-volume sites today
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                The car wash POS built for memberships and speed
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Roller Up unifies LPR, POS, and analytics so your lanes move fast, your members are happy,
                and your revenue keeps climbing.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#demo" className="rounded-xl bg-slate-900 text-white px-5 py-3 font-semibold inline-flex items-center gap-2">
                  Get a demo <ArrowRight/>
                </a>
                <a href="#features" className="rounded-xl border px-5 py-3 font-semibold">Explore features</a>
              </div>
              <div className="mt-6 text-xs text-slate-500">Trusted by forward-thinking operators</div>
              <div className="mt-3 flex items-center gap-6 flex-wrap opacity-80">
                {logos.map((l)=> (
                  <img key={l.name} src={l.src} alt={l.name} className="h-6 object-contain" />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border">
                <video
                  className="w-full h-full object-cover bg-black"
                  src="/videos/hero.mp4"
                  poster="/videos/hero.jpg"
                  muted
                  loop
                  playsInline
                  autoPlay
                  onCanPlay={(e)=> e.currentTarget.play().catch(()=>{})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Video Scroller */}
        <section id="reel" className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold">See it in action</h2>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => document.getElementById('vidstrip').scrollBy({ left: -600, behavior: 'smooth' })}
                  className="rounded-xl border px-3 py-2">←</button>
                <button
                  onClick={() => document.getElementById('vidstrip').scrollBy({ left: 600, behavior: 'smooth' })}
                  className="rounded-xl border px-3 py-2">→</button>
              </div>
            </div>

            <p className="mt-2 text-slate-600">
              Swipe through the clips—LPR recognition, POS speed, and real-time analytics.
            </p>

            <div id="vidstrip" className="mt-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-6 w-[max-content]">
                {clips.map((c, i) => (
                  <figure key={i} className="snap-start shrink-0 w-[90vw] md:w-[720px] rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <video
                      className="w-full h-[50vw] md:h-[405px] object-cover bg-black"
                      src={c.src}
                      poster={c.poster}
                      muted
                      loop
                      playsInline
                      autoPlay
                      onCanPlay={(e) => e.currentTarget.play().catch(()=>{})}
                    />
                    <figcaption className="p-4 text-sm text-slate-700">{c.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Why operators switch to Roller Up</h2>
            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((f, i)=> (
                <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Frequently asked questions</h2>
            <div className="mt-10 space-y-6">
              {faqs.map((f, i)=> (
                <details key={i} className="rounded-xl border bg-white p-6 shadow-sm">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Form placeholder */}
        <section id="demo" className="py-12 md:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Request a demo</h2>
            <p className="mt-2 text-slate-600 text-center">Let’s connect and show you Roller Up in action.</p>
            {/* you can add the lead form component here if needed */}
          </div>
        </section>
      </main>
    </div>
  )
}

