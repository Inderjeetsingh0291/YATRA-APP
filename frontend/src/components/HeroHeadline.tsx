import { useEffect, useState } from 'react'

export default function HeroHeadline() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger the CSS transition on mount
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className={`absolute top-[120px] left-0 right-0 z-20 flex justify-center pointer-events-none
        transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <h1
        className="text-center font-normal"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(40px, 5.4vw, 72px)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        <span className="block text-white">Every journey, unified.</span>
        <span className="block" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Plan with real-time clarity.
        </span>
      </h1>
    </div>
  )
}
