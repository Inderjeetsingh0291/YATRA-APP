import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'

interface Props {
  onPlanClick: () => void
}

export default function BottomBlock({ onPlanClick }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`absolute bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-6
        transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* ── Tagline paragraph ── */}
      <p className="max-w-[620px] text-[15px] leading-relaxed text-center px-6">
        <span className="text-white">
          Yatra brings live weather forecasts, curated destinations, and real-time exchange rates together.
        </span>
        <span className="text-white/55">
          {' '}From Manali peaks to Goa shores — seamless, instant, and built for your trip.
        </span>
      </p>

      {/* ── CTA button ── */}
      <button
        onClick={onPlanClick}
        className="bg-white text-black text-[15px] font-medium rounded-full px-8 py-3.5
          transition-all duration-200
          hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)]
          active:scale-[0.97]"
      >
        Plan my Yatra today
      </button>

      {/* ── Trust badge ── */}
      <div className="flex items-center gap-2">
        <Lock size={13} strokeWidth={1.5} className="text-white/70" />
        <span className="text-[11px] font-medium tracking-[0.14em] text-white/70">
          LIVE WEATHER. CURATED PLACES. REAL-TIME CURRENCY.
        </span>
      </div>
    </div>
  )
}
