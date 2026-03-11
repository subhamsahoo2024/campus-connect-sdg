"use client";

import { useState } from "react";
import { respondToMentorshipInvite } from "@/app/actions/mentorship";

interface MentorshipResponseModalProps {
  matchId: string;
  mentorName: string;
  initialStatus: "active" | "declined";
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MentorshipResponseModal({
  matchId,
  mentorName,
  initialStatus,
  onClose,
  onSuccess,
}: MentorshipResponseModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAccepting = initialStatus === "active";

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await respondToMentorshipInvite(matchId, initialStatus, reason);
      setDone(true);
      onSuccess?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const accentClass = isAccepting
    ? "bg-green-600 hover:bg-green-500"
    : "bg-red-600 hover:bg-red-500";

  const placeholder = isAccepting
    ? "e.g. I'd love to connect! Your expertise in FinTech is exactly what I need."
    : "e.g. I'm currently too busy with exams, but I'll reach out again soon.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white disabled:opacity-50"
          aria-label="Close"
        >
          ✕
        </button>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="text-5xl">{isAccepting ? "🎉" : "👋"}</span>
            <h2 className="text-xl font-bold text-white">
              {isAccepting ? "Mentorship Accepted!" : "Response Sent"}
            </h2>
            <p className="text-sm text-slate-400">
              {isAccepting
                ? `You're now connected with ${mentorName}. Check your mentees list to get started.`
                : `${mentorName} has been notified of your decision.`}
            </p>
            <button
              onClick={onClose}
              className={`mt-2 rounded-lg px-6 py-2 text-sm font-semibold text-white transition ${accentClass}`}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-lg font-bold text-white">
              {isAccepting ? "Accept Mentorship" : "Decline Mentorship"}
            </h2>
            <p className="mb-5 text-sm text-slate-400">
              {isAccepting ? (
                <>
                  You&apos;re accepting{" "}
                  <span className="font-medium text-white">{mentorName}</span>
                  &apos;s invite. Add a message to kick things off!
                </>
              ) : (
                <>
                  You&apos;re declining{" "}
                  <span className="font-medium text-white">{mentorName}</span>
                  &apos;s invite. A short note helps them understand.
                </>
              )}
            </p>

            <div className="mb-5">
              <label
                htmlFor="response-reason"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Your message <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                id="response-reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-500/20">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${accentClass}`}
              >
                {loading
                  ? "Sending…"
                  : isAccepting
                    ? "Accept & Send"
                    : "Decline & Send"}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
