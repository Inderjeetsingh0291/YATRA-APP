/* ── TypeScript types mirroring backend Pydantic models ── */

export interface TravelRequest {
  destination: string
  start_date: string   // YYYY-MM-DD
  end_date: string     // YYYY-MM-DD
  base_currency: string
}

export interface WeatherData {
  date: string
  condition: string
  temperature_high: number
  temperature_low: number
  humidity: number
  rain_chance: number
}

export interface Place {
  name: string
  description: string
  category: string
  rating: number
  estimated_time_hours: number
  entry_fee: number | null
}

export interface TravelPlanResponse {
  message: string
  weather_data: WeatherData[]
  places_data: Place[]
  currency_rates: Record<string, number>
}

export interface CacheEntry {
  key: string
  ttl: number
  age_seconds: number
  remaining_seconds: number
  expired: boolean
}

export interface CacheStats {
  total_entries: number
  entries: CacheEntry[]
}

/* ── SSE event payloads ── */
export interface SSEEvent {
  event: string
  data: Record<string, unknown>
}
