import { useState, useEffect } from 'react'
import { Database, Trash2, RefreshCw, Clock } from 'lucide-react'
import { getCacheStats, clearCache } from '../api'
import type { CacheStats } from '../types'

export default function CachePanel() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchStats = async () => {
    setLoading(true)
    try {
      const data = await getCacheStats()
      setStats(data)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    try {
      const res = await clearCache()
      setMessage(res.message)
      fetchStats()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to clear')
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Database size={20} className="text-violet-400" />
          Cache Manager
        </h3>
        <div className="flex gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="liquid-glass rounded-full p-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleClear}
            className="liquid-glass rounded-full p-2 text-red-400/70 hover:text-red-400 transition-colors"
            title="Clear cache"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {message && (
        <p className="text-xs text-green-400 mb-3">{message}</p>
      )}

      {stats && stats.total_entries === 0 && (
        <p className="text-sm text-white/40 text-center py-4">Cache is empty</p>
      )}

      {stats && stats.entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/50 mb-2">
            {stats.total_entries} cached {stats.total_entries === 1 ? 'entry' : 'entries'}
          </p>
          {stats.entries.map((entry) => (
            <div
              key={entry.key}
              className={`bg-white/5 rounded-lg px-3 py-2.5 border text-xs ${
                entry.expired ? 'border-red-500/20' : 'border-white/5'
              }`}
            >
              <p className="font-mono text-white/70 truncate mb-1">{entry.key}</p>
              <div className="flex gap-4 text-white/40">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  Age: {Math.round(entry.age_seconds)}s
                </span>
                <span>TTL: {entry.remaining_seconds > 0 ? `${Math.round(entry.remaining_seconds)}s left` : 'Expired'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
