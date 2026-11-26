import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export type StreamStep = {
  event: string
  label: string
  status: 'pending' | 'loading' | 'done' | 'error'
}

interface Props {
  steps: StreamStep[]
}

export default function StreamProgress({ steps }: Props) {
  if (steps.length === 0) return null

  return (
    <div className="liquid-glass rounded-2xl p-6 max-w-md w-full mx-auto">
      <h3 className="text-sm font-semibold mb-4 tracking-wide text-white/80">
        LIVE STREAM PROGRESS
      </h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.event} className="flex items-center gap-3">
            {step.status === 'pending' && (
              <div className="w-5 h-5 rounded-full border border-white/20" />
            )}
            {step.status === 'loading' && (
              <Loader2 size={20} className="text-blue-400 animate-spin" />
            )}
            {step.status === 'done' && (
              <CheckCircle2 size={20} className="text-green-400" />
            )}
            {step.status === 'error' && (
              <AlertCircle size={20} className="text-red-400" />
            )}
            <span
              className={`text-sm ${
                step.status === 'done'
                  ? 'text-white/80'
                  : step.status === 'loading'
                    ? 'text-white'
                    : 'text-white/40'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
