# INNOVEX Animation Components - Integration Guide

## 📦 Components Created

This guide covers the 5 animation components created for INNOVEX:

1. **PageTransition** - Global page transitions
2. **EvolutionAvatar** - Dynamic character avatar
3. **AnimatedCounter** - Score ticker with glow effect
4. **RadarScanner** - AI matchmaking radar
5. **ShareAchievementButton** - Confetti celebration + sharing

---

## 🚀 TASK 1: PageTransition (Global Page Transitions)

### Location
`/components/animations/PageTransition.tsx`

### What It Does
Wraps page changes with smooth slide-up and fade-in animations.

### Implementation in Layout/Template

**Option A: Using `template.tsx` (Recommended - animates on every navigation)**

Create: `app/(dashboards)/student/template.tsx`

```tsx
"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/animations/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <PageTransition key={pathname}>{children}</PageTransition>;
}
```

**Option B: Using Root Layout (animates all routes)**

Update: `app/layout.tsx`

```tsx
import { PageTransition } from "@/components/animations/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
```

### Customization

Modify animation in `PageTransition.tsx`:

```tsx
// Current: subtle slide-up fade
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}

// Alternative: fade-only
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Alternative: slide-left
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
```

---

## 🎨 TASK 2: EvolutionAvatar (Dynamic Character Avatar)

### Location
`/components/animations/EvolutionAvatar.tsx`

### What It Does
Displays a Lottie animation that changes based on character state (idle, running, excited, sad).

### Required Setup

**Step 1: Create animations directory**
```bash
mkdir -p public/animations
```

**Step 2: Add Lottie animation files**

You need to create or download `.lottie` files:
- `avatar_idle.lottie`
- `avatar_running.lottie`
- `avatar_excited.lottie`
- `avatar_sad.lottie`

