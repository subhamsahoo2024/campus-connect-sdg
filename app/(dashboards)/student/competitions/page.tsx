import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/shared/Navbar";
import RecommendedCompetitions from "@/components/student/RecommendedCompetitions";
import { CompetitionsSkeleton } from "@/components/student/RecommendedCompetitions";
import { getAllCompetitions } from "@/app/actions/competitions";

export const dynamic = "force-dynamic";

async function CompetitionsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("skills")
    .eq("id", user!.id)
    .single();

  const competitions = await getAllCompetitions(profile?.skills ?? []);

  return <RecommendedCompetitions competitions={competitions} />;
}

export default function CompetitionsPage() {
  return (
    <div className="min-h-full">
      <Navbar
        title="Competitions"
        subtitle="Discover hackathons & challenges matched to your skills"
      />
      <div className="p-6">
        <Suspense fallback={<CompetitionsSkeleton count={6} />}>
          <CompetitionsList />
        </Suspense>
      </div>
    </div>
  );
}
