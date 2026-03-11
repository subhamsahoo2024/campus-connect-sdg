"use client";

import { useState } from "react";
import { inviteStudentToMentor } from "@/app/actions/mentorship";

interface InviteMenteeModalProps {
  mentee: {
    id: string;
    full_name: string;
  };
  onClose: () => void;
}

export default function InviteMenteeModal({
  mentee,
  onClose,
}: InviteMenteeModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    try {
      await inviteStudentToMentor(mentee.id, message);
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        {sent ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="text-5xl">🎉</span>
            <h2 className="text-xl font-bold text-white">Invite Sent!</h2>
            <p className="text-sm text-slate-400">
              Your mentorship invite has been sent to{" "}
              <span className="font-medium text-white">{mentee.full_name}</span>
              . They will be notified and can accept or decline.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-lg font-bold text-white">
              Invite to Mentor
            </h2>
            <p className="mb-5 text-sm text-slate-400">
              You&apos;re inviting{" "}
              <span className="font-medium text-white">{mentee.full_name}</span>{" "}
              to a mentorship with you.
            </p>

            <div className="mb-5">
              <label
                htmlFor="invite-message"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Add a personal message{" "}
                <span className="text-slate-500">
                  (Optional but recommended)
                </span>
              </label>
              <textarea
                id="invite-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Hi! I reviewed your profile and I think your work on FinTech aligns with my expertise. I'd love to guide you through your startup journey."
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
                onClick={handleSend}
                disabled={loading}
                className="flex-1 rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Invite"}
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
