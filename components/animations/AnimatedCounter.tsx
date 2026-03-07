"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * AnimatedCounter - Score counter with rolling animation and glow effect
 * 
 * Animates from 0 to the provided value with a green glow effect
 * that flashes when the value increments.
 * 
 * Usage:
 * ```tsx
 * <AnimatedCounter 
 *   value={1250} 
 *   duration={0.8}
 *   prefix="Score: "
 *   suffix=" XP"
 *   className="text-3xl font-bold"
 * />
 * ```
 */
export function AnimatedCounter({
  value,
  duration = 0.8,
  className = "",
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const displayValue = useRef<number>(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startValue = displayValue.current;
    const startTime = Date.now();
    const valueDifference = value - startValue;

    const animateCounter = () => {
      const now = Date.now();
      const elapsedTime = (now - startTime) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);

      displayValue.current = Math.floor(startValue + valueDifference * progress);

      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${displayValue.current.toLocaleString()}${suffix}`;
      }

      // Trigger glow flash when animation completes
      if (progress === 1 && glowRef.current) {
        glowRef.current.classList.add("animate-pulse");
        setTimeout(() => {
          glowRef.current?.classList.remove("animate-pulse");
        }, 600);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateCounter);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateCounter);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration, prefix, suffix]);

  return (
    <motion.div
      ref={glowRef}
      className={`${className} transition-all`}
      style={{
        textShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
      }}
    >
      <div
        ref={nodeRef}
        className="font-mono font-bold"
      >
        {prefix}0{suffix}
      </div>
    </motion.div>
  );
}

/**
 * Advanced Usage with Custom Styling:
 * 
 * ```tsx
 * <div className="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded-lg">
 *   <h3 className="text-green-100 text-sm font-semibold mb-2">Innovation Score</h3>
 *   <AnimatedCounter 
 *     value={innovationScore}
 *     duration={1}
 *     className="text-4xl font-black text-green-400"
 *     suffix=" points"
 *   />
 * </div>
 * ```
 */
