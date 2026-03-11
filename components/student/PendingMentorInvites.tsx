"use client";

import { useState } from "react";
import MentorshipResponseModal from "./MentorshipResponseModal";

interface PendingInvite {
  id: string; // matchId
  mentorName: string;
  mentorBio: string | null;
  mentorInstitution: string | null;
  mentorSkills: string[] | null;
  createdAt: string;
}

interface Props {
  invites: PendingInvite[];
}

function InviteCard({ invite }: { invite: PendingInvite }) {
  const [modal, setModal] = useState<"active" | "declined" | null>(null);
  const [responded, setResponded] = useState(false);

  if (responded) return null;

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600/30 text-2xl">
          🧑‍🏫
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white">{invite.mentorName}</h3>
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
              Wants to mentor you
            </span>
          </div>

          {invite.mentorInstitution && (
            <p className="mt-0.5 text-sm text-slate-400">
              {invite.mentorInstitution}
            </p>
          )}

          {invite.mentorBio && (
            <p className="mt-2 text-sm text-slate-300 line-clamp-2">
              {invite.mentorBio}
            </p>
          )}

          {invite.mentorSkills && invite.mentorSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {invite.mentorSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-600 bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setModal("active")}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 active:scale-95"
            >
              ✓ Accept
            </button>
            <button
              onClick={() => setModal("declined")}
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95"
            >
              ✕ Decline
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <MentorshipResponseModal
          matchId={invite.id}
          mentorName={invite.mentorName}
          initialStatus={modal}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setResponded(true);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

export default function PendingMentorInvites({ invites }: Props) {
  if (invites.length === 0) return null;

  return (
    <div className="rounded-xl border border-purple-500/20 bg-slate-900/60 p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
        <span>🔔</span> Mentor Invitations
        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
          {invites.length}
        </span>
      </h2>
      <div className="space-y-3">
        {invites.map((invite) => (
          <InviteCard key={invite.id} invite={invite} />
        ))}
      </div>
    </div>
  );
}
