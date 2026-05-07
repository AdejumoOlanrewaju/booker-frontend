import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CheckCircle, ChevronLeft, Zap, Clock, CreditCard,
  MapPin, Phone, Star, ArrowRight, CalendarDays,
  ShieldCheck, Menu, X, Sun, Moon, Sparkles,
  ChevronRight, BadgeCheck, Timer, Users, Scissors,
  Wifi, Lock
} from 'lucide-react'
import api from '../../api/axios'

// ── Google Fonts ──────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', sans-serif; }
    .font-display { font-family: 'Instrument Serif', serif; }
  `}</style>
)

// ── Theme ─────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(false)
  return { dark, toggle: () => setDark(d => !d) }
}

// ── CSS vars helper ───────────────────────────────────
const t = (dark, light, d) => dark ? d : light

// ── Date picker styles ────────────────────────────────
const DPStyles = ({ dark }) => (
  <style>{`
    .react-datepicker-wrapper { width: 100%; }
    .react-datepicker {
      background: ${dark ? '#111827' : '#fff'} !important;
      border: 1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#f0f0f0'} !important;
      border-radius: 20px !important;
      font-family: 'Outfit', sans-serif !important;
      width: 100% !important;
      overflow: hidden !important;
      box-shadow: 0 20px 60px ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'} !important;
    }
    .react-datepicker__month-container { width: 100% !important; }
    .react-datepicker__header {
      background: ${dark ? '#111827' : '#fafafa'} !important;
      border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'} !important;
      padding: 18px 0 10px !important;
    }
    .react-datepicker__current-month {
      color: ${dark ? '#f9fafb' : '#111'} !important;
      font-size: 14px !important; font-weight: 700 !important;
      font-family: 'Outfit', sans-serif !important;
      letter-spacing: -0.2px !important;
    }
    .react-datepicker__navigation { top: 16px !important; }
    .react-datepicker__navigation-icon::before {
      border-color: ${dark ? '#6b7280' : '#9ca3af'} !important;
      border-width: 2px 2px 0 0 !important; width: 6px !important; height: 6px !important;
    }
    .react-datepicker__day-name {
      color: ${dark ? '#374151' : '#d1d5db'} !important;
      font-size: 10px !important; font-weight: 700 !important;
      text-transform: uppercase !important; letter-spacing: 1px !important;
      width: 2.4rem !important; font-family: 'Outfit', sans-serif !important;
    }
    .react-datepicker__day {
      color: ${dark ? '#9ca3af' : '#374151'} !important;
      border-radius: 10px !important; font-size: 13px !important;
      font-weight: 500 !important; width: 2.4rem !important;
      line-height: 2.4rem !important; margin: 2px !important;
      font-family: 'Outfit', sans-serif !important;
      transition: all 0.15s !important;
    }
    .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
      background: ${dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.07)'} !important;
      color: #6366f1 !important;
    }
    .react-datepicker__day--selected {
      background: #6366f1 !important; color: #fff !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 12px rgba(99,102,241,0.35) !important;
    }
    .react-datepicker__day--keyboard-selected {
      background: rgba(99,102,241,0.12) !important; color: #6366f1 !important;
    }
    .react-datepicker__day--disabled {
      color: ${dark ? '#1f2937' : '#e5e7eb'} !important; cursor: not-allowed !important;
    }
    .react-datepicker__day--today:not(.react-datepicker__day--selected) {
      color: #6366f1 !important; font-weight: 800 !important;
      border: 1.5px solid rgba(99,102,241,0.3) !important;
    }
    .react-datepicker__month { padding: 10px !important; }
    .react-datepicker__triangle { display: none !important; }
    .react-datepicker__day-names { margin-top: 6px !important; }
  `}</style>
)

// ── Navbar ────────────────────────────────────────────
function Navbar({ business, dark, onToggle, onBook }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const bg = dark
    ? scrolled ? 'rgba(6,9,20,0.97)' : 'transparent'
    : scrolled ? 'rgba(255,255,255,0.97)' : 'transparent'

  const border = scrolled
    ? dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    : 'transparent'

  return (
    <>
      <FontLink />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: bg,
        borderBottom: `1px solid ${border}`,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 68, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }}>
              <Zap size={16} color='#fff' />
            </div>
            <div>
              <p style={{
                fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px',
                color: dark ? '#f9fafb' : '#111', lineHeight: 1.2
              }}>
                {business?.businessName || 'BookEase'}
              </p>
              <p style={{ fontSize: 11, color: dark ? '#4b5563' : '#9ca3af', fontWeight: 500 }}>
                Online Booking
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}
            className='hidden-mobile'>
            {[['Services', 'services'], ['About', 'about'], ['Contact', 'contact']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                fontSize: 14, fontWeight: 500, background: 'none', border: 'none',
                cursor: 'pointer', color: dark ? '#6b7280' : '#6b7280',
                transition: 'color 0.15s', fontFamily: 'Outfit, sans-serif'
              }}
                onMouseEnter={e => e.target.style.color = '#6366f1'}
                onMouseLeave={e => e.target.style.color = dark ? '#6b7280' : '#6b7280'}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onToggle} style={{
              width: 38, height: 38, borderRadius: 10, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'all 0.15s',
              background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
              color: dark ? '#6b7280' : '#6b7280'
            }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button onClick={onBook} style={{
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: '#6366f1', color: '#fff', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.15s',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
            }}
              className='hidden-mobile'
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <CalendarDays size={14} /> Book Now
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              width: 38, height: 38, borderRadius: 10, border: 'none',
              cursor: 'pointer', display: 'none', alignItems: 'center',
              justifyContent: 'center', background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
              color: dark ? '#9ca3af' : '#6b7280'
            }} className='show-mobile'>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div style={{
            background: dark ? '#060914' : '#fff',
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
            padding: '12px 24px 20px'
          }}>
            {[['Services', 'services'], ['About', 'about'], ['Contact', 'contact']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 0', fontSize: 15, fontWeight: 500,
                background: 'none', border: 'none', cursor: 'pointer',
                color: dark ? '#9ca3af' : '#374151', fontFamily: 'Outfit, sans-serif',
                borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f9fafb'}`
              }}>
                {label}
              </button>
            ))}
            <button onClick={() => { onBook(); setMenuOpen(false) }} style={{
              width: '100%', padding: '13px', marginTop: 12, borderRadius: 12,
              border: 'none', background: '#6366f1', color: '#fff', fontSize: 14,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
              Book an Appointment
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}

// ── Hero ──────────────────────────────────────────────
function Hero({ business, services, dark, onBook }) {
  return (
    <section style={{
      paddingTop: 120,
      background: dark
        ? 'linear-gradient(160deg, #060914 0%, #0d1117 60%, #0a0d1a 100%)'
        : 'linear-gradient(160deg, #fafafa 0%, #f5f3ff 60%, #ede9fe 100%)',
      position: 'relative', overflow: 'hidden'
    }}>

      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 500, height: 500,
        borderRadius: '50%', pointerEvents: 'none',
        background: dark
          ? 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)'
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: -100, width: 400, height: 400,
        borderRadius: '50%', pointerEvents: 'none',
        background: dark
          ? 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)'
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 420px',
          gap: 60, alignItems: 'center'
        }} className='hero-grid'>

          {/* Left */}
          <div>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 99, marginBottom: 28,
              background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
              border: `1px solid ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.18)'}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6366f1' }}>
                Accepting online bookings
              </span>
            </div>

            <h1 className='font-display' style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 400, lineHeight: 1.1,
              letterSpacing: '-1px', marginBottom: 20,
              color: dark ? '#f9fafb' : '#0a0a0a'
            }}>
              Book your visit at{' '}
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {business?.businessName}
              </span>
            </h1>

            <p style={{
              fontSize: 16, lineHeight: 1.75, marginBottom: 36,
              color: dark ? '#6b7280' : '#6b7280', maxWidth: 480,
              fontWeight: 400
            }}>
              {business?.description ||
                'Schedule your appointment online in minutes. Choose your service, pick a time, and we handle the rest.'}
            </p>

            {/* Meta row */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 20,
              marginBottom: 36, alignItems: 'center'
            }}>
              {business?.address && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: dark ? '#4b5563' : '#9ca3af', fontSize: 13
                }}>
                  <MapPin size={13} color='#6366f1' />
                  {business.address}
                </div>
              )}
              {business?.phone && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: dark ? '#4b5563' : '#9ca3af', fontSize: 13
                }}>
                  <Phone size={13} color='#6366f1' />
                  {business.phone}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} color='#f59e0b' fill='#f59e0b' />
                ))}
                <span style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af', marginLeft: 4 }}>
                  5.0 · Excellent
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={onBook} style={{
                padding: '14px 32px', borderRadius: 12, border: 'none',
                background: '#6366f1', color: '#fff', fontSize: 15,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)'
                }}
              >
                <CalendarDays size={17} /> Book an Appointment
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 28px', borderRadius: 12, fontSize: 15,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'transparent', transition: 'all 0.15s',
                  color: dark ? '#6b7280' : '#374151',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.color = '#6366f1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
                  e.currentTarget.style.color = dark ? '#6b7280' : '#374151'
                }}
              >
                Our Services <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Right card */}
          <div style={{
            borderRadius: 24,
            background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#ede9fe'}`,
            boxShadow: dark
              ? '0 32px 64px rgba(0,0,0,0.4)'
              : '0 32px 64px rgba(99,102,241,0.1)',
            overflow: 'hidden'
          }}>
            {/* Card header */}
            <div style={{
              padding: '24px 24px 0',
              background: dark
                ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.03))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: '#fff',
                  boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  {business?.businessName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{
                    fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px',
                    color: dark ? '#f9fafb' : '#111'
                  }}>
                    {business?.businessName}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
                      boxShadow: '0 0 0 2px rgba(74,222,128,0.25)'
                    }} />
                    <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>
                      Open · Accepting bookings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div style={{ padding: '0 24px 24px' }}>
              {[
                { icon: Zap, label: 'Instant confirmation', desc: 'Booking confirmed immediately' },
                { icon: Lock, label: 'Secure payment', desc: 'Protected by Paystack' },
                { icon: BadgeCheck, label: 'Verified business', desc: 'Trusted & reviewed' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 0',
                  borderTop: i === 0
                    ? `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f3f0ff'}`
                    : `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#fafafa'}`
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={15} color='#6366f1' />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#e5e7eb' : '#111' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', marginTop: 1 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}

              <button onClick={onBook} style={{
                width: '100%', padding: '14px', marginTop: 8, borderRadius: 14,
                border: 'none', background: '#6366f1', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
                boxShadow: '0 6px 20px rgba(99,102,241,0.3)'
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <CalendarDays size={15} /> Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ── Services section ──────────────────────────────────
function ServicesSection({ services, dark, onSelect }) {
  return (
    <section id='services' style={{
      background: dark ? '#08090f' : '#fff',
      padding: '80px 0',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f5f5f5'}`
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
            color: '#6366f1', marginBottom: 10
          }}>
            Services
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 className='font-display' style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400,
              letterSpacing: '-0.5px', color: dark ? '#f9fafb' : '#0a0a0a',
              lineHeight: 1.15
            }}>
              What we offer
            </h2>
            <p style={{ fontSize: 14, color: dark ? '#4b5563' : '#9ca3af', maxWidth: 280 }}>
              Select a service below to begin booking your appointment
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16
        }}>
          {services.map((service, i) => (
            <ServiceCard
              key={service._id}
              service={service}
              dark={dark}
              index={i}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, dark, index, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const icons = [Scissors, Sparkles, Star, Users, Timer, CalendarDays]
  const Icon = icons[index % icons.length]

  return (
    <button
      onClick={() => onSelect(service)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left', padding: 28, borderRadius: 20,
        cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif',
        transition: 'all 0.2s',
        background: hovered
          ? dark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)'
          : dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: hovered ? 'rgba(99,102,241,0.35)' : dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0',
        boxShadow: hovered
          ? '0 12px 32px rgba(99,102,241,0.1)'
          : '0 1px 4px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, marginBottom: 20,
        background: hovered
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hovered ? '0 6px 16px rgba(99,102,241,0.35)' : 'none'
      }}>
        <Icon size={20} color={hovered ? '#fff' : '#6366f1'} />
      </div>

      <h3 style={{
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px',
        color: dark ? '#f9fafb' : '#111', marginBottom: 6
      }}>
        {service.name}
      </h3>

      {service.description && (
        <p style={{
          fontSize: 13, lineHeight: 1.65, marginBottom: 20,
          color: dark ? '#4b5563' : '#6b7280'
        }}>
          {service.description}
        </p>
      )}

      <div style={{
        marginTop: 'auto', paddingTop: 16,
        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.5px' }}>
            ₦{service.price?.toLocaleString()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Clock size={11} color={dark ? '#4b5563' : '#9ca3af'} />
            <span style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', fontWeight: 500 }}>
              {service.duration} min
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10,
          background: hovered ? '#6366f1' : dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
          transition: 'all 0.2s'
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: hovered ? '#fff' : '#6366f1'
          }}>
            Book
          </span>
          <ArrowRight size={13} color={hovered ? '#fff' : '#6366f1'} />
        </div>
      </div>
    </button>
  )
}

// ── About section ─────────────────────────────────────
function AboutSection({ business, dark }) {
  return (
    <section id='about' style={{
      background: dark
        ? 'linear-gradient(135deg, #060914 0%, #080c18 100%)'
        : 'linear-gradient(135deg, #fafafa 0%, #f5f3ff 100%)',
      padding: '80px 0',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.1)'}`
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 60, alignItems: 'center'
        }} className='about-grid'>

          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', color: '#6366f1', marginBottom: 12
            }}>
              About Us
            </p>
            <h2 className='font-display' style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 400, letterSpacing: '-0.5px',
              color: dark ? '#f9fafb' : '#0a0a0a',
              lineHeight: 1.2, marginBottom: 20
            }}>
              {business?.businessName}
            </h2>
            <p style={{
              fontSize: 15, lineHeight: 1.8,
              color: dark ? '#6b7280' : '#6b7280', marginBottom: 32
            }}>
              {business?.description ||
                'We are committed to delivering an exceptional experience for every client. Our team is dedicated to quality, precision, and your satisfaction.'}
            </p>

            {business?.address && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 18px', borderRadius: 12, marginBottom: 10,
                background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`
              }}>
                <MapPin size={15} color='#6366f1' />
                <span style={{ fontSize: 14, color: dark ? '#9ca3af' : '#374151' }}>
                  {business.address}
                </span>
              </div>
            )}

            {business?.phone && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 18px', borderRadius: 12,
                background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`
              }}>
                <Phone size={15} color='#6366f1' />
                <span style={{ fontSize: 14, color: dark ? '#9ca3af' : '#374151' }}>
                  {business.phone}
                </span>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: Zap, title: 'Instant Booking', desc: 'Confirmed immediately after payment' },
              { icon: ShieldCheck, title: 'Secure Payments', desc: 'Powered by Paystack, fully encrypted' },
              { icon: CalendarDays, title: 'Flexible Scheduling', desc: 'Choose any available time slot' },
              { icon: BadgeCheck, title: 'Trusted Service', desc: 'Rated 5 stars by our clients' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                padding: '20px', borderRadius: 16,
                background: dark ? 'rgba(255,255,255,0.02)' : '#fff',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, marginBottom: 14,
                  background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={16} color='#6366f1' />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: dark ? '#e5e7eb' : '#111', marginBottom: 5 }}>
                  {title}
                </p>
                <p style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ── Contact CTA section ───────────────────────────────
