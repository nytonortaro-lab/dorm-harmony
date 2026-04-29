import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { serializeAppUser } from "@/lib/dorm-data";
import { CommunityDashboard } from "@/components/community-dashboard";

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <CommunityDashboard user={serializeAppUser(user)} />;
}
