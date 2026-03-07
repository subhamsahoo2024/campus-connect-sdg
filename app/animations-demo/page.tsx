"use client";

import { useState, useState as useStateAlias } from "react";
import {
  AnimatedCounter,
  EvolutionAvatar,
  RadarScanner,
  ShareAchievementButton,
} from "@/components/animations";
import { useMilestoneCelebration } from "@/lib/hooks/useMilestoneCelebration";
import { motion } from "framer-motion";

/**
 * Animations Demo Page
 * 
 * Testing page for all INNOVEX animation components
 * Visit: http://localhost:3000/animations-demo
 * 
 * Note: Remove this page before production deployment
 */
export default function AnimationsDemoPage() {
  const [score, setScore] = useState(1250);
  const [avatarState, setAvatarState] = useState<"idle" | "running" | "excited" | "sad">("idle");
  const [isScanning, setIsScanning] = useState(false);
  const { triggerCelebration, triggerMultiBurst } = useMilestoneCelebration({
    colors: ["#22c55e", "#16a34a", "#10b981", "#059669"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-black text-white mb-2">
            🎨 INNOVEX Animation Components
          </h1>
          <p className="text-xl text-slate-300">
            Production-ready animations for Next.js 16 + Tailwind CSS 4.0
          </p>
        </motion.div>

        {/* Grid of Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. AnimatedCounter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-slate-600"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-3xl">💯</span>
              AnimatedCounter
            </h2>

            <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-xl mb-6">
              <h3 className="text-green-200 text-sm font-semibold mb-2">
                Innovation Score
              </h3>
              <AnimatedCounter
                value={score}
                duration={0.8}
                className="text-4xl font-black text-green-400"
                suffix=" XP"
              />
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 text-sm">Current Value: {score}</p>
              <button
                onClick={() => setScore(score + Math.random() * 200)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                + Add Random Score
              </button>
              <button
                onClick={() => setScore(0)}
                className="w-full bg-slate-600 text-white py-2 rounded-lg font-semibold hover:bg-slate-500 transition-all"
              >
                Reset
              </button>
            </div>
          </motion.div>

          {/* 2. EvolutionAvatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-slate-600 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 w-full">
              <span className="text-3xl">🦸</span>
              EvolutionAvatar
            </h2>

            <div className="w-48 h-48 mb-6">
              <EvolutionAvatar
                state={avatarState}
                size={200}
                className="shadow-2xl"
              />
            </div>

            <div className="w-full space-y-3">
              <p className="text-slate-300 text-sm text-center">Current State: {avatarState}</p>
              <select
                value={avatarState}
                onChange={(e) => setAvatarState(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
              >
                <option value="idle">Idle</option>
                <option value="running">Running</option>
                <option value="excited">Excited</option>
                <option value="sad">Sad</option>
              </select>
              <p className="text-xs text-slate-400 text-center">
                ⚠️ Requires .lottie files in /public/animations/
              </p>
            </div>
          </motion.div>

          {/* 3. RadarScanner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-slate-600 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 w-full">
              <span className="text-3xl">🔍</span>
              RadarScanner
            </h2>

            <RadarScanner
              isScanning={isScanning}
              icon={isScanning ? "brain" : "search"}
              size="md"
              label={isScanning ? "AI searching..." : ""}
              className="mb-6"
            />

            <div className="w-full space-y-3">
              <p className="text-slate-300 text-sm text-center">
                Status: {isScanning ? "🟢 Scanning" : "⚫ Idle"}
              </p>
              <button
                onClick={() => setIsScanning(!isScanning)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {isScanning ? "Stop Scan" : "Start Scan"}
              </button>
            </div>
          </motion.div>

          {/* 4. Celebration Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-slate-600"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-3xl">🎉</span>
              Celebration Controls
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => triggerCelebration()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Single Burst 🎆
              </button>
              <button
                onClick={() => triggerMultiBurst(4)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Multi-Burst (4x) 🎇
              </button>
              <button
                onClick={() => triggerMultiBurst(8)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Mega-Burst (8x) 🎉
              </button>
            </div>
          </motion.div>

          {/* 5. ShareAchievementButton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-slate-600 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-3xl">📱</span>
              ShareAchievementButton
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ShareAchievementButton
                achievement="🏆 Community Leader"
                description="Connected 10+ mentorships successfully"
                linkedinText="I just earned the Community Leader Badge on INNOVEX! Taking my innovation journey to the next level 🚀"
              />

              <ShareAchievementButton
                achievement="⭐ Streak Master"
                description="Maintained 7-day mission streak"
                linkedinText="7-day mission streak complete! Consistency is key to innovation. Join me on INNOVEX! 🎯"
                schoolColors={["#f59e0b", "#d97706", "#b45309"]}
              />
            </div>
          </motion.div>
        </div>

        {/* Documentation Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-slate-800 rounded-2xl p-8 border border-slate-600"
        >
          <h3 className="text-xl font-bold text-white mb-4">📖 Documentation</h3>
          <ul className="space-y-2 text-slate-300">
            <li>
              📄 <strong>Integration Guide:</strong>{" "}
              <code className="bg-slate-700 px-2 py-1 rounded text-sm">
                ANIMATIONS_INTEGRATION_GUIDE.md
              </code>
            </li>
            <li>
              📂 <strong>Components:</strong>{" "}
              <code className="bg-slate-700 px-2 py-1 rounded text-sm">
                components/animations/
              </code>
            </li>
            <li>
              🪝 <strong>Hooks:</strong>{" "}
              <code className="bg-slate-700 px-2 py-1 rounded text-sm">
                lib/hooks/useMilestoneCelebration.ts
              </code>
            </li>
            <li className="pt-4 text-yellow-400">
              ⚠️ <strong>Note:</strong> Delete this demo page before production deployment
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
