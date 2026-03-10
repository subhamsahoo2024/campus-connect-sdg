'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FormFieldProps {
  id: string
  name: string
  type?: string
  label: string
  placeholder: string
  required?: boolean
  minLength?: number
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required,
  minLength,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5 relative"
    >
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-300 transition duration-200"
      >
        {label}
      </label>

      <div className="relative">
        {/* Glow background on focus */}
        <motion.div
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-cyan-600/0 pointer-events-none"
          animate={{
            opacity: isFocused ? 1 : 0,
            background: isFocused
              ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(34, 197, 238, 0.3))'
              : 'linear-gradient(90deg, rgba(168, 85, 247, 0), rgba(34, 197, 238, 0))',
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Input field */}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`relative z-10 w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-200
            border backdrop-blur-sm
            ${
              isFocused
                ? 'border-purple-400 shadow-lg shadow-purple-500/20'
                : 'border-white/10 hover:border-white/20'
            }
            focus:outline-none focus:ring-0
          `}
          style={{
            boxShadow: isFocused
              ? '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(168, 85, 247, 0.1)'
              : 'none',
          }}
        />

        {/* Active indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-full pointer-events-none"
          animate={{
            width: isFocused || hasValue ? '100%' : '0%',
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default FormField