function ContactSection({ business, dark, onBook }) {
  return (
    <section id='contact' style={{
      background: dark ? '#08090f' : '#fff',
      padding: '80px 0'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          borderRadius: 28, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #7c3aed 100%)',
          padding: '64px 48px',
          boxShadow: '0 32px 64px rgba(99,102,241,0.3)'
        }}>
          {/* BG pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 300, height: 300,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)'
          }} />

          <div style={{
            position: 'relative', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 32
          }}>
            <div>
              <p style={{
                fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                marginBottom: 12
              }}>
                Ready to book?
              </p>
              <h2 className='font-display' style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 400, color: '#fff',
                letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 12
              }}>
                Schedule your appointment today
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 420 }}>
                Book online in minutes — no phone calls, no waiting.
                Get instant confirmation straight to your email.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <button onClick={onBook} style={{
                padding: '15px 32px', borderRadius: 14, border: 'none',
                background: '#fff', color: '#4f46e5', fontSize: 15,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <CalendarDays size={17} /> Book an Appointment
              </button>
              {business?.phone && (
                <a href={`tel:${business.phone}`} style={{
                  padding: '15px 32px', borderRadius: 14, textDecoration: 'none',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Outfit, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 8,
                  justifyContent: 'center', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >
                  <Phone size={16} /> Call Us
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────
function Footer({ business, dark }) {
  return (
    <footer style={{
      background: dark ? '#030408' : '#fafafa',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'}`,
      padding: '28px 24px'
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={11} color='#fff' />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: dark ? '#374151' : '#9ca3af' }}>
            Powered by BookEase
          </span>
        </div>
        <p style={{ fontSize: 12, color: dark ? '#1f2937' : '#d1d5db' }}>
          © {new Date().getFullYear()} {business?.businessName}
        </p>
      </div>
    </footer>
  )
}

// ── Booking Modal ─────────────────────────────────────
function BookingModal({ services, business, dark, onClose }) {
  const { businessId } = useParams()
  const [step, setStep] = useState('service')
  const [submitting, setSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [createdBooking, setCreatedBooking] = useState(null)

  const STEPS = ['service', 'datetime', 'details', 'payment', 'confirmation']

  const stepTitles = {
    service: 'Choose a Service',
    datetime: 'Pick Date & Time',
    details: 'Your Details',
    payment: 'Complete Payment',
    confirmation: 'Booking Confirmed'
  }

  const goBack = () => {
    if (step === 'service') { onClose(); return }
    const i = STEPS.indexOf(step)
    if (i > 0) setStep(STEPS[i - 1])
  }

  const handlePaymentSuccess = async (reference) => {
    try {
      setSubmitting(true)
      const res = await api.post('/bookings', {
        businessId,
        serviceId: selectedService._id,
        ...customerDetails,
        date: selectedDateTime.date,
        startTime: selectedDateTime.slot.startTime,
        paystackReference: reference.reference
      })
      setCreatedBooking(res.data)
      setStep('confirmation')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', padding: '0'
      }}
      className='modal-outer'
    >
      <div style={{
        width: '100%', maxWidth: 520,
        maxHeight: '92vh', overflowY: 'auto',
        background: dark ? '#0d1117' : '#fff',
        borderRadius: '24px 24px 0 0',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
        boxShadow: '0 -24px 64px rgba(0,0,0,0.25)'
      }} className='modal-inner'>

        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{
            width: 36, height: 4, borderRadius: 99,
            background: dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px 16px',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {step !== 'confirmation' && (
              <button onClick={goBack} style={{
                width: 32, height: 32, borderRadius: 9, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', transition: 'all 0.15s',
                background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
                color: dark ? '#6b7280' : '#6b7280'
              }}>
                <ChevronLeft size={16} />
              </button>
            )}
            <div>
              <p style={{
                fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px',
                color: dark ? '#f9fafb' : '#111'
              }}>
                {stepTitles[step]}
              </p>
              <p style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', marginTop: 1 }}>
                {business?.businessName}
              </p>
            </div>
          </div>

          {step !== 'confirmation' && (
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 9, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
              color: dark ? '#6b7280' : '#9ca3af'
            }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Progress */}
        {step !== 'confirmation' && (
          <div style={{ padding: '16px 24px 0' }}>
            <ModalProgress step={step} dark={dark} />
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '20px 24px 32px' }}>
          {submitting ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16, padding: '48px 0'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '2.5px solid #6366f1',
                borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite'
              }} />
              <p style={{ fontSize: 14, color: dark ? '#4b5563' : '#9ca3af' }}>
                Confirming your booking...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              {step === 'service' && (
                <ModalServiceStep services={services} dark={dark}
                  onSelect={(s) => { setSelectedService(s); setStep('datetime') }} />
              )}
              {step === 'datetime' && (
                <ModalDateTimeStep business={business} service={selectedService}
                  dark={dark}
                  onSelect={(dt) => { setSelectedDateTime(dt); setStep('details') }} />
              )}
              {step === 'details' && (
                <ModalDetailsStep dark={dark}
                  onSubmit={(d) => { setCustomerDetails(d); setStep('payment') }}
                  loading={submitting} />
              )}
              {step === 'payment' && (
                <ModalPaymentStep booking={customerDetails} service={selectedService}
                  datetime={selectedDateTime} dark={dark}
                  onSuccess={handlePaymentSuccess} onBack={goBack} />
              )}
              {step === 'confirmation' && (
                <ModalConfirmation booking={createdBooking} dark={dark} onClose={onClose} />
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .modal-outer { align-items: center !important; padding: 24px !important; }
          .modal-inner { border-radius: 24px !important; }
        }
      `}</style>
    </div>
  )
}

// ── Modal progress ────────────────────────────────────
function ModalProgress({ step, dark }) {
  const steps = ['Service', 'Date & Time', 'Details', 'Payment']
  const current = ['service', 'datetime', 'details', 'payment'].indexOf(step)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              height: 3, width: '100%', borderRadius: 99, transition: 'all 0.4s',
              background: i <= current ? '#6366f1' : dark ? '#1f2937' : '#f0f0f0'
            }} />
            <span style={{
              fontSize: 10, fontWeight: 600, transition: 'color 0.2s',
              color: i === current ? '#6366f1' : dark ? '#374151' : '#d1d5db'
            }}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Modal step components ─────────────────────────────
function ModalServiceStep({ services, dark, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af', marginBottom: 4 }}>
        Select a service to continue
      </p>
      {services.map((service) => (
        <ServiceRowButton key={service._id} service={service} dark={dark} onSelect={onSelect} />
      ))}
    </div>
  )
}

function ServiceRowButton({ service, dark, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onSelect(service)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left', padding: '18px 20px', borderRadius: 16,
        cursor: 'pointer', border: 'none', fontFamily: 'Outfit, sans-serif',
        transition: 'all 0.15s',
        background: hovered
          ? dark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)'
          : dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: hovered
          ? 'rgba(99,102,241,0.3)'
          : dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 14, fontWeight: 700, marginBottom: 4,
            color: dark ? '#f9fafb' : '#111'
          }}>
            {service.name}
          </p>
          {service.description && (
            <p style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', lineHeight: 1.55, marginBottom: 8 }}>
              {service.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={11} color='#6366f1' />
            <span style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', fontWeight: 500 }}>
              {service.duration} min
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.3px' }}>
            ₦{service.price?.toLocaleString()}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            justifyContent: 'flex-end', marginTop: 6
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: hovered ? '#6366f1' : dark ? '#374151' : '#9ca3af' }}>
              Select
            </span>
            <ArrowRight size={11} color={hovered ? '#6366f1' : dark ? '#374151' : '#d1d5db'} />
          </div>
        </div>
      </div>
    </button>
  )
}

function ModalDateTimeStep({ business, service, dark, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [message, setMessage] = useState('')

  const fetchSlots = async (date) => {
    try {
      setLoadingSlots(true); setSlots([]); setSelectedSlot(null); setMessage('')
      const formatted = date.toISOString().split('T')[0]
      const res = await api.get(`/availability/slots/${business._id}/${formatted}/${service._id}`)
      setSlots(res.data.slots || [])
      if (res.data.message) setMessage(res.data.message)
    } catch (err) { console.error(err) }
    finally { setLoadingSlots(false) }
  }

  const isOpenDay = (date) => {
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const openDays = business.workingHours?.filter(d => d.isOpen).map(d => dayNames.indexOf(d.day))
    return openDays?.includes(date.getDay()) ?? true
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Service chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', borderRadius: 8,
        background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
        width: 'fit-content'
      }}>
        <Scissors size={12} color='#6366f1' />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6366f1' }}>
          {service.name} · {service.duration} mins
        </span>
      </div>

      <DPStyles dark={dark} />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => { setSelectedDate(date); fetchSlots(date) }}
        minDate={new Date()}
        filterDate={isOpenDay}
        inline
      />

      {selectedDate && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: dark ? '#e5e7eb' : '#111' }}>
              Available Times
            </p>
            <p style={{ fontSize: 12, color: dark ? '#374151' : '#9ca3af' }}>
              {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>

          {loadingSlots ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '2px solid #6366f1', borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite'
              }} />
            </div>
          ) : message || slots.length === 0 ? (
            <div style={{
              padding: '20px', textAlign: 'center', borderRadius: 14,
              background: dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f0f0f0'}`
            }}>
              <p style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af' }}>
                {message || 'No available slots on this date'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {slots.map((slot) => (
                <SlotButton
                  key={slot.startTime} slot={slot} dark={dark}
                  selected={selectedSlot?.startTime === slot.startTime}
                  onSelect={() => setSelectedSlot(slot)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <PrimaryButton
        disabled={!selectedDate || !selectedSlot}
        onClick={() => onSelect({ date: selectedDate.toISOString().split('T')[0], slot: selectedSlot })}
      >
        Continue <ArrowRight size={15} />
      </PrimaryButton>
    </div>
  )
}

function SlotButton({ slot, dark, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  if (!slot.isAvailable) return (
    <div style={{
      padding: '10px 0', borderRadius: 10, textAlign: 'center',
      fontSize: 12, fontWeight: 600,
      color: dark ? '#1f2937' : '#e5e7eb',
      background: dark ? 'rgba(255,255,255,0.01)' : '#fafafa',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.02)' : '#f5f5f5'}`,
      textDecoration: 'line-through'
    }}>
      {slot.startTime}
    </div>
  )

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 0', borderRadius: 10, border: 'none',
        cursor: 'pointer', textAlign: 'center',
        fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
        transition: 'all 0.15s',
        background: selected ? '#6366f1' : hovered
          ? dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)'
          : dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: selected ? '#6366f1' : hovered
          ? 'rgba(99,102,241,0.3)'
          : dark ? 'rgba(255,255,255,0.06)' : '#ededef',
        color: selected ? '#fff' : hovered ? '#6366f1' : dark ? '#9ca3af' : '#374151',
        boxShadow: selected ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
      }}
    >
      {slot.startTime}
    </button>
  )
}

