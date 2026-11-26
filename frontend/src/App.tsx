import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import HeroHeadline from './components/HeroHeadline'
import BottomBlock from './components/BottomBlock'
import VideoBackground from './components/VideoBackground'
import TravelForm from './components/TravelForm'
import WeatherCard from './components/WeatherCard'
import PlacesCard from './components/PlacesCard'
import CurrencyCard from './components/CurrencyCard'
import StreamProgress from './components/StreamProgress'
import CachePanel from './components/CachePanel'
import type { StreamStep } from './components/StreamProgress'
import type { TravelRequest, WeatherData, Place } from './types'
import { createTravelPlan, streamTravelPlan } from './api'

export default function App() {
  const plannerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Results state
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [placesData, setPlacesData] = useState<Place[]>([])
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({})
  const [baseCurrency, setBaseCurrency] = useState('INR')
  const [showResults, setShowResults] = useState(false)

  // Stream state
  const [streamSteps, setStreamSteps] = useState<StreamStep[]>([])
  const controllerRef = useRef<AbortController | null>(null)

  const scrollToPlanner = useCallback(() => {
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const clearResults = () => {
    setWeatherData([])
    setPlacesData([])
    setCurrencyRates({})
    setShowResults(false)
    setStreamSteps([])
    setError(null)
  }

  /* ── Aggregated fetch (POST /plan/) ── */
  const handleSubmit = async (req: TravelRequest) => {
    clearResults()
    setLoading(true)
    setBaseCurrency(req.base_currency)
    try {
      const data = await createTravelPlan(req)
      setWeatherData(data.weather_data)
      setPlacesData(data.places_data)
      setCurrencyRates(data.currency_rates)
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ── SSE streaming fetch (POST /stream/plan) ── */
  const handleStreamSubmit = (req: TravelRequest) => {
    clearResults()
    setLoading(true)
    setBaseCurrency(req.base_currency)

    const initialSteps: StreamStep[] = [
      { event: 'start', label: 'Starting aggregation…', status: 'pending' },
      { event: 'weather', label: 'Fetching weather data…', status: 'pending' },
      { event: 'weather_complete', label: 'Weather data received', status: 'pending' },
      { event: 'options', label: 'Fetching places…', status: 'pending' },
      { event: 'options_complete', label: 'Places data received', status: 'pending' },
      { event: 'currency', label: 'Fetching currency rates…', status: 'pending' },
      { event: 'currency_complete', label: 'Currency data received', status: 'pending' },
      { event: 'complete', label: 'All done!', status: 'pending' },
    ]
    setStreamSteps(initialSteps)

    controllerRef.current = streamTravelPlan(
      req,
      (event, data) => {
        // Update step statuses
        setStreamSteps((prev) =>
          prev.map((s) => {
            if (s.event === event) return { ...s, status: 'done' }
            // Mark next step as loading
            const idx = prev.findIndex((p) => p.event === event)
            const nextIdx = idx + 1
            if (nextIdx < prev.length && prev[nextIdx].event === s.event && s.status === 'pending') {
              return { ...s, status: 'loading' }
            }
            return s
          }),
        )

        // Collect data from completed events
        if (event === 'weather_complete' && data.weather_data) {
          setWeatherData(data.weather_data as WeatherData[])
        }
        if (event === 'options_complete' && data.places_data) {
          setPlacesData(data.places_data as Place[])
        }
        if (event === 'currency_complete' && data.currency_data) {
          setCurrencyRates(data.currency_data as Record<string, number>)
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      () => {
        setShowResults(true)
        setLoading(false)
        setStreamSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
      },
    )
  }

  const hasAnyData = weatherData.length > 0 || placesData.length > 0 || Object.keys(currencyRates).length > 0

  return (
    <div
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Full-screen cinematic hero ── */}
      <section className="relative h-screen">
        <VideoBackground />
        <Header />
        <HeroHeadline />
        <BottomBlock onPlanClick={scrollToPlanner} />
      </section>

      {/* ── Planner section ── */}
      <section
        ref={plannerRef}
        id="journey"
        className="relative z-10 bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen py-20 px-4 sm:px-8"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Travel form */}
          <TravelForm
            onSubmit={handleSubmit}
            onStreamSubmit={handleStreamSubmit}
            loading={loading}
          />

          {/* Error */}
          {error && (
            <div className="liquid-glass rounded-2xl p-4 border border-red-500/20 max-w-2xl mx-auto">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Stream progress */}
          {streamSteps.length > 0 && <StreamProgress steps={streamSteps} />}

          {/* Results */}
          {hasAnyData && (
            <div className="space-y-6 animate-in fade-in duration-700">
              {weatherData.length > 0 && (
                <div id="weather">
                  <WeatherCard data={weatherData} />
                </div>
              )}
              {placesData.length > 0 && (
                <div id="places">
                  <PlacesCard data={placesData} />
                </div>
              )}
              {Object.keys(currencyRates).length > 0 && (
                <div id="currency">
                  <CurrencyCard baseCurrency={baseCurrency} rates={currencyRates} />
                </div>
              )}
            </div>
          )}

          {/* Cache manager */}
          {showResults && <CachePanel />}
        </div>
      </section>
    </div>
  )
}
