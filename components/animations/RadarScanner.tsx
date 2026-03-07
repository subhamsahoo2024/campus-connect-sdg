"use client";

import { motion } from "framer-motion";
import { Search, Brain } from "lucide-react";

interface RadarScannerProps {
  isScanning?: boolean;
  icon?: "search" | "brain";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { container: 120, icon: 24, circles: [40, 60, 80] },
  md: { container: 160, icon: 32, circles: [60, 90, 120] },
  lg: { container: 220, icon: 48, circles: [80, 120, 160] },
};

/**
 * RadarScanner - Futuristic AI scanning animation
 * 
 * Displays expanding concentric circles with a central icon,
 * perfect for showing AI processing/matchmaking in progress.
 * 
 * Usage:
 * ```tsx
 * <RadarScanner 
 *   isScanning={true}
 *   icon="brain"
 *   size="md"
 *   label="Finding mentors..."
 * />
 * ```
 */
export function RadarScanner({
  isScanning = true,
  icon = "search",
  size = "md",
  label,
  className = "",
}: RadarScannerProps) {
  const config = sizeConfig[size];
  const IconComponent = icon === "brain" ? Brain : Search;

  // Pulse ring animation variants
  const pulseVariants = {
    initial: { scale: 0.8, opacity: 1 },
    animate: { scale: 1.8, opacity: 0 },
  };

  const pulseTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeOut" as const,
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Radar container */}
      <div
        className="relative flex items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-300/20"
        style={{
          width: config.container,
          height: config.container,
        }}
      >
        {/* Concentric circle rings (static) */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: config.container,
            height: config.container,
          }}
        >
          {config.circles.map((radius, idx) => (
            <circle
              key={idx}
              cx={config.container / 2}
              cy={config.container / 2}
              r={radius / 2}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth={0.5}
              opacity={0.15 - idx * 0.03}
            />
          ))}
        </svg>

        {/* Animated pulse rings */}
        {isScanning && (
          <>
            {[0, 0.5, 1].map((delay) => (
              <motion.div
                key={`pulse-${delay}`}
                className="absolute rounded-full border-2 border-blue-400"
                style={{
                  width: config.circles[0],
                  height: config.circles[0],
                }}
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                transition={{
                  ...pulseTransition,
                  delay,
                }}
              />
            ))}
          </>
        )}

        {/* Center icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-lg"
          style={{
            width: config.icon * 1.8,
            height: config.icon * 1.8,
          }}
          animate={
            isScanning
              ? {
                  boxShadow: [
                    "0 0 8px rgba(59, 130, 246, 0.5)",
                    "0 0 16px rgba(59, 130, 246, 0.8)",
                    "0 0 8px rgba(59, 130, 246, 0.5)",
                  ],
                }
              : {}
          }
          transition={
            isScanning
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {}
          }
        >
          <IconComponent size={config.icon} strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Label */}
      {label && (
        <motion.div
          className="text-center"
          animate={isScanning ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={isScanning ? { duration: 2, repeat: Infinity } : {}}
        >
          <p className="text-sm font-medium text-blue-600">{label}</p>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * 1. Basic Mentor Search:
 * ```tsx
 * <RadarScanner 
 *   isScanning={isSearching}
 *   icon="brain"
 *   size="lg"
 *   label="AI is searching for compatible mentors..."
 * />
 * ```
 * 
 * 2. In a Modal/Dialog:
 * ```tsx
 * {showMatchmakingModal && (
 *   <div className="flex flex-col items-center justify-center p-8">
 *     <RadarScanner isScanning size="md" icon="search" />
 *     <p className="mt-4 text-gray-600">Analyzing compatibility...</p>
 *   </div>
 * )}
 * ```
 * 
 * 3. Investor Discovery:
 * ```tsx
 * <RadarScanner 
 *   isScanning={isDiscovering}
 *   icon="brain"
 *   size="md"
 *   label="Finding relevant investors"
 *   className="mt-6"
 * />
 * ```
 */
