import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import Navbar from "@/components/shared/Navbar";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, rs_id, full_name, email, role, institution, department, innovation_score, created_at",
    )
    .order("created_at", { ascending: false });

  const users = profiles ?? [];

  const roleColors: Record<string, string> = {
    student:
      "bg-purple-500/10 text-purple-400 ring-purple-500/30",
    mentor:
      "bg-blue-500/10 text-blue-400 ring-blue-500/30",
    investor:
      "bg-green-500/10 text-green-400 ring-green-500/30",
    admin:
      "bg-red-500/10 text-red-400 ring-red-500/30",
  };

  return (
    <div className="min-h-full">
      <Navbar title="User Management" subtitle={`${users.length} registered users`} />
      <div className="p-6">
        {/* Role Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["student", "mentor", "investor", "admin"] as const).map((role) => {
            const count = users.filter((u) => u.role === role).length;
            return (
              <div
                key={role}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs capitalize text-slate-400">{role}s</p>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-4 py-3 font-medium">RS ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Institution</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-purple-400">
                      {user.rs_id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white">
                      {user.full_name || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${roleColors[user.role] ?? "text-slate-400"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                      {user.institution || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-white">
                      {user.innovation_score ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
