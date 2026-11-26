import { useState } from 'react'
import { MapPin, Calendar, Coins, Plane, Zap } from 'lucide-react'
import type { TravelRequest } from '../types'

const DESTINATIONS = [
  { value: 'manali', label: 'Manali' },
  { value: 'goa', label: 'Goa' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'punjab', label: 'Punjab' },
]

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY']

interface Props {
  onSubmit: (req: TravelRequest) => void
  onStreamSubmit: (req: TravelRequest) => void
  loading: boolean
}

export default function TravelForm({ onSubmit, onStreamSubmit, loading }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [destination, setDestination] = useState('goa')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  })
  const [currency, setCurrency] = useState('INR')

  const buildRequest = (): TravelRequest => ({
    destination,
    start_date: startDate,
    end_date: endDate,
    base_currency: currency,
  })

  return (
    <div className="liquid-glass rounded-3xl p-8 max-w-2xl w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <Plane size={24} className="text-white/80" />
        Plan Your Yatra
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Destination */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-white/60 uppercase flex items-center gap-1.5">
            <MapPin size={12} /> Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
              focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
          >
            {DESTINATIONS.map((d) => (
              <option key={d.value} value={d.value} className="bg-zinc-900">
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-white/60 uppercase flex items-center gap-1.5">
            <Coins size={12} /> Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
              focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-zinc-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Start date */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-white/60 uppercase flex items-center gap-1.5">
            <Calendar size={12} /> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
              focus:outline-none focus:border-white/30 transition-colors
              [color-scheme:dark]"
          />
        </div>

        {/* End date */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-white/60 uppercase flex items-center gap-1.5">
            <Calendar size={12} /> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
              focus:outline-none focus:border-white/30 transition-colors
              [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={() => onSubmit(buildRequest())}
          disabled={loading}
          className="flex-1 bg-white text-black text-[14px] font-semibold rounded-full px-6 py-3.5
            transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.15)]
            active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          <Plane size={16} />
          {loading ? 'Planning...' : 'Get Full Plan'}
        </button>
        <button
          onClick={() => onStreamSubmit(buildRequest())}
          disabled={loading}
          className="flex-1 liquid-glass rounded-full px-6 py-3.5 text-[14px] font-semibold text-white/90
            transition-all duration-200 hover:text-white hover:scale-[1.02]
            active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          {loading ? 'Streaming...' : 'Stream Live'}
        </button>
      </div>
    </div>
  )
}
