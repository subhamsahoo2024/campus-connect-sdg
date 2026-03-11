"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Mentor sends a mentorship invite to a student.
 *
 * - Upserts a `pending` row in `matches`
 * - Inserts a `mentorship_invite` notification for the student.
 *   The `message` column holds a JSON payload and `link` holds the matchId
 *   so the student UI can surface Accept / Decline controls.
 */
export async function inviteStudentToMentor(
  studentId: string,
  personalMessage: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: mentorProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const mentorName = mentorProfile?.full_name ?? "A mentor";

  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .eq("mentor_id", user.id)
    .eq("student_id", studentId)
    .maybeSingle();

  let matchId: string;

  if (existing) {
    await supabase
      .from("matches")
      .update({ status: "pending", updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    matchId = existing.id;
  } else {
    const { data: inserted, error } = await supabase
      .from("matches")
      .insert({ mentor_id: user.id, student_id: studentId, status: "pending" })
      .select("id")
      .single();
    if (error) throw new Error(`Failed to create match: ${error.message}`);
    matchId = inserted!.id;
  }

  const payload = JSON.stringify({
    mentorId: user.id,
    mentorName,
    personalMessage: personalMessage?.trim() ?? "",
    matchId,
  });

  const { error: notifError } = await supabase.from("notifications").insert({
    user_id: studentId,
    type: "mentorship_invite",
    title: `${mentorName} wants to mentor you!`,
    message: payload,
    link: matchId,
    is_read: false,
  });

  if (notifError)
    throw new Error(`Failed to send notification: ${notifError.message}`);

  revalidatePath("/mentor/suggested");
  revalidatePath("/student/notifications");
}

/**
 * Student responds to a mentorship invite.
 *
 * - Updates the `matches` row to `active` or `declined`
 * - Inserts a `mentorship_response` notification for the mentor
 */
export async function respondToMentorshipInvite(
  matchId: string,
  status: "active" | "declined",
  reasonMessage: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: studentProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const studentName = studentProfile?.full_name ?? "A student";

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", matchId)
    .eq("student_id", user.id)
    .select("mentor_id")
    .single();

  if (matchError || !match)
    throw new Error(
      `Failed to update match: ${matchError?.message ?? "not found"}`,
    );

  const verb = status === "active" ? "accepted" : "declined";
  const emoji = status === "active" ? "\u{1F389}" : "\u{1F614}";
  const reason = reasonMessage?.trim();

  const { error: notifError } = await supabase.from("notifications").insert({
    user_id: match.mentor_id,
    type: "mentorship_response",
    title: `${emoji} ${studentName} has ${verb} your invite`,
    message: reason
      ? `${studentName} ${verb} your mentorship invite. They said: "${reason}"`
      : `${studentName} has ${verb} your mentorship invite.`,
    link: `/mentor/mentees`,
    is_read: false,
  });

  if (notifError)
    throw new Error(`Failed to notify mentor: ${notifError.message}`);

  revalidatePath("/student/notifications");
  revalidatePath("/mentor/mentees");
  revalidatePath("/mentor");
}
