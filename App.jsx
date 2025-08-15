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
            <a href="#reel" className="hover:opacity-70">Video</a>
            <a href="#pricing" className="hover:opacity-70">Pricing</a>
            <a href="#demo" className="hover:opacity-70">Get a demo</a>
          </nav>
          <a href="#demo" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold">Talk to sales</a>
        </div>
      </header>

      <main>
        {/* Hero with background video */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx_auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
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
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-emerald-200 blur-3xl rounded-full opacity-60" />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-indigo-200 blur-3xl rounded-full opacity-60" />
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
                <div key={i} className="rounded-2xl border bg_white p-6 grid place-items-center">
                  <img src={l.src} alt={l.name} className="h-8"/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Scroller */}
        <section id="reel" className="py-12 md:py-20 bg-slate-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify_between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold">See it in action</h2>
              <div className="hidden md:flex gap-2">
                <button onClick={() => document.getElementById('vidstrip').scrollBy({ left: -600, behavior: 'smooth' })}
                        className="rounded-xl border px-3 py-2">←</button>
                <button onClick={() => document.getElementById('vidstrip').scrollBy({ left: 600, behavior: 'smooth' })}
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

        {/* Pricing + Demo as before (trimmed for brevity in this drop-in) */}
        {/* You can keep your existing sections below or merge as needed. */}
      </main>
    </div>
  )
}
