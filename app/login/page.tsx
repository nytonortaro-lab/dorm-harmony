import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthScreen } from "@/components/auth-screen";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const query = await searchParams;
  const requestedMode = Array.isArray(query.mode) ? query.mode[0] : query.mode;
  const mode = requestedMode === "register" ? "register" : "login";

  return <AuthScreen mode={mode} />;
}
