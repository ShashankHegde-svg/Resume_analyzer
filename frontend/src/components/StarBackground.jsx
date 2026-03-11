import { useEffect, useRef } from 'react'

export default function StarBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      drift: (Math.random() - 0.5) * 0.15,
    }))

    // Nebula blobs
    const nebulas = [
      { x: 0.15, y: 0.2, r: 320, c: 'rgba(139,92,246,0.045)' },
      { x: 0.85, y: 0.75, r: 280, c: 'rgba(34,211,238,0.04)' },
      { x: 0.5, y: 0.5, r: 400, c: 'rgba(99,40,200,0.025)' },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Nebulas
      nebulas.forEach(n => {
        const g = ctx.createRadialGradient(
          n.x * canvas.width, n.y * canvas.height, 0,
          n.x * canvas.width, n.y * canvas.height, n.r
        )
        g.addColorStop(0, n.c)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Stars
      stars.forEach(s => {
        s.alpha += s.speed
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1
        s.x += s.drift

        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width) s.x = 0

        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha))
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="stars-canvas" />
}