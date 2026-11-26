import type { TravelRequest, TravelPlanResponse, CacheStats } from './types'

const API_BASE = '/plan'
const STREAM_BASE = '/stream'

/** POST /plan/ — Aggregated travel plan */
export async function createTravelPlan(req: TravelRequest): Promise<TravelPlanResponse> {
  const res = await fetch(`${API_BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}

/** POST /stream/plan — SSE streaming travel plan */
export function streamTravelPlan(
  req: TravelRequest,
  onEvent: (event: string, data: Record<string, unknown>) => void,
  onError: (err: Error) => void,
  onComplete: () => void,
): AbortController {
  const controller = new AbortController()

  fetch(`${STREAM_BASE}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || `Error ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let currentEvent = ''
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim()
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              onEvent(currentEvent, data)
              if (currentEvent === 'complete') {
                onComplete()
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }

      onComplete()
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err)
    })

  return controller
}

/** GET /plan/cache-stats */
export async function getCacheStats(): Promise<CacheStats> {
  const res = await fetch(`${API_BASE}/cache-stats`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

/** DELETE /plan/cache */
export async function clearCache(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/cache`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