**Recommended sources:**
- [LottieFiles](https://lottiefiles.com/) - Free animations
- [Lordicon](https://lordicon.com/) - Commercial, high quality
- [Rive](https://rive.app/) - Interactive animations

**Step 3: Usage Example**

In `app/(dashboards)/student/page.tsx`:

```tsx
import { EvolutionAvatar } from "@/components/animations/EvolutionAvatar";

export default function StudentDashboard() {
  const [avatarState, setAvatarState] = useState<"idle" | "excited">("idle");

  return (
    <div className="flex items-start gap-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <EvolutionAvatar 
          state={avatarState} 
          size={240} 
          className="shadow-xl rounded-2xl"
        />
        <p className="text-sm text-gray-600 capitalize">{avatarState}</p>
      </div>

      {/* Content Section */}
      <div className="flex-1">
        {/* Your dashboard content */}
      </div>
    </div>
  );
}
```

### State Triggers Example

```tsx
// Trigger based on user interaction
useEffect(() => {
  if (activeMission) {
    setAvatarState("running");
  } else if (newBadgeEarned) {
    setAvatarState("excited");
  } else {
    setAvatarState("idle");
  }
}, [activeMission, newBadgeEarned]);
```

---

## 💯 TASK 3: AnimatedCounter (Innovation Score Ticker)

### Location
`/components/animations/AnimatedCounter.tsx`

### What It Does
Animates a numeric value rolling up with a green glow effect.

### Basic Usage

In Student Dashboard KPI card:

```tsx
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

export default function StudentProfile() {
  const [innovationScore, setInnovationScore] = useState(0);

  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-xl">
      <h3 className="text-green-100 text-sm font-semibold mb-3">
        Innovation Score
      </h3>
      <AnimatedCounter 
        value={innovationScore}
        duration={0.8}
        className="text-4xl font-black text-green-400"
        suffix=" XP"
      />
    </div>
  );
}
```

### Advanced Usage

```tsx
// With prefix and custom duration
<AnimatedCounter 
  value={totalScore}
  prefix="Level "
  duration={1}
  className="text-2xl font-bold text-indigo-600"
/>

// With streaming updates
useEffect(() => {
  const timer = setInterval(() => {
    setScore(prev => prev + Math.random() * 50);
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### Styling Options

```tsx
// Green theme (recommended for school colors)
<AnimatedCounter 
  value={score}
  className="text-3xl font-black text-green-500"
/>

// Blue theme
<AnimatedCounter 
  value={score}
  className="text-3xl font-black text-blue-600"
/>

// Gradient text (requires custom CSS)
<AnimatedCounter 
  value={score}
  className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
/>
```

---

## 🔍 TASK 4: RadarScanner (AI Matchmaking Radar)

### Location
`/components/animations/RadarScanner.tsx`

### What It Does
Displays a futuristic radar with expanding circles and central icon, showing AI processing.

### Use Cases

**Mentor Discovery Flow**

In `app/(dashboards)/student/discover/page.tsx`:

```tsx
import { RadarScanner } from "@/components/animations/RadarScanner";
import { useState, useEffect } from "react";

export default function DiscoverMentors() {
  const [isSearching, setIsSearching] = useState(false);
  const [mentors, setMentors] = useState([]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Call API to find mentors
    const results = await fetch("/api/matchmaking/find-mentors", {
      method: "POST",
      body: JSON.stringify({ studentId: userId }),
    }).then(r => r.json());
    
    setMentors(results);
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      {isSearching ? (
        <RadarScanner 
          isScanning={true}
          icon="brain"
          size="lg"
          label="AI is finding compatible mentors..."
        />
      ) : (
        <button 
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
        >
          Find Mentors
        </button>
      )}

      {/* Results */}
      {mentors.map(mentor => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
}
```

### Size Options

```tsx
// Small (120px) - for cards/sidebars
<RadarScanner size="sm" icon="search" />

// Medium (160px) - for modals/dialogs
<RadarScanner size="md" icon="brain" />

// Large (220px) - for full-page discovery
<RadarScanner size="lg" icon="search" />
```

### Icon Options

```tsx
// Search icon (default)
<RadarScanner icon="search" />

// Brain icon (AI/intelligence)
<RadarScanner icon="brain" />
```

---

## 🎉 TASK 5: Milestone Celebration (Confetti + Sharing)

### Locations
- Hook: `/lib/hooks/useMilestoneCelebration.ts`
- Component: `/components/animations/ShareAchievementButton.tsx`

### What They Do
- **Hook**: Triggers confetti celebrations with customizable colors/particles
- **Component**: Combines celebration with LinkedIn share button

### Basic Implementation

In Badge/Achievement component:

```tsx
import { ShareAchievementButton } from "@/components/animations/ShareAchievementButton";

export function BadgeEarned({ badge }: { badge: Badge }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <img src={badge.icon} className="w-24 h-24 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-center mb-2">{badge.name}</h2>
      
      <ShareAchievementButton 
        achievement={badge.name}
        description={badge.description}
        linkedinText={`🎉 I just earned the "${badge.name}" badge on INNOVEX! Working towards my innovation goals... 🚀`}
        schoolColors={["#22c55e", "#16a34a", "#10b981"]}
      />
    </div>
  );
}
```

### Hook Usage (Direct)

For custom celebration triggers:

```tsx
import { useMilestoneCelebration } from "@/lib/hooks/useMilestoneCelebration";

export function LevelUpAlert() {
  const { triggerCelebration, triggerMultiBurst } = useMilestoneCelebration({
    colors: ["#22c55e", "#16a34a", "#10b981"],
    particleCount: 100,
  });

  const handleClaimMilestone = async () => {
    await claimMilestone(milestonId);
    triggerMultiBurst(4); // 4-burst celebration
  };

  return (
    <button 
      onClick={handleClaimMilestone}
      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
    >
      Claim Milestone
    </button>
  );
}
```

### Custom Color Themes

```tsx
// Green/Emerald (School Theme)
schoolColors={["#22c55e", "#16a34a", "#10b981", "#059669"]}

// Blue/Indigo (Alternative)
schoolColors={["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]}

// Rainbow
schoolColors={["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#8b00ff"]}

// Gold/Amber (Achievement)
schoolColors={["#fbbf24", "#f59e0b", "#d97706", "#b45309"]}
```

### Advanced: Manual Celebration Trigger

```tsx
import { useMilestoneCelebration } from "@/lib/hooks/useMilestoneCelebration";

export function StudentsMatched() {
  const { triggerCelebration } = useMilestoneCelebration();

  // Celebrate when mentorship match succeeds
  useEffect(() => {
    if (matchSuccessful) {
      triggerCelebration();
    }
  }, [matchSuccessful]);

  return <MatchConfirmation />;
}
```

---

## 🔗 Integration Checklist

### Step-by-Step Setup

- [ ] Install dependencies: `npm install framer-motion canvas-confetti @types/canvas-confetti`
- [ ] Add `PageTransition` to `app/(dashboards)/student/template.tsx`
- [ ] Create `/public/animations/` directory
- [ ] Download/create `.lottie` files for `EvolutionAvatar`
- [ ] Import `AnimatedCounter` in dashboard KPI cards
- [ ] Add `RadarScanner` to matchmaking discovery flows
- [ ] Use `ShareAchievementButton` in badge components
- [ ] Test all animations in development: `npm run dev`

### Verification Commands

```bash
# Verify all components exist
ls components/animations/
# Output should show:
# - PageTransition.tsx
# - EvolutionAvatar.tsx
# - AnimatedCounter.tsx
# - RadarScanner.tsx
# - ShareAchievementButton.tsx
# - index.ts

# Verify hooks exist
ls lib/hooks/
# Output should show:
# - useMilestoneCelebration.ts
```

---

## 🎮 Testing Animation Components Locally

Create `app/animations-demo/page.tsx` for testing:

```tsx
"use client";

import {
  PageTransition,
  EvolutionAvatar,
  AnimatedCounter,
  RadarScanner,
  ShareAchievementButton,
} from "@/components/animations";
import { useState } from "react";
import { useMilestoneCelebration } from "@/lib/hooks/useMilestoneCelebration";

export default function AnimationsDemo() {
  const [score, setScore] = useState(1250);
  const [avatarState, setAvatarState] = useState<"idle" | "running" | "excited" | "sad">("idle");
  const [isScanning, setIsScanning] = useState(false);
  const { triggerMultiBurst } = useMilestoneCelebration();

  return (
    <div className="grid grid-cols-2 gap-8 p-12">
      {/* AnimatedCounter */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-xl">
        <h3 className="text-green-200 mb-4">Innovation Score</h3>
        <AnimatedCounter 
          value={score}
          className="text-4xl font-black text-green-400"
          suffix=" XP"
        />
        <button 
          onClick={() => setScore(score + Math.random() * 200)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Score
        </button>
      </div>

      {/* EvolutionAvatar */}
      <div className="flex flex-col items-center gap-4">
        <EvolutionAvatar state={avatarState} size={200} />
        <select 
          value={avatarState}
          onChange={(e) => setAvatarState(e.target.value as any)}
          className="px-4 py-2 border rounded"
        >
          <option>idle</option>
          <option>running</option>
          <option>excited</option>
          <option>sad</option>
        </select>
      </div>

      {/* RadarScanner */}
      <div className="flex flex-col items-center gap-4">
        <RadarScanner isScanning={isScanning} icon="brain" size="md" />
        <button 
          onClick={() => setIsScanning(!isScanning)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Toggle Scan
        </button>
      </div>

      {/* ShareAchievementButton */}
      <ShareAchievementButton 
        achievement="🏆 Community Leader"
        description="Completed 10 mentorships"
        linkedinText="Just achieved Community Leader on INNOVEX! 🚀"
      />
    </div>
  );
}
```

Visit: `http://localhost:3000/animations-demo`

---

## 📚 Production Deployment Checklist

- [ ] Remove or hide animations demo page (or protect behind admin route)
- [ ] Verify Lottie files are optimized (<50KB each)
- [ ] Test confetti performance on mobile devices
- [ ] Ensure page transitions don't conflict with existing animations
- [ ] Test accessibility (animations respect `prefers-reduced-motion`)
- [ ] Monitor performance: animations should not impact Core Web Vitals
- [ ] Test on real 3G network: animations should feel smooth

### Performance Optimization Tips

```tsx
// In AnimatedCounter: already uses requestAnimationFrame for 60fps
// In RadarScanner: uses Framer Motion GPU-accelerated transforms
// In EvolutionAvatar: Lottie handles its own optimization

// For confetti on mobile: reduce particle count
const particleCount = window.innerWidth < 768 ? 30 : 100;
```

---

## 🐛 Troubleshooting

### "Lottie animation won't load"
- Check that `/public/animations/avatar_*.lottie` files exist
- Verify file names match exactly (case-sensitive)
- Check browser console for CORS errors

### "Confetti not showing"
- Ensure canvas element is created (check DOM in DevTools)
- Verify z-index: 9999 is not being blocked by other elements
- On mobile, check if hardware acceleration is disabled

### "Page transitions feel janky"
- Reduce transition duration in `PageTransition.tsx`
- Use `exit={{ opacity: 0 }}` instead of `exit={{ opacity: 0, y: -15 }}`
- Verify no other animations are running on page load

### "AnimatedCounter showing wrong number"
- Check that `value` prop is a valid number
- Verify `duration` is not 0
- Ensure parent component re-renders when value changes

---

## 📖 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- [dotLottie React Player](https://www.npmjs.com/package/@lottiefiles/dotlottie-react)
- [Lottie Animation Library](https://lottiefiles.com/)
- [Tailwind CSS Arbitrary Values](https://tailwindcss.com/docs/arbitrary-values)

---

## ✅ Summary

You now have a complete animation layer for INNOVEX featuring:

1. ✅ **PageTransition** - Smooth page navigation
2. ✅ **EvolutionAvatar** - Dynamic character feedback
3. ✅ **AnimatedCounter** - Engaging score updates
4. ✅ **RadarScanner** - AI processing visualization
5. ✅ **Celebration Hook + Share Button** - Gamified achievements

All components are:
- ✅ TypeScript typed
- ✅ Tailwind styled
- ✅ Production-ready
- ✅ Mobile-optimized
- ✅ Fully documented

Happy animating! 🎨✨
