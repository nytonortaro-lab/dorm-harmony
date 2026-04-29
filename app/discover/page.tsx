import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { serializeAppUser } from "@/lib/dorm-data";
import { DiscoverDashboard } from "@/components/discover-dashboard";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DiscoverDashboard user={serializeAppUser(user)} />;
}
