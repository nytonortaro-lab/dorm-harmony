import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Find Roommates</h1>
        <p className="mt-3 text-slate-600">
          This page is now a real route and is protected by login.
        </p>

        <div className="mt-6">
          <a href="/" className="text-slate-900 underline">
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}