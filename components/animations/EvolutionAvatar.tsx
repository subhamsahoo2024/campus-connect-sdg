"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useMemo } from "react";

interface EvolutionAvatarProps {
  state: "idle" | "running" | "excited" | "sad";
  size?: number;
  className?: string;
}

/**
 * EvolutionAvatar - Dynamic student avatar with state-based Lottie animations
 * 
 * Props:
 * - state: Character animation state (idle, running, excited, sad)
 * - size: Avatar size in pixels (default: 200)
 * - className: Additional Tailwind classes
 * 
 * Usage:
 * ```tsx
 * <EvolutionAvatar state="excited" size={240} />
 * ```
 * 
 * Note: Place animation files in public/animations/:
 * - avatar_idle.json
 * - avatar_running.json
 * - avatar_excited.json
 * - avatar_sad.json
 * 
 * Run `node scripts/setup-animations.js` to download these files locally.
 */
export function EvolutionAvatar({
  state,
  size = 200,
  className = "",
}: EvolutionAvatarProps) {
  // Memoize animation source to prevent unnecessary re-renders
  // Dynamically construct local file path based on state
  const animationSrc = useMemo(() => `/animations/avatar_${state}.json`, [state]);

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <DotLottieReact
        src={animationSrc}
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

/**
 * Setup Instructions:
 * 
 * 1. Run the automated setup script to download animation files locally:
 *    ```bash
 *    node scripts/setup-animations.js
 *    ```
 * 
 * 2. This will create animation files in: public/animations/
 *    - avatar_idle.json
 *    - avatar_running.json
 *    - avatar_excited.json
 *    - avatar_sad.json
 * 
 * 3. Import and use in your dashboard:
 *    ```tsx
 *    import { EvolutionAvatar } from "@/components/animations/EvolutionAvatar";
 *    
 *    export default function StudentProfile() {
 *      return (
 *        <div className="flex gap-4">
 *          <EvolutionAvatar state="idle" size={240} className="shadow-lg" />
 *          <div>...</div>
 *        </div>
 *      );
 *    }
 *    ```
 * 
 * Animation States Available:
 * - idle: Rest/default state
 * - running: Active/in-progress state
 * - excited: Success/celebration state
 * - sad: Error/failure state
 */
