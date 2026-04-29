import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { serializeAppUser } from "@/lib/dorm-data";
import { ProfileDashboard } from "@/components/profile-dashboard";

export default async function MySpacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <ProfileDashboard user={serializeAppUser(user)} />;
}
