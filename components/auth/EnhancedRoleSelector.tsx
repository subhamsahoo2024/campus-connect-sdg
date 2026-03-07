'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Role {
  value: string
  label: string
  description: string
  icon: string
}

interface EnhancedRoleSelectorProps {
  roles: Role[]
  defaultRole?: string
}

const EnhancedRoleSelector: React.FC<EnhancedRoleSelectorProps> = ({
  roles,
  defaultRole = 'student',
}) => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>(defaultRole)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-2"
    >
      <p className="text-sm font-medium text-slate-300">I am a…</p>

      <div className="grid grid-cols-2 gap-2">
        {roles.map((role, index) => (
          <motion.label
            key={role.value}
            className="relative cursor-pointer group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setHoveredRole(role.value)}
            onMouseLeave={() => setHoveredRole(null)}
          >
            {/* Hover glow background */}
            <motion.div
              className="absolute -inset-0.5 rounded-lg pointer-events-none"
              animate={{
                background:
                  hoveredRole === role.value
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(34, 197, 238, 0.3))'
                    : 'linear-gradient(135deg, transparent, transparent)',
                opacity: hoveredRole === role.value ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Selection glow */}
            <motion.div
              className="absolute -inset-0.5 rounded-lg pointer-events-none"
              animate={{
                boxShadow:
                  selectedRole === role.value
                    ? '0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.2)'
                    : 'none',
              }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className="relative flex cursor-pointer flex-col gap-1 rounded-lg border backdrop-blur-sm p-3 transition-all overflow-hidden"
              animate={{
                borderColor:
                  selectedRole === role.value ? 'rgba(168, 85, 247, 1)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor:
                  selectedRole === role.value
                    ? 'rgba(168, 85, 247, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                scale: hoveredRole === role.value ? 1.05 : 1,
              }}
              transition={{ duration: 0.25 }}
              style={{
                transformOrigin: 'center',
                perspective: '1000px',
              }}
            >
              {/* 3D tilt effect layer */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background:
                    hoveredRole === role.value
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)'
                      : 'transparent',
                }}
                animate={{
                  opacity: hoveredRole === role.value ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              <motion.span
                className="relative text-2xl"
                animate={{
                  scale: selectedRole === role.value ? 1.2 : 1,
                  y: hoveredRole === role.value ? -2 : 0,
                }}
                transition={{ duration: 0.25 }}
              >
                {role.icon}
              </motion.span>

              <span className="relative text-sm font-semibold text-white transition">
                {role.label}
              </span>

              <span className="relative text-xs text-slate-400 leading-tight transition group-hover:text-slate-300">
                {role.description}
              </span>

              {/* Inner input (hidden) */}
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="absolute opacity-0"
              />

              {/* Selected indicator */}
              {selectedRole === role.value && (
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: '0 0 8px rgba(34, 197, 238, 1)',
                  }}
                />
              )}
            </motion.div>
          </motion.label>
        ))}
      </div>
    </motion.div>
  )
}

export default EnhancedRoleSelector
