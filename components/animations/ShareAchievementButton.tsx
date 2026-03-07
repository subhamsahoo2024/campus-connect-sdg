"use client";

import { motion } from "framer-motion";
import { Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useMilestoneCelebration } from "@/lib/hooks/useMilestoneCelebration";

interface ShareAchievementButtonProps {
  achievement: string;
  description?: string;
  linkedinText?: string;
  schoolColors?: string[];
  onShare?: () => Promise<void>;
  className?: string;
}

/**
 * ShareAchievementButton - Interactive share button with celebration animation
 * 
 * This component combines:
 * - Confetti celebration on click
 * - LinkedIn sharing simulation
 * - Loading states and success feedback
 * 
 * Usage:
 * ```tsx
 * <ShareAchievementButton 
 *   achievement="Reached Level 10!"
 *   description="Completed 5 mentorship meetings"
 *   linkedinText="I just reached Level 10 on INNOVEX! My innovation journey continues... 🚀"
 *   onShare={async () => {
 *     await shareToLinkedIn(achievementData);
 *   }}
 * />
 * ```
 */
export function ShareAchievementButton({
  achievement,
  description,
  linkedinText = "Just achieved a milestone on INNOVEX! 🎉",
  schoolColors = ["#22c55e", "#16a34a", "#10b981", "#059669"],
  onShare,
  className = "",
}: ShareAchievementButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { triggerMultiBurst } = useMilestoneCelebration({
    colors: schoolColors,
    particleCount: 60,
    spread: 90,
    duration: 2500,
  });

  const handleShare = async () => {
    try {
      setIsLoading(true);

      // Trigger celebration immediately
      triggerMultiBurst(4);

      // Call custom share handler if provided
      if (onShare) {
        await onShare();
      } else {
        // Default LinkedIn share simulation
        await simulateLinkedInShare();
      }

      setIsShared(true);

      // Reset status after 3 seconds
      setTimeout(() => {
        setIsShared(false);
      }, 3000);
    } catch (error) {
      console.error("Share failed:", error);
      setIsLoading(false);
    }
  };

  const simulateLinkedInShare = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would open LinkedIn share dialog or API
    console.log("Shared to LinkedIn:", linkedinText);
    setIsLoading(false);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Achievement Info */}
      <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 flex items-center gap-2">
          <Sparkles size={20} className="text-green-600" />
          {achievement}
        </h3>
        {description && <p className="text-sm text-green-700 mt-1">{description}</p>}
      </div>

      {/* Share Button */}
      <motion.button
        onClick={handleShare}
        disabled={isLoading || isShared}
        className={`
          relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold
          transition-all duration-300
          ${
            isShared
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
          }
          disabled:opacity-70
        `}
        whileHover={{ scale: isLoading || isShared ? 1 : 1.02 }}
        whileTap={{ scale: isLoading || isShared ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Share2 size={18} />
            </motion.div>
            <span>Sharing...</span>
          </>
        ) : isShared ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              ✓
            </motion.span>
            <span>Shared!</span>
          </>
        ) : (
          <>
            <Share2 size={18} />
            <span>Share Achievement</span>
          </>
        )}
      </motion.button>

      {/* Share Preview */}
      {description && (
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
          <p className="font-mono leading-relaxed">
            "{linkedinText}"
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Integration Examples:
 * 
 * 1. In Student Dashboard Milestone Card:
 * ```tsx
 * import { ShareAchievementButton } from "@/components/animations/ShareAchievementButton";
 * 
 * export function MilestoneCard({ milestone }) {
 *   return (
 *     <div className="bg-white rounded-xl p-6 shadow-md">
 *       <h2>{milestone.title}</h2>
 *       <ShareAchievementButton 
 *         achievement={milestone.title}
 *         description={milestone.description}
 *         linkedinText={`I just achieved "${milestone.title}" on INNOVEX! 🚀`}
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * 2. With Custom Handler:
 * ```tsx
 * const handleShareAchievement = async () => {
 *   const response = await fetch("/api/achievements/share", {
 *     method: "POST",
 *     body: JSON.stringify({
 *       achievementId: milestone.id,
 *       platform: "linkedin",
 *     }),
 *   });
 *   
 *   if (!response.ok) throw new Error("Share failed");
 * };
 * 
 * <ShareAchievementButton 
 *   achievement="Level 10 Reached"
 *   onShare={handleShareAchievement}
 * />
 * ```
 * 
 * 3. Badge Showcase Achievement:
 * ```tsx
 * <ShareAchievementButton 
 *   achievement="🏆 Community Leader Badge"
 *   description="Mentored 10+ students successfully"
 *   schoolColors={["#f59e0b", "#d97706", "#b45309"]}
 * />
 * ```
 */
