import { useEffect, useState } from 'react'

const getColor = (score) => {
  if (score >= 70) return '#10b981'
  if (score >= 40) return '#f59e0b'
  return '#f43f5e'
}

export default function MatchScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0)
  const size = 110
  const strokeWidth = 9
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ
  const color = getColor(score)

  useEffect(() => {
    let frame
    let current = 0
    const step = () => {
      current += 1.5
      if (current >= score) { setDisplayed(score); return }
      setDisplayed(Math.round(current))
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="score-ring-wrap" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} className="score-ring">
        <circle className="score-ring-bg" cx={size/2} cy={size/2} r={r} />
        <circle
          className="score-ring-fill"
          cx={size/2} cy={size/2} r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-value-wrap" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="score-number" style={{ color }}>{displayed}%</span>
        <span className="score-pct">Match</span>
      </div>
    </div>
  )
}