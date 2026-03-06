import { getMentorMeetings, getMentorConnections } from "@/app/actions/mentor";
import Navbar from "@/components/shared/Navbar";
import MeetingScheduler from "@/components/mentor/MeetingScheduler";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const [meetings, connections] = await Promise.all([
    getMentorMeetings(),
    getMentorConnections(),
  ]);

  const activeMentees = connections
    .filter((c) => c.status === "active")
    .map((c) => ({
      matchId: c.id,
      menteeId: c.student_id,
      menteeName: c.profiles?.full_name ?? "Unknown",
      menteeRsId: c.profiles?.rs_id ?? "",
    }));

  const upcoming = meetings.filter(
    (m) =>
      new Date(m.scheduled_at) >= new Date() &&
      (m.status === "pending" || m.status === "confirmed"),
  );
  const past = meetings.filter(
    (m) =>
      new Date(m.scheduled_at) < new Date() || m.status === "completed",
  );

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
    confirmed: "bg-green-500/10 text-green-400 ring-green-500/30",
    completed: "bg-blue-500/10 text-blue-400 ring-blue-500/30",
    cancelled: "bg-red-500/10 text-red-400 ring-red-500/30",
  };

  return (
    <div className="min-h-full">
      <Navbar
        title="Meetings"
        subtitle={`${upcoming.length} upcoming · ${past.length} past`}
      />

      <div className="space-y-6 p-6">
        {/* Schedule New Meeting */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Schedule a Meeting 📅
          </h2>
          {activeMentees.length === 0 ? (
            <p className="text-sm text-slate-400">
              No active mentees yet.{" "}
              <a href="/mentor/suggested" className="text-purple-400 underline">
                Browse suggested mentees
              </a>{" "}
              to get started.
            </p>
          ) : (
            <MeetingScheduler mentees={activeMentees} />
          )}
        </div>

        {/* Upcoming Meetings */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">
            Upcoming Meetings ({upcoming.length})
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming meetings.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{meeting.title}</p>
                    <p className="text-xs text-slate-400">
                      with{" "}
                      {(meeting.profiles as any)?.full_name ?? "Unknown"} ·{" "}
                      {new Date(meeting.scheduled_at).toLocaleDateString()} at{" "}
                      {new Date(meeting.scheduled_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {meeting.duration_minutes} min
                    </p>
                    {meeting.description && (
                      <p className="mt-1 text-xs text-slate-500">
                        {meeting.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {meeting.meeting_link && (
                      <a
                        href={meeting.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs text-blue-300 transition hover:bg-blue-500/30"
                      >
                        Join
                      </a>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${statusColors[meeting.status] ?? ""}`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Meetings */}
        {past.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-4 font-semibold text-white">
              Past Meetings ({past.length})
            </h3>
            <div className="space-y-3">
              {past.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10 opacity-70"
                >
                  <div>
                    <p className="font-medium text-white">{meeting.title}</p>
                    <p className="text-xs text-slate-400">
                      with{" "}
                      {(meeting.profiles as any)?.full_name ?? "Unknown"} ·{" "}
                      {new Date(meeting.scheduled_at).toLocaleDateString()}
                    </p>
                    {meeting.notes && (
                      <p className="mt-1 text-xs text-slate-500">
                        Notes: {meeting.notes}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${statusColors[meeting.status] ?? ""}`}
                  >
                    {meeting.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
