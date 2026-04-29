import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { serializeAppUser } from "@/lib/dorm-data";
import { HomeDashboard } from "@/components/home-dashboard";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <HomeDashboard user={serializeAppUser(user)} />;
}
