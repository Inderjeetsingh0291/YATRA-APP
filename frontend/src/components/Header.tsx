const NAV_LINKS = [
  { label: 'PLANNER', href: '#journey' },
  { label: 'WEATHER', href: '#weather' },
  { label: 'PLACES', href: '#places' },
  { label: 'CURRENCY', href: '#currency' },
] as const

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-10 py-8 flex justify-between items-center">
      {/* ── Wordmark ── */}
      <a href="/" className="text-[17px] font-semibold tracking-tight text-white select-none">
        Yatra<sup className="text-[9px] ml-0.5 align-super">TM</sup>
      </a>

      {/* ── Navigation pill ── */}
      <nav className="liquid-glass rounded-full px-2 py-2 flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white px-4 py-1.5 rounded-full transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* ── CTA button ── */}
      <a
        href="#journey"
        className="liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white transition-colors duration-200"
      >
        START YATRA
      </a>
    </header>
  )
}
