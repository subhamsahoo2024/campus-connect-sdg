"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const LS_KEY = "ai_avatar_url";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  role: string;
  rsId: string;
  fullName: string;
  avatarUrl?: string | null;
  navItems: NavItem[];
}

export default function Sidebar({
  role,
  rsId,
  fullName,
  avatarUrl,
  navItems,
}: SidebarProps) {
  const pathname = usePathname();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Prefer localStorage value (updated by AvatarUpload) over server prop
  const [displayAvatar, setDisplayAvatar] = useState<string | null>(
    avatarUrl ?? null,
  );
  const backdropRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) setDisplayAvatar(stored);
  }, []);

  // Listen for storage changes (e.g. user generates new avatar in same session)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === LS_KEY) setDisplayAvatar(e.newValue ?? avatarUrl ?? null);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [avatarUrl]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  // Initials fallback
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-sm">
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-5">
          <h1 className="text-xl font-bold text-white">INNOVEX</h1>
          <p className="text-xs text-slate-400">Campus Innovation OS</p>
        </div>

        {/* User Badge */}
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar button */}
            <button
              onClick={() => displayAvatar && setLightboxOpen(true)}
              title={displayAvatar ? "View photo" : undefined}
              className={`relative shrink-0 h-11 w-11 rounded-full overflow-hidden border-2 border-purple-500/40 transition-all duration-200 ${
                displayAvatar
                  ? "cursor-pointer hover:border-purple-400 hover:scale-105 hover:shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                  : "cursor-default"
              }`}
              aria-label={
                displayAvatar ? "View profile photo fullscreen" : undefined
              }
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-600 to-violet-700 text-white text-sm font-bold">
                  {initials}
                </div>
              )}
            </button>

            {/* Name / RS ID / Role */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white leading-tight">
                {fullName}
              </p>
              <p className="mt-0.5 text-xs font-mono text-purple-400 truncate">
                {rsId}
              </p>
              <span className="mt-1 inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium capitalize text-purple-300">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isRoot = item.href.split("/").filter(Boolean).length === 1;
              const isActive =
                pathname === item.href ||
                (!isRoot && pathname.startsWith(item.href + "/"));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="border-t border-white/10 px-3 py-4">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-base">🚪</span>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Fullscreen lightbox */}
      {lightboxOpen && displayAvatar && (
        <div
          ref={backdropRef}
          onClick={(e) => {
            if (e.target === backdropRef.current) setLightboxOpen(false);
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo fullscreen"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-lg hover:bg-white/20 transition"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Image */}
          <div className="relative max-h-[90vh] max-w-[90vw]">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-3xl scale-110 pointer-events-none" />
            <img
              src={displayAvatar}
              alt={fullName}
              className="relative max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>

          <p className="absolute bottom-6 text-sm text-white/40 font-medium">
            Click outside to close · or press Esc
          </p>
        </div>
      )}
    </>
  );
}
