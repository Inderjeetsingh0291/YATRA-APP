import { CloudSun, Thermometer, Droplets, CloudRain } from 'lucide-react'
import type { WeatherData } from '../types'

interface Props {
  data: WeatherData[]
}

export default function WeatherCard({ data }: Props) {
  if (!data || data.length === 0) return null

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CloudSun size={20} className="text-yellow-400" />
        Weather Forecast
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((day) => (
          <div
            key={day.date}
            className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/15 transition-colors"
          >
            <p className="text-xs text-white/50 mb-2">{day.date}</p>
            <p className="text-sm font-medium text-white mb-3">{day.condition}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <Thermometer size={14} className="mx-auto mb-1 text-red-400" />
                <p className="text-xs text-white/50">High</p>
                <p className="text-sm font-medium">{day.temperature_high}°</p>
              </div>
              <div>
                <Thermometer size={14} className="mx-auto mb-1 text-blue-400" />
                <p className="text-xs text-white/50">Low</p>
                <p className="text-sm font-medium">{day.temperature_low}°</p>
              </div>
              <div>
                <Droplets size={14} className="mx-auto mb-1 text-cyan-400" />
                <p className="text-xs text-white/50">Humid</p>
                <p className="text-sm font-medium">{day.humidity}%</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-white/50">
              <CloudRain size={12} />
              <span>Rain: {day.rain_chance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