function ModalDetailsStep({ dark, onSubmit, loading }) {
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = 'Required'
    if (!form.customerEmail.trim()) e.customerEmail = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) e.customerEmail = 'Invalid email'
    if (!form.customerPhone.trim()) e.customerPhone = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const fields = [
    { name: 'customerName', label: 'Full name', type: 'text', placeholder: 'John Doe' },
    { name: 'customerEmail', label: 'Email address', type: 'email', placeholder: 'john@example.com' },
    { name: 'customerPhone', label: 'Phone number', type: 'tel', placeholder: '08012345678' },
  ]

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(form) }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <p style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af' }}>
        We'll send your booking confirmation to these details
      </p>

      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            fontSize: 13, fontWeight: 600,
            color: dark ? '#9ca3af' : '#374151'
          }}>
            {label}
          </label>
          <input
            type={type} placeholder={placeholder} value={form[name]}
            onChange={e => setForm({ ...form, [name]: e.target.value })}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              fontFamily: 'Outfit, sans-serif', fontSize: 14, outline: 'none',
              transition: 'all 0.15s',
              background: dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
              border: `1px solid ${errors[name]
                ? 'rgba(239,68,68,0.4)'
                : dark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'}`,
              color: dark ? '#e5e7eb' : '#111'
            }}
          />
          {errors[name] && (
            <span style={{ fontSize: 12, color: '#ef4444' }}>{errors[name]}</span>
          )}
        </div>
      ))}

      {/* Privacy note */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px', borderRadius: 12,
        background: dark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.04)',
        border: `1px solid ${dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.1)'}`
      }}>
        <ShieldCheck size={14} color='#6366f1' style={{ marginTop: 1, flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af', lineHeight: 1.55 }}>
          Your details are shared only with the business for appointment purposes.
        </p>
      </div>

      <PrimaryButton type='submit' loading={loading}>
        {!loading && <>Continue <ArrowRight size={15} /></>}
      </PrimaryButton>
    </form>
  )
}

