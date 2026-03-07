'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlowingCardProps {
  children: React.ReactNode
}

const GlowingCard: React.FC<GlowingCardProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: -100, y: -100 })
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent)`,
          opacity: 0.5,
        }}
        transition={{ type: 'tween', ease: 'linear' }}
      />

      {/* Neon border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(168, 85, 247, 0) 0%, 
            rgba(59, 130, 246, 0.1) 50%, 
            rgba(34, 197, 238, 0) 100%)`,
          opacity: 0.4,
        }}
      />

      {/* Ambient glow edges */}
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, 
            rgba(168, 85, 247, 0.3) 0%, 
            rgba(59, 130, 246, 0.2) 50%, 
            rgba(34, 197, 238, 0.3) 100%)`,
          filter: 'blur(20px)',
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export default GlowingCard
