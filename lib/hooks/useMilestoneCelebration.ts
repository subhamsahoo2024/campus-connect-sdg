"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface CelebrationOptions {
  colors?: string[];
  particleCount?: number;
  spread?: number;
  duration?: number;
  gravity?: number;
}

/**
 * useMilestoneCelebration - Custom hook for triggering confetti celebrations
 * 
 * Usage:
 * ```tsx
 * const { triggerCelebration } = useMilestoneCelebration({
 *   colors: ["#22c55e", "#16a34a", "#15803d"],
 * });
 * 
 * return (
 *   <button onClick={() => triggerCelebration()}>
 *     Celebrate!
 *   </button>
 * );
 * ```
 */
export function useMilestoneCelebration(options: CelebrationOptions = {}) {
  const {
    colors = ["#22c55e", "#16a34a", "#15c55e", "#10b981"], // Green school colors
    particleCount = 50,
    spread = 70,
    duration = 3000,
    gravity = 0.8,
  } = options;

  const confettiRef = useRef<confetti.CreateTypes | null>(null);

  // Initialize confetti instance once
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    confettiRef.current = confetti.create(canvas, { resize: true });

    return () => {
      canvas.remove();
    };
  }, []);

  const triggerCelebration = useCallback(
    (count?: number, angle?: number) => {
      if (!confettiRef.current) return;

      const fire = (pCount: number, pSpread: number, pAngle: number) => {
        confettiRef.current?.({
          particleCount: pCount,
          angle: pAngle,
          spread: pSpread,
          origin: { x: 0.5, y: 0.5 },
          colors,
          gravity,
          ticks: Math.ceil(duration / 1000) * 30,
          decay: 0.95,
        });
      };

      if (count !== undefined && angle !== undefined) {
        // Single burst from specific angle
        fire(count, spread, angle);
      } else {
        // Multiple bursts in different directions
        fire(particleCount / 2, spread, 60);
        fire(particleCount / 2, spread, 120);
      }
    },
    [colors, particleCount, spread, duration, gravity]
  );

  const triggerMultiBurst = useCallback(
    (burstCount = 3) => {
      if (!confettiRef.current) return;

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const angle = (360 / burstCount) * i;
          triggerCelebration(particleCount / 1.5, angle);
        }, i * 200);
      }
    },
    [triggerCelebration, particleCount]
  );

  return { triggerCelebration, triggerMultiBurst };
}

/**
 * Advanced Usage Examples:
 * 
 * 1. School/Pride Colors (Green):
 * ```tsx
 * const { triggerCelebration } = useMilestoneCelebration({
 *   colors: ["#22c55e", "#16a34a", "#10b981", "#059669"],
 *   particleCount: 100,
 * });
 * ```
 * 
 * 2. Custom Colors (Rainbow):
 * ```tsx
 * const { triggerMultiBurst } = useMilestoneCelebration({
 *   colors: ["#ff0000", "#ffff00", "#00ff00", "#0000ff"],
 *   particleCount: 75,
 *   duration: 4000,
 * });
 * ```
 * 
 * 3. In a component:
 * ```tsx
 * export function MilestoneAlert() {
 *   const { triggerCelebration } = useMilestoneCelebration();
 *   
 *   const handleLevelUp = async () => {
 *     await updateLevel();
 *     triggerCelebration();
 *   };
 *   
 *   return (
 *     <button onClick={handleLevelUp} className="btn-primary">
 *       Claim Milestone
 *     </button>
 *   );
 * }
 * ```
 */
