'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface EnhancedButtonProps {
  children: React.ReactNode
  type?: 'submit' | 'button' | 'reset'
  onClick?: () => void
  className?: string
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  type = 'submit',
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`relative mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(59, 130, 246), rgb(34, 197, 238))'
          : 'linear-gradient(135deg, rgb(147, 51, 234), rgb(88, 103, 221))',
      }}
      animate={{
        scale: isPressed ? 0.98 : isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.15 }}
      whileHover={{
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(34, 197, 238, 0.3)',
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        }}
        animate={{
          x: isHovered ? ['100%', '-100%'] : '0%',
          opacity: isHovered ? [0, 1, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          repeat: isHovered ? Infinity : 0,
        }}
      />

      {/* Ripple effect on click */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
          animate={{
            scale: [1, 4],
            opacity: [0.8, 0],
          }}
          transition={{ duration: 0.6 }}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Glow background on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        animate={{
          boxShadow: isHovered
            ? 'inset 0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(34, 197, 238, 0.2)'
            : 'inset 0 0 10px rgba(168, 85, 247, 0.1)',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Text content */}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
}

export default EnhancedButton
