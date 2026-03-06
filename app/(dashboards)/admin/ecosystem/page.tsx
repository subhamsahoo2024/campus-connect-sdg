import { getEcosystemCharts, getAdminKPIs } from "@/app/actions/admin";
import Navbar from "@/components/shared/Navbar";
import EcosystemCharts from "@/components/admin/EcosystemCharts";

export const dynamic = "force-dynamic";

export default async function EcosystemPage() {
  const [charts, kpis] = await Promise.all([
    getEcosystemCharts(),
    getAdminKPIs(),
  ]);

  return (
    <div className="min-h-full">
      <Navbar
        title="Ecosystem Overview"
        subtitle="Platform-wide analytics and trends"
      />
      <div className="space-y-6 p-6">
        {/* Summary Cards */}
        {kpis && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-2xl font-bold text-white">
                {kpis.startups.total}
              </p>
              <p className="text-xs text-slate-400">Total Startups</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-2xl font-bold text-white">
                {kpis.users.total}
              </p>
              <p className="text-xs text-slate-400">Total Users</p>
            </div>
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-2xl font-bold text-white">
                {kpis.engagement.active_matches}
              </p>
              <p className="text-xs text-slate-400">Active Matches</p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-2xl font-bold text-white">
                ${(kpis.funding.total / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-slate-400">Total Funding</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <EcosystemCharts charts={charts} />

        {/* Stage & Domain Breakdown Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {kpis && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">
                Startups by Stage
              </h3>
              <div className="space-y-2">
                {Object.entries(kpis.startups.by_stage).map(
                  ([stage, count]) => (
                    <div
                      key={stage}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                    >
                      <span className="text-sm capitalize text-slate-300">
                        {stage}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {count as number}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {kpis && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">
                Startups by Domain
              </h3>
              <div className="space-y-2">
                {Object.entries(kpis.startups.by_domain).map(
                  ([domain, count]) => (
                    <div
                      key={domain}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                    >
                      <span className="text-sm text-slate-300">{domain}</span>
                      <span className="font-mono text-sm font-bold text-white">
                        {count as number}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
