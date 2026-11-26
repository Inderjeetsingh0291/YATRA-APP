import { useState } from 'react'
import { Coins, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  baseCurrency: string
  rates: Record<string, number>
}

const POPULAR = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'AED', 'SGD', 'THB', 'MYR', 'LKR', 'NPR']

export default function CurrencyCard({ baseCurrency, rates }: Props) {
  const [showAll, setShowAll] = useState(false)

  if (!rates || Object.keys(rates).length === 0) return null

  const popular = POPULAR.filter((c) => c !== baseCurrency && rates[c] !== undefined)
  const remaining = Object.keys(rates).filter((c) => c !== baseCurrency && !popular.includes(c))

  const displayed = showAll ? [...popular, ...remaining] : popular

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
        <Coins size={20} className="text-amber-400" />
        Currency Exchange
      </h3>
      <p className="text-xs text-white/40 mb-4">Base: 1 {baseCurrency}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {displayed.map((code) => (
          <div
            key={code}
            className="bg-white/5 rounded-lg px-3 py-2.5 border border-white/5 hover:border-white/15 transition-colors"
          >
            <p className="text-[10px] text-white/40 tracking-wider">{code}</p>
            <p className="text-sm font-medium text-white">
              {rates[code] < 1 ? rates[code].toFixed(4) : rates[code].toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {remaining.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-xs text-white/50 hover:text-white/80 flex items-center gap-1 mx-auto transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp size={14} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Show all {Object.keys(rates).length} currencies
            </>
          )}
        </button>
      )}
    </div>
  )
}
