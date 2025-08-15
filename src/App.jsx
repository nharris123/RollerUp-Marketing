import React, { useEffect, useMemo, useState } from 'react'

const WEBHOOK_URL = '/api/leads' // TODO: replace with your backend / webhook (HubSpot/Marketo/Zapier/Airtable/etc.)

const logos = [
  { name: 'Stripe', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'Axis', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Axis_Communications_logo.svg' },
  { name: 'Rekor', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Rekor_Systems_logo.svg' },
  { name: 'DRB', src: 'https://upload.wikimedia.org/wikipedia/commons/9/97/DRB_Systems_logo.png' },
]

function classNames (...c) { return c.filter(Boolean).join(' ') }

function Check ({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

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

const tiers = [
  { name: 'Starter', price: 'Custom', tagline: 'Single-site operators', perks: ['LPR for up to 2 lanes', 'Stripe S700 support', 'Standard analytics', 'Email support'] },
  { name: 'Growth', price: 'Custom', tagline: 'Regional & multi-site', perks: ['Advanced memberships', 'Priority support', 'API access', 'Churn insights'], featured: true },
  { name: 'Enterprise', price: 'Custom', tagline: 'National & international', perks: ['SLA & SSO', 'Custom integrations', 'Dedicated CSM', 'Data residency options'] },
]

function useAdminMode () {
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setAdmin(p.get('admin') === '1')
  }, [])
  return admin
}

function useCSV (leads) {
  return useMemo(() => {
    if (!leads?.length) return ''
    const header = Object.keys(leads[0])
    const rows = leads.map((l) => header.map((k) => (l[k] ?? '').toString().replaceAll('"', '""')))
    const csv = [header.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
    return csv
  }, [leads])
}

function LeadForm ({ onSaved }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)
  const [payload, setPayload] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    sites: '1-5',
    country: 'United States',
    interests: ['LPR', 'Memberships'],
    message: '',
    source: 'rollerup_marketing_site',
    ts: new Date().toISOString(),
  })

  const update = (k, v) => setPayload((p) => ({ ...p, [k]: v }))

  async function submit (e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      if (!payload.email || !payload.firstName || !payload.company) {
        throw new Error('Please fill in first name, email, and company.')
      }
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const cached = JSON.parse(localStorage.getItem('rollerup_leads') || '[]')
        const next = [...cached, payload]
        localStorage.setItem('rollerup_leads', JSON.stringify(next))
      }
      setOk(true)
      onSaved?.(payload)
    } catch (e) {
      const cached = JSON.parse(localStorage.getItem('rollerup_leads') || '[]')
      const next = [...cached, payload]
      localStorage.setItem('rollerup_leads', JSON.stringify(next))
      setErr(e.message || 'Something went wrong. We saved your info locally.')
      setOk(true)
    } finally {
      setLoading(false)
    }
  }

  if (ok) {
    return (
      <div className="rounded-2xl p-6 md:p-8 bg-white shadow-xl border">
        <h3 className="text-2xl font-semibold">Thanks—you're on our list.</h3>
        <p className="mt-2 text-slate-600">
          We'll reach out shortly. Want a faster reply? Email{' '}
          <a className="underline" href="mailto:sales@rollerup.com">sales@rollerup.com</a>.
        </p>
        {err && <p className="mt-3 text-sm text-amber-700">{err}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">First name *</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.firstName} onChange={(e)=>update('firstName', e.target.value)} placeholder="Jane"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.lastName} onChange={(e)=>update('lastName', e.target.value)} placeholder="Doe"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Work email *</label>
          <input type="email" className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.email} onChange={(e)=>update('email', e.target.value)} placeholder="jane@company.com"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.phone} onChange={(e)=>update('phone', e.target.value)} placeholder="(555) 123-4567"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Company *</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.company} onChange={(e)=>update('company', e.target.value)} placeholder="Crew Car Wash"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Your role</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.role} onChange={(e)=>update('role', e.target.value)} placeholder="VP of Technology"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Sites</label>
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.sites} onChange={(e)=>update('sites', e.target.value)}>
            {['1-5','6-15','16-40','41-100','100+'].map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={payload.country} onChange={(e)=>update('country', e.target.value)} placeholder="United States"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Interests</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {['LPR','Memberships','POS','Analytics','APIs','International'].map(tag => (
              <label key={tag} className={classNames('px-3 py-1 rounded-full border cursor-pointer text-sm', 
                payload.interests.includes(tag) ? 'bg-slate-900 text-white' : 'bg-white')}>
                <input type="checkbox" className="hidden" checked={payload.interests.includes(tag)} onChange={() =>
                  update('interests', payload.interests.includes(tag) ? payload.interests.filter(t=>t!==tag) : [...payload.interests, tag]
                )} />{tag}
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Anything else?</label>
          <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows={4} value={payload.message} onChange={(e)=>update('message', e.target.value)} placeholder="Tell us about your current setup, goals, and timeline."/>
        </div>
      </div>
      <button disabled={loading} className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-95">
        {loading ? 'Submitting...' : 'Get a demo'} <ArrowRight />
      </button>
      <p className="text-xs text-slate-500">By submitting, you agree to our <a className="underline" href="#">Privacy Policy</a>.</p>
    </form>
  )
}

export default function App () {
  const admin = useAdminMode()
  const [leads, setLeads] = useState([])
  const csv = useCSV(leads)

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('rollerup_leads') || '[]')
    setLeads(cached)
  }, [])

  function exportCSV () {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rollerup-leads-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">RU</div>
            <span className="font-semibold tracking-tight">Roller Up</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:opacity-70">Features</a>
            <a href="#integrations" className="hover:opacity-70">Integrations</a>
            <a href="#pricing" className="hover:opacity-70">Pricing</a>
            <a href="#demo" className="hover:opacity-70">Get a demo</a>
          </nav>
          <a href="#demo" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold">Talk to sales</a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Live at high-volume sites today
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">The car wash POS built for memberships and speed</h1>
              <p className="mt-4 text-lg text-slate-600">Roller Up unifies LPR, POS, and analytics so your lanes move fast, your members are happy, and your revenue keeps climbing.</p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#demo" className="rounded-xl bg-slate-900 text-white px-5 py-3 font-semibold inline-flex items-center gap-2">Get a demo <ArrowRight/></a>
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
              <div className="aspect-[4/3] rounded-2xl bg-white shadow-2xl border p-6">
                <div className="h-full w-full rounded-xl border bg-slate-50 grid place-items-center text-slate-500">
                  <div className="text-center">
                    <div className="text-sm uppercase tracking-widest">Product Preview</div>
                    <div className="mt-2 text-2xl font-semibold">Operations Dashboard</div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-left text-sm">
                      {['Today’s Cars','Active Members','Avg. Dwell'].map((k,i)=> (
                        <div key={i} className="rounded-xl border bg-white p-3">
                          <div className="text-slate-500">{k}</div>
                          <div className="text-2xl font-bold">{[1520, 24873, '3m 12s'][i]}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border bg-white p-3 text-left">
                      <div className="text-slate-500 text-sm">Lane Health</div>
                      <div className="mt-2 h-24 w-full rounded-lg bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-emerald-200 blur-3xl rounded-full opacity-60" />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-indigo-200 blur-3xl rounded-full opacity-60" />
            </div>
          </div>
        </section>

        {/* Problem/Solution */}
        <section className="py-12 md:py-20" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold">Built for high-throughput car washes</h2>
                <p className="mt-4 text-slate-600">Legacy POS slows you down. Roller Up is engineered for speed at the edge and visibility in the cloud—so your team ships cars, not workarounds.</p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Tap-to-pay flows that take seconds, not minutes',
                    'Membership-first UX with churn prevention',
                    'Lane-level health and camera status',
                    'Open APIs for whatever you’re building next',
                  ].map((t, i)=> (
                    <li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 mt-1"/><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((f, i)=> (
                  <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="font-semibold">{f.title}</div>
                    <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Integrations your ops team will love</h2>
            <p className="mt-3 text-slate-600 text-center">Axis cameras with Rekor for LPR, AWID RFID, Stripe for payments, plus DRB sync. Bring your stack—we’ll meet you there.</p>
            <div className="mt-10 grid md:grid-cols-4 sm:grid-cols-2 gap-4">
              {logos.map((l,i)=> (
                <div key={i} className="rounded-2xl border bg-white p-6 grid place-items-center">
                  <img src={l.src} alt={l.name} className="h-8"/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">From pilot to portfolio</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                {t: 'Pilot', d: 'Stand up one site with LPR + POS, validate throughput and member experience.'},
                {t: 'Rollout', d: 'Standardize hardware, deploy via templates, and train your team.'},
                {t: 'Scale', d: 'Centralize reporting, automate campaigns, and optimize pricing.'},
              ].map((s,i)=> (
                <div key={i} className="rounded-2xl border p-6 bg-white">
                  <div className="text-sm uppercase tracking-widest text-slate-500">Step {i+1}</div>
                  <div className="mt-2 text-xl font-semibold">{s.t}</div>
                  <p className="mt-2 text-slate-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Operators are leveling up</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[1,2,3].map((i)=> (
                <div key={i} className="rounded-2xl border p-6 bg-white">
                  <div className="text-lg font-semibold">"Throughput up, headaches down."</div>
                  <p className="mt-2 text-slate-600 text-sm">Our team moved from clunky flows to smooth lanes. Members love the LPR experience, and managers love the data visibility.</p>
                  <div className="mt-4 text-sm text-slate-500">VP of Operations, Multi-site Operator</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Flexible pricing for every stage</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {tiers.map((t)=> (
                <div key={t.name} className={'rounded-2xl border p-6 bg-white flex flex-col ' + (t.featured ? 'ring-2 ring-slate-900' : '')}>
                  <div className="text-sm uppercase tracking-widest text-slate-500">{t.tagline}</div>
                  <div className="mt-2 text-2xl font-semibold">{t.name}</div>
                  <div className="mt-1 text-3xl font-bold">{t.price}</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {t.perks.map(p => (
                      <li key={p} className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5"/> {p}</li>
                    ))}
                  </ul>
                  <a href="#demo" className="mt-6 rounded-xl bg-slate-900 text-white px-4 py-2 text-center font-semibold">Request a quote</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section id="demo" className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold">Talk to our team</h2>
                <p className="mt-3 text-slate-600">Tell us a bit about your operation and we’ll tailor a walkthrough to your goals.</p>
                <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
                  <LeadForm onSaved={(p)=> setLeads(prev => [...prev, p])} />
                </div>
                {admin && (
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={exportCSV} className="rounded-xl border px-4 py-2 font-semibold">Export CSV</button>
                    <span className="text-xs text-slate-500">Admin tools visible (add <code>?admin=1</code> to the URL)</span>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border bg-white p-6">
                  <div className="text-sm uppercase tracking-widest text-slate-500">Why Roller Up</div>
                  <div className="mt-2 text-xl font-semibold">Membership growth on autopilot</div>
                  <p className="mt-2 text-slate-600 text-sm">With one-tap signups, LPR lifetime IDs, and churn prediction, Roller Up turns every visit into a retention moment.</p>
                </div>
                <div className="rounded-2xl border bg-white p-6">
                  <div className="text-sm uppercase tracking-widest text-slate-500">Security</div>
                  <div className="mt-2 text-xl font-semibold">PCI-ready foundation</div>
                  <p className="mt-2 text-slate-600 text-sm">Stripe-native tokenization and best-practice key management keep payments safe and compliant.</p>
                </div>
                <div className="rounded-2xl border bg-white p-6">
                  <div className="text-sm uppercase tracking-widest text-slate-500">APIs</div>
                  <div className="mt-2 text-xl font-semibold">Integrate anything</div>
                  <p className="mt-2 text-slate-600 text-sm">Push events to your data warehouse, run pricing experiments, or sync campaigns—our APIs make it easy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">FAQs</h2>
            <div className="mt-8 divide-y">
              {faqs.map((f,i)=> (
                <details key={i} className="group py-4">
                  <summary className="font-medium cursor-pointer flex items-center justify-between">{f.q}<span className="ml-4">+</span></summary>
                  <p className="mt-2 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="font-semibold">Roller Up</div>
            <div className="text-sm text-slate-600">Fast, modern POS for high-volume car washes.</div>
          </div>
          <div className="flex md:justify-end gap-6 text-sm">
            <a href="#" className="hover:opacity-70">Privacy</a>
            <a href="#" className="hover:opacity-70">Terms</a>
            <a href="#demo" className="hover:opacity-70">Contact</a>
          </div>
        </div>
      </footer>

      {/* SEO & Analytics helpers */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Roller Up",
        url: "https://www.rollerup.com",
        sameAs: ["https://www.linkedin.com/company/"],
        logo: "https://example.com/logo.png"
      }) }} />
    </div>
  )
}
