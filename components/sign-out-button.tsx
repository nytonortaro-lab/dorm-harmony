"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

type SignOutButtonProps = {
  className?: string;
};

export default function SignOutButton({ className }: SignOutButtonProps) {
  const { t } = useApp();
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
      alert(t("networkError"));
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      <LogOut className="size-4" />
      {loading ? t("saving") : t("signOut")}
    </Button>
  );
}
