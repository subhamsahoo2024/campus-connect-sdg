'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
}

interface ShootingStar {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
}

interface Rocket {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
}

const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [stars, setStars] = useState<Star[]>([])
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const [rockets, setRockets] = useState<Rocket[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const sparkleCounterRef = useRef(0)

  // Initialize stars
  useEffect(() => {
    const generateStars = (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 4 + 2,
      }))
    }
    setStars(generateStars(150))
  }, [])

  // Generate shooting stars periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newShootingStar: ShootingStar = {
        id: Math.random(),
        startX: Math.random() * 100,
        startY: Math.random() * 50,
        endX: Math.random() * 100 - 50,
        endY: Math.random() * 100 + 50,
        duration: Math.random() * 1 + 0.8,
        delay: 0,
      }
      setShootingStars((prev) => [...prev, newShootingStar])

      // Remove old shooting stars
      setTimeout(() => {
        setShootingStars((prev) =>
          prev.filter((s) => s.id !== newShootingStar.id),
        )
      }, (newShootingStar.duration + 0.2) * 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Generate rockets periodically - targeting Saturn in top-right
  useEffect(() => {
    const interval = setInterval(() => {
      // Rockets launch from left bottom going to top-right toward Saturn
      const newRocket: Rocket = {
        id: Math.random(),
        startX: 0,
        startY: 95, // Bottom of screen
        endX: 85, // Close to Saturn on top-right
        endY: 15, // Saturn area (top-right)
        duration: Math.random() * 6 + 12, // Longer duration for full journey
        delay: 0,
      }
      setRockets((prev) => [...prev, newRocket])

      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id))
      }, (newRocket.duration + 0.5) * 1000)
    }, 18000) // Launch every 18 seconds

    return () => clearInterval(interval)
  }, [])

  // Generate particles
  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 2,
    }))
    setParticles(particleArray)
  }, [])

  // Track mouse for parallax and create sparkles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      }

      // Create sparkles at mouse position
      sparkleCounterRef.current += 1
      const newSparkle: Sparkle = {
        id: sparkleCounterRef.current,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
      }

      setSparkles((prev) => [...prev, newSparkle])

      // Remove sparkle after animation completes
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
      }, 600)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Render nebula to canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create gradient for nebula
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      100,
      canvas.width / 2,
      canvas.height / 2,
      600,
    )
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.08)')
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)')
    gradient.addColorStop(1, 'rgba(34, 197, 238, 0.02)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add noise/texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 10
      data[i] += noise
      data[i + 1] += noise * 0.8
      data[i + 2] += noise * 1.2
    }

    ctx.putImageData(imageData, 0, 0)

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Canvas for nebula background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-20"
        style={{
          filter: 'blur(80px)',
          opacity: 0.6,
        }}
      />

      {/* Deep space base */}
      <div className="fixed inset-0 -z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* Static stars with parallax */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="fixed rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, ${star.opacity})`,
            opacity: star.opacity,
          }}
          animate={{
            x: mouseRef.current.x * 0.02,
            y: mouseRef.current.y * 0.02,
          }}
          transition={{ type: 'tween' }}
        />
      ))}

      {/* Shooting stars - REMOVED */}
      
      {/* Saturn in top-right corner */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          right: '5%',
          top: '10%',
          perspective: '1000px',
        }}
      >
        {/* Saturn planet body */}
        <div className="relative w-24 h-24" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
          {/* Ring bottom half - behind planet */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transformOrigin: 'center center',
              width: '180px',
              height: '60px',
              pointerEvents: 'none',
              zIndex: 1,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: 'linear',
            }}
            initial={{
              transform: 'translate(-50%, -50%) rotateX(35deg) rotateZ(-25deg)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '6px solid rgba(218, 165, 32, 1)',
                background: 'linear-gradient(180deg, rgba(184, 134, 11, 0.4) 0%, rgba(139, 101, 0, 0.2) 50%, rgba(184, 134, 11, 0.4) 100%)',
                boxShadow: 'inset 0 -8px 20px rgba(0, 0, 0, 0.9), inset 0 8px 15px rgba(255, 255, 255, 0.1), 0 0 25px rgba(218, 165, 32, 0.7)',
                borderRadius: '50%',
                clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
              }}
            />
          </motion.div>

          {/* Main planet sphere */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600"
            style={{
              boxShadow: '0 0 40px rgba(168, 120, 0, 0.6), inset -5px -5px 15px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
            }}
          />

          {/* Ring top half - in front of planet */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transformOrigin: 'center center',
              width: '180px',
              height: '60px',
              pointerEvents: 'none',
              zIndex: 3,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: 'linear',
            }}
            initial={{
              transform: 'translate(-50%, -50%) rotateX(35deg) rotateZ(-25deg)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '6px solid rgba(218, 165, 32, 1)',
                background: 'linear-gradient(180deg, rgba(184, 134, 11, 0.4) 0%, rgba(139, 101, 0, 0.2) 50%, rgba(184, 134, 11, 0.4) 100%)',
                boxShadow: 'inset 0 -8px 20px rgba(0, 0, 0, 0.9), inset 0 8px 15px rgba(255, 255, 255, 0.1), 0 0 25px rgba(218, 165, 32, 0.7)',
                borderRadius: '50%',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
              }}
            />
          </motion.div>

          {/* Orbiting satellite */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              width: '200%',
              height: '200%',
            }}
          >
            {/* Satellite moon */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-slate-300 to-slate-500"
              style={{
                boxShadow: '0 0 10px rgba(148, 163, 184, 0.8)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Rockets heading to Saturn */}
      {rockets.map((rocket) => (
        <motion.div
          key={rocket.id}
          className="fixed pointer-events-none"
          style={{ zIndex: 20 }}
          initial={{
            left: `${rocket.startX}%`,
            top: `${rocket.startY}%`,
            opacity: 0,
          }}
          animate={{
            left: `${rocket.endX}%`,
            top: `${rocket.endY}%`,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: rocket.duration,
            ease: 'easeInOut',
          }}
        >
          <div className="relative w-8 h-16" style={{ rotate: '55deg' }}>
            {/* Vibrant rocket body with neon glow */}
            <div className="relative w-full h-full">
              {/* Rocket cone */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '12px solid #00d4ff',
                  filter: 'drop-shadow(0 0 8px #00d4ff)',
                }}
              />

              {/* Main rocket body */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-8 rounded-lg"
                style={{
                  background: 'linear-gradient(90deg, #ff006e, #ff4b9e, #ff006e)',
                  boxShadow: '0 0 20px rgba(255, 0, 110, 0.8), inset -2px 0 5px rgba(0, 212, 255, 0.4)',
                }}
              />

              {/* Rocket window */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #00d4ff, #0099ff)',
                  boxShadow: '0 0 12px rgba(0, 212, 255, 1)',
                }}
              />

              {/* Rocket fins */}
              <div
                className="absolute top-8 -left-1 w-1.5 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
                  boxShadow: '0 0 8px rgba(0, 212, 255, 0.8)',
                }}
              />
              <div
                className="absolute top-8 -right-1 w-1.5 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
                  boxShadow: '0 0 8px rgba(0, 212, 255, 0.8)',
                }}
              />

              {/* Intense flame trail */}
              <motion.div
                className="absolute -bottom-6 left-1/2 w-3 h-16 -translate-x-1/2 pointer-events-none"
                animate={{
                  scaleY: [0.9, 1.3, 0.9],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: 'linear-gradient(180deg, #ff006e 0%, #ff4b9e 20%, #ff8c1a 40%, #ffaa00 60%, #ff006e 100%)',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 30px rgba(255, 0, 110, 0.9), 0 0 60px rgba(255, 140, 26, 0.7)',
                  }}
                />
              </motion.div>

              {/* Particle explosion trail */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    left: '50%',
                    top: '100%',
                    width: '2px',
                    height: '2px',
                    borderRadius: '50%',
                    background: ['#ff006e', '#ff8c1a', '#00d4ff'][i % 3],
                    boxShadow: `0 0 6px ${['rgba(255, 0, 110, 0.8)', 'rgba(255, 140, 26, 0.8)', 'rgba(0, 212, 255, 0.8)'][i % 3]}`,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 80 - 20,
                    y: -i * 15 - Math.random() * 40 - 20,
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(167, 139, 250, 0.6), transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(167, 139, 250, 0.4)`,
          }}
          animate={{
            y: [0, -150],
            opacity: [0.3, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration + 4,
            delay: particle.delay,
          }}
          initial={{ opacity: 0.3 }}
        />
      ))}

      {/* Mouse-following sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(168, 85, 247, 0.6))',
            boxShadow: `0 0 ${sparkle.size * 2}px rgba(168, 85, 247, 0.8), 0 0 ${sparkle.size * 4}px rgba(168, 85, 247, 0.4)`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [1, 0.5], opacity: [1, 0] }}
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Ambient glow orbs */}
      <div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.08), transparent)',
          filter: 'blur(80px)',
        }}
      />

      <div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent)',
          filter: 'blur(80px)',
        }}
      />
    </>
  )
}

export default SpaceBackground
