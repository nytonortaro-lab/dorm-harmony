"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    try {
      setLoading(true);

      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Sign out failed.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-2xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}