"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  key?: string | number;
}

/**
 * PageTransition - Global page transition wrapper
 * Wraps route changes with smooth slide-up and fade-in animation
 * 
 * Usage in template.tsx or layout.tsx:
 * ```tsx
 * <PageTransition key={pathname}>{children}</PageTransition>
 * ```
 */
export function PageTransition({ children, key }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Template Usage Example:
 *
 * In app/(dashboards)/student/template.tsx:
 *
 * ```tsx
 * "use client";
 *
 * import { usePathname } from "next/navigation";
 * import { PageTransition } from "@/components/animations/PageTransition";
 *
 * export default function Template({ children }: { children: React.ReactNode }) {
 *   const pathname = usePathname();
 *
 *   return <PageTransition key={pathname}>{children}</PageTransition>;
 * }
 * ```
 */
