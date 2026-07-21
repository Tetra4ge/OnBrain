import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Agents',       href: '#agents' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030304]/90 backdrop-blur-lg border-b border-white/8 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_12px_rgba(247,147,26,0.5)]">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="gradient-text">OnBrain</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="font-mono text-xs tracking-wider uppercase text-[#94A3B8] hover:text-[#F7931A] px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/app')}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/app')}>
            Try OnBrain →
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/8 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#030304]/95 backdrop-blur-lg border-b border-white/8 px-6 pb-6">
          <ul className="flex flex-col gap-1 mb-4 pt-4">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleAnchor(e, href)}
                  className="block font-mono text-xs tracking-wider uppercase text-[#94A3B8] hover:text-[#F7931A] px-4 py-3 rounded-lg hover:bg-white/5 transition-all"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Button className="w-full" onClick={() => navigate('/app')}>
            Try OnBrain →
          </Button>
        </div>
      )}
    </header>
  )
}
