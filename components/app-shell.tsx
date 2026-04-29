"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Search,
  Users,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { AppPreferences } from "@/components/app-preferences";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: ReactNode;
  userEmail: string;
  displayName: string;
};

const navigation = [
  { href: "/", key: "navHome", icon: House },
  { href: "/discover", key: "navDiscover", icon: Search },
  { href: "/community", key: "navCommunity", icon: Users },
  { href: "/my-space", key: "navProfile", icon: UserRound },
] as const;

export function AppShell({ children, userEmail, displayName }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--page-top),transparent_28%),linear-gradient(180deg,var(--page-bottom),transparent_70%)]">
      <div className="mx-auto flex min-h-screen max-w-[1520px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[290px] shrink-0 flex-col rounded-xl border border-border/70 bg-card/80 p-5 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur lg:flex">
          <div>
            <p className="text-xl font-semibold tracking-tight">{t("brand")}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("appTagline")}
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {navigation.map(({ href, key, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Button
                  key={href}
                  asChild
                  variant={active ? "default" : "ghost"}
                  size="lg"
                  className={cn(
                    "h-11 justify-start rounded-xl px-3 text-sm",
                    !active && "text-muted-foreground"
                  )}
                >
                  <Link href={href}>
                    <Icon className="size-4" />
                    {t(key)}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-medium">{t("todayFocus")}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("homeGreeting")}
            </p>
            <Button asChild variant="outline" className="mt-4 w-full justify-between rounded-xl">
              <Link href="/discover">
                {t("goToPool")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 rounded-xl border border-border/70 bg-background/70 p-4">
            <AppPreferences />
          </div>

          <div className="mt-auto rounded-xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{userEmail}</p>
            <div className="mt-4">
              <SignOutButton className="w-full rounded-xl" />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="rounded-xl border border-border/70 bg-card/85 p-4 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur lg:hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight">{t("brand")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {userEmail}
                </p>
              </div>
              <SignOutButton className="rounded-xl" />
            </div>

            <div className="mt-4">
              <AppPreferences compact />
            </div>

            <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {navigation.map(({ href, key, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);

                return (
                  <Button
                    key={href}
                    asChild
                    variant={active ? "default" : "outline"}
                    className="h-11 rounded-xl"
                  >
                    <Link href={href}>
                      <Icon className="size-4" />
                      {t(key)}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </header>

          <div className="mt-6 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
