import { MapPin, Star, Clock, Ticket } from 'lucide-react'
import type { Place } from '../types'

interface Props {
  data: Place[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Nature: 'bg-green-500/20 text-green-300',
  Beach: 'bg-cyan-500/20 text-cyan-300',
  'Historical Site': 'bg-amber-500/20 text-amber-300',
  'Religious Site': 'bg-purple-500/20 text-purple-300',
  'Educational Institution': 'bg-blue-500/20 text-blue-300',
}

export default function PlacesCard({ data }: Props) {
  if (!data || data.length === 0) return null

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-emerald-400" />
        Places to Visit
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((place) => (
          <div
            key={place.name}
            className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/15 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">{place.name}</h4>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  CATEGORY_COLORS[place.category] || 'bg-white/10 text-white/60'
                }`}
              >
                {place.category}
              </span>
            </div>
            <p className="text-xs text-white/50 mb-3 leading-relaxed">{place.description}</p>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" />
                {place.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {place.estimated_time_hours}h
              </span>
              {place.entry_fee !== null && (
                <span className="flex items-center gap-1">
                  <Ticket size={12} />
                  ₹{place.entry_fee}
                </span>
              )}
              {place.entry_fee === null && (
                <span className="flex items-center gap-1 text-green-400">
                  <Ticket size={12} />
                  Free
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
