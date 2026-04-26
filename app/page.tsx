import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">DormHarmony</h1>
              <p className="mt-3 text-slate-600">Welcome back.</p>
              <p className="mt-2 text-sm text-slate-500">
                Logged in as: {user.email}
              </p>
            </div>

            <SignOutButton />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <a
              href="/discover"
              className="rounded-2xl bg-white px-5 py-4 text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Go to Find Roommates
            </a>

            <a
              href="/my-space"
              className="rounded-2xl bg-white px-5 py-4 text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Go to My Space
            </a>

            <a
              href="/community"
              className="rounded-2xl bg-white px-5 py-4 text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Go to Community
            </a>

            <a
              href="/prototype"
              className="rounded-2xl bg-amber-100 px-5 py-4 text-amber-900 transition hover:bg-amber-200"
            >
              Open Old Prototype
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}