function ModalPaymentStep({ booking, service, datetime, dark, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: booking.customerEmail,
      amount: service.price * 100,
      ref: `BK-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: booking.customerName },
          { display_name: 'Service', variable_name: 'service', value: service.name },
        ]
      },
      callback: (res) => { setLoading(false); onSuccess(res) },
      onClose: () => setLoading(false)
    })
    handler.openIframe()
  }

  const rows = [
    ['Service', service.name],
    ['Duration', `${service.duration} mins`],
    ['Date', new Date(datetime.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })],
    ['Time', datetime.slot.startTime],
    ['Name', booking.customerName],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary card */}
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        background: dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`
      }}>
        <div style={{
          padding: '12px 18px',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f5f5f5'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: dark ? '#374151' : '#9ca3af' }}>
            Order Summary
          </p>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
            background: 'rgba(74,222,128,0.1)', color: '#4ade80',
            border: '1px solid rgba(74,222,128,0.2)'
          }}>
            Ready
          </span>
        </div>
        <div style={{ padding: '4px 0' }}>
          {rows.map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 18px', gap: 16
            }}>
              <span style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af', flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', color: dark ? '#e5e7eb' : '#111' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
        {/* Total */}
        <div style={{
          margin: '0 16px 16px',
          padding: '14px 18px', borderRadius: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: dark
            ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))'
            : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.03))',
          border: `1px solid ${dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#9ca3af' : '#374151' }}>
            Total
          </span>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#6366f1', letterSpacing: '-1px' }}>
            ₦{service.price?.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handlePay} disabled={loading}
        style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: loading ? 'rgba(99,102,241,0.6)' : '#6366f1',
          color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Outfit, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          transition: 'all 0.15s'
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
              animation: 'spin 0.7s linear infinite'
            }} />
            Opening checkout...
          </>
        ) : (
          <><CreditCard size={16} /> Pay ₦{service.price?.toLocaleString()}</>
        )}
      </button>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
      }}>
        <Lock size={11} color={dark ? '#374151' : '#d1d5db'} />
        <p style={{ fontSize: 12, color: dark ? '#374151' : '#9ca3af' }}>
          256-bit SSL · Secured by Paystack
        </p>
      </div>
    </div>
  )
}

function ModalConfirmation({ booking, dark, onClose }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: 20, paddingTop: 8
    }}>
      {/* Success icon */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CheckCircle size={36} color='#4ade80' />
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(i => <Star key={i} size={14} color='#f59e0b' fill='#f59e0b' />)}
      </div>

      <div>
        <h3 style={{
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px',
          color: dark ? '#f9fafb' : '#111', marginBottom: 8,
          fontFamily: 'Outfit, sans-serif'
        }}>
          Booking Confirmed!
        </h3>
        <p style={{
          fontSize: 14, color: dark ? '#4b5563' : '#9ca3af',
          lineHeight: 1.65, maxWidth: 300, margin: '0 auto'
        }}>
          Your appointment has been confirmed and a summary has been sent to your email.
        </p>
      </div>

      {/* Details */}
      <div style={{
        width: '100%', borderRadius: 16, overflow: 'hidden',
        background: dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`
      }}>
        <div style={{
          padding: '11px 18px',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f5f5f5'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: dark ? '#374151' : '#9ca3af' }}>
            Booking Details
          </p>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
            background: 'rgba(74,222,128,0.1)', color: '#4ade80',
            border: '1px solid rgba(74,222,128,0.2)'
          }}>
            Confirmed
          </span>
        </div>
        <div style={{ padding: '4px 0' }}>
          {[
            { label: 'Reference', value: booking?.reference, accent: true, mono: true },
            { label: 'Service', value: booking?.service?.name },
            { label: 'Date', value: booking?.date ? new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '' },
            { label: 'Time', value: booking?.startTime },
            { label: 'Name', value: booking?.customerName },
          ].map(({ label, value, accent, mono }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 18px', gap: 16
            }}>
              <span style={{ fontSize: 13, color: dark ? '#4b5563' : '#9ca3af', flexShrink: 0 }}>
                {label}
              </span>
              <span style={{
                fontSize: mono ? 12 : 13,
                fontFamily: mono ? 'monospace' : 'Outfit, sans-serif',
                fontWeight: 600, textAlign: 'right',
                color: accent ? '#6366f1' : dark ? '#e5e7eb' : '#111'
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onClose} style={{
        width: '100%', padding: '13px', borderRadius: 14, border: 'none',
        fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.15s',
        background: dark ? 'rgba(255,255,255,0.05)' : '#f4f4f5',
        color: dark ? '#6b7280' : '#374151'
      }}>
        Done
      </button>
    </div>
  )
}

