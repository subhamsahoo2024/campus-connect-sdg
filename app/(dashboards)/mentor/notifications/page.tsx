import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyNotifications, markAllAsRead } from "@/app/actions/notifications";
import NotificationList from "@/components/notifications/NotificationList";
import Navbar from "@/components/shared/Navbar";

export const dynamic = "force-dynamic";

export default async function MentorNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const notifications = await getMyNotifications(50);

  return (
    <div className="min-h-full">
      <Navbar
        title="Notifications"
        subtitle="Student responses and platform updates"
      />

      <div className="mx-auto max-w-4xl space-y-6 p-6">
        {notifications.length > 0 && (
          <div className="flex justify-end">
            <form action={markAllAsRead}>
              <button
                type="submit"
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
              >
                Mark All as Read
              </button>
            </form>
          </div>
        )}

        <NotificationList notifications={notifications} />
      </div>
    </div>
  );
}
