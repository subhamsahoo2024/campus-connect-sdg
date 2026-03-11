"use client";

import Link from "next/link";
import { useState } from "react";
import { markAsRead } from "@/app/actions/notifications";
import MentorshipResponseModal from "@/components/student/MentorshipResponseModal";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

interface MentorshipInvitePayload {
  mentorId: string;
  mentorName: string;
  personalMessage: string;
  matchId: string;
}

function parseMentorshipPayload(raw: string): MentorshipInvitePayload | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.matchId && parsed.mentorName) return parsed;
  } catch {
    /* not JSON – regular message */
  }
  return null;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NOTIFICATION_ICONS: Record<string, string> = {
  badge_earned: "🏆",
  match_created: "🤝",
  meeting_scheduled: "📅",
  mission_reminder: "🎯",
  streak_warning: "🔥",
  startup_milestone: "🚀",
  investment_added: "💰",
  mentorship_invite: "🧑‍🏫",
  mentorship_response: "📬",
};

// ─── Mentorship invite card ─────────────────────────────────────────────────
function MentorshipInviteCard({
  notification,
  payload,
}: {
  notification: Notification;
  payload: MentorshipInvitePayload;
}) {
  const [responseModal, setResponseModal] = useState<
    "active" | "declined" | null
  >(null);
  const [responded, setResponded] = useState(false);
  const isUnread = !notification.is_read;

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm transition ${
        isUnread
          ? "border-purple-500/30 bg-purple-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-start gap-4 p-6">
        <div className="shrink-0 text-4xl">🧑‍🏫</div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">
              {notification.title}
            </h3>
            {isUnread && (
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-purple-500" />
            )}
          </div>

          {payload.personalMessage && (
            <blockquote className="rounded-lg border-l-2 border-purple-500/50 bg-purple-500/5 px-4 py-2 text-sm italic text-slate-300">
              &ldquo;{payload.personalMessage}&rdquo;
            </blockquote>
          )}

          <p className="text-xs text-slate-500">
            {new Date(notification.created_at).toLocaleString()}
          </p>

          {responded ? (
            <p className="text-sm font-medium text-green-400">
              ✓ Response sent
            </p>
          ) : (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setResponseModal("active")}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 active:scale-95"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => setResponseModal("declined")}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95"
              >
                ✕ Decline
              </button>
            </div>
          )}
        </div>
      </div>

      {responseModal && (
        <MentorshipResponseModal
          matchId={payload.matchId}
          mentorName={payload.mentorName}
          initialStatus={responseModal}
          onClose={() => setResponseModal(null)}
          onSuccess={() => {
            setResponded(true);
            setResponseModal(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Main list ──────────────────────────────────────────────────────────────
export default function NotificationList({
  notifications,
}: NotificationListProps) {
  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
        <div className="mb-4 text-6xl">🔔</div>
        <p className="text-xl text-slate-400">No notifications yet</p>
        <p className="mt-2 text-sm text-slate-500">
          You&apos;ll be notified when you earn badges, receive matches, or have
          important updates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        // Handle mentorship invite with inline accept/decline
        if (notification.type === "mentorship_invite") {
          const payload = parseMentorshipPayload(notification.message);
          if (payload) {
            return (
              <MentorshipInviteCard
                key={notification.id}
                notification={notification}
                payload={payload}
              />
            );
          }
        }

        // Generic notification card
        const icon = NOTIFICATION_ICONS[notification.type] || "📬";
        const isUnread = !notification.is_read;

        return (
          <div
            key={notification.id}
            className={`rounded-xl border backdrop-blur-sm transition ${
              isUnread
                ? "border-purple-500/30 bg-purple-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-start gap-4 p-6">
              <div className="shrink-0 text-4xl">{icon}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {notification.title}
                  </h3>
                  {isUnread && (
                    <span className="flex h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                  )}
                </div>
                <p className="text-slate-300">{notification.message}</p>
                <p className="text-sm text-slate-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isUnread && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