// ── Shared button ─────────────────────────────────────
function PrimaryButton({ children, onClick, disabled, type = 'button', loading }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={{
      width: '100%', padding: '15px', borderRadius: 14, border: 'none',
      background: disabled ? 'rgba(99,102,241,0.3)' : '#6366f1',
      color: '#fff', fontSize: 15, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'Outfit, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: disabled ? 'none' : '0 8px 20px rgba(99,102,241,0.25)',
      transition: 'all 0.15s'
    }}>
      {loading ? (
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
          animation: 'spin 0.7s linear infinite'
        }} />
      ) : children}
    </button>
  )
}

// ── Main ──────────────────────────────────────────────
export default function PublicBooking() {
  const { businessId } = useParams()
  const { dark, toggle } = useTheme()
  const [business, setBusiness] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [hoursRes, servicesRes] = await Promise.all([
          api.get(`/availability/hours/${businessId}`),
          api.get(`/services/public/${businessId}`)
        ])
        setBusiness(hoursRes.data)
        setServices(servicesRes.data)
      } catch { setError('Business not found') }
      finally { setLoading(false) }
    }
    fetch()
  }, [businessId])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      background: dark ? '#060914' : '#fafafa'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '2.5px solid #6366f1', borderTopColor: 'transparent',
        animation: 'spin 0.7s linear infinite'
      }} />
      <p style={{ fontSize: 14, color: dark ? '#374151' : '#9ca3af', fontFamily: 'Outfit, sans-serif' }}>
        Loading...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 8,
      background: dark ? '#060914' : '#fafafa'
    }}>
      <p style={{ fontSize: 18, fontWeight: 700, color: dark ? '#f9fafb' : '#111', fontFamily: 'Outfit, sans-serif' }}>
        Not found
      </p>
      <p style={{ fontSize: 14, color: dark ? '#4b5563' : '#9ca3af', fontFamily: 'Outfit, sans-serif' }}>
        {error}
      </p>
    </div>
  )

  return (
    <div style={{
      background: dark ? '#060914' : '#fff',
      minHeight: '100vh', transition: 'background 0.25s',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <Navbar business={business} dark={dark} onToggle={toggle} onBook={() => setBookingOpen(true)} />
      <Hero business={business} services={services} dark={dark} onBook={() => setBookingOpen(true)} />
      <ServicesSection services={services} dark={dark} onSelect={() => setBookingOpen(true)} />
      <AboutSection business={business} dark={dark} />
      <ContactSection business={business} dark={dark} onBook={() => setBookingOpen(true)} />
      <Footer business={business} dark={dark} />

      {bookingOpen && (
        <BookingModal
          services={services}
          business={business}
          dark={dark}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}