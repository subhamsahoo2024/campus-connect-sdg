import {
  getMentorConnections,
  getMentorDomainStats,
  getMentorMeetings,
} from "@/app/actions/mentor";
import Navbar from "@/components/shared/Navbar";
import DomainChart from "@/components/mentor/DomainChart";

export const dynamic = "force-dynamic";

export default async function MentorAnalyticsPage() {
  const [connections, domainStats, meetings] = await Promise.all([
    getMentorConnections(),
    getMentorDomainStats(),
    getMentorMeetings(),
  ]);

  const active = connections.filter((c) => c.status === "active").length;
  const completed = connections.filter((c) => c.status === "completed").length;
  const pending = connections.filter((c) => c.status === "pending").length;
  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "completed",
  ).length;

  const avgCompatibility =
    connections.length > 0
      ? Math.round(
          (connections.reduce(
            (sum, c) => sum + (c.compatibility_score ?? 0),
            0,
          ) /
            connections.length) *
            100,
        )
      : 0;

  return (
    <div className="min-h-full">
      <Navbar
        title="Mentor Analytics"
        subtitle="Your mentoring impact and insights"
      />

      <div className="space-y-6 p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-2xl font-bold text-white">{active}</p>
            <p className="text-xs text-slate-400">Active Mentees</p>
          </div>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-2xl font-bold text-white">{pending}</p>
            <p className="text-xs text-slate-400">Pending</p>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-white">{completed}</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-2xl font-bold text-white">
              {connections.length}
            </p>
            <p className="text-xs text-slate-400">Total Connections</p>
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-2xl font-bold text-white">{totalMeetings}</p>
            <p className="text-xs text-slate-400">Meetings Held</p>
          </div>
          <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">
            <p className="text-2xl font-bold text-white">
              {avgCompatibility}%
            </p>
            <p className="text-xs text-slate-400">Avg Compatibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Domain Distribution */}
          <DomainChart data={domainStats} />

          {/* Meeting Stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-4 font-semibold text-white">Meeting Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-300">Total Scheduled</span>
                <span className="font-mono font-bold text-white">
                  {totalMeetings}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-300">Completed</span>
                <span className="font-mono font-bold text-green-400">
                  {completedMeetings}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-300">Upcoming</span>
                <span className="font-mono font-bold text-blue-400">
                  {totalMeetings - completedMeetings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Mentees */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">
            Recent Connections ({connections.length})
          </h3>
          {connections.length === 0 ? (
            <p className="text-sm text-slate-500">No connections yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-4 py-2 font-medium">Student</th>
                    <th className="px-4 py-2 font-medium">Startup</th>
                    <th className="px-4 py-2 font-medium">Score</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {connections.slice(0, 10).map((conn) => (
                    <tr key={conn.id} className="hover:bg-white/5">
                      <td className="whitespace-nowrap px-4 py-2 text-white">
                        {conn.profiles?.full_name ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-slate-300">
                        {conn.startups?.name ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-mono text-purple-400">
                        {conn.compatibility_score
                          ? `${Math.round(conn.compatibility_score * 100)}%`
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <span className="capitalize text-slate-300">
                          {conn.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-slate-400">
                        {new Date(conn.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
