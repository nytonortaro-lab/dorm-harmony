"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppPreferences } from "@/components/app-preferences";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

type AuthScreenProps = {
  mode: AuthMode;
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { t } = useApp();
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "register" && password !== confirmPassword) {
      setMessage(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            dormProfile: {
              displayName: username,
            },
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setMessage(t("registerSuccess"));
        router.push("/");
        router.refresh();
      } else {
        setMessage(t("registerEmailConfirm"));
      }

      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(t("loginSuccess"));
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  const registerHref = "/login?mode=register";
  const loginHref = "/login";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--page-top),transparent_24%),linear-gradient(180deg,var(--page-bottom),transparent_74%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1400px] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/82 p-6 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur sm:p-8">
          <div>
            <p className="text-2xl font-semibold tracking-tight">{t("brand")}</p>
            <p className="mt-4 max-w-2xl text-4xl leading-tight font-semibold tracking-tight">
              {mode === "login" ? t("loginTitle") : t("registerTitle")}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t("authLead")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Card className="rounded-xl border border-border/70 bg-background/80 py-0 shadow-none">
              <CardHeader className="pt-5">
                <CardTitle>{t("questionnaire")}</CardTitle>
                <CardDescription>{t("dashboardIntro")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-xl border border-border/70 bg-background/80 py-0 shadow-none">
              <CardHeader className="pt-5">
                <CardTitle>{t("communityTitle")}</CardTitle>
                <CardDescription>{t("communityHint")}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-10 rounded-xl border border-border/70 bg-background/75 p-4">
            <AppPreferences compact />
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full rounded-xl border border-border/70 bg-card/90 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur">
            <CardHeader className="pt-6">
              <div className="flex gap-2">
                <Button
                  asChild
                  variant={mode === "login" ? "default" : "outline"}
                  className="rounded-xl"
                >
                  <Link href={loginHref}>
                    <LogIn className="size-4" />
                    {t("signIn")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={mode === "register" ? "default" : "outline"}
                  className="rounded-xl"
                >
                  <Link href={registerHref}>
                    <UserPlus className="size-4" />
                    {t("signUp")}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <form onSubmit={handleSubmit} className="grid gap-5">
                {mode === "register" ? (
                  <div className="grid gap-2">
                    <Label>{t("username")}</Label>
                    <Input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="h-11 rounded-xl bg-background/85"
                      placeholder={t("usernamePlaceholder")}
                      required
                    />
                  </div>
                ) : null}

                <div className="grid gap-2">
                  <Label>{t("email")}</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t("password")}</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("passwordPlaceholder")}
                    required
                  />
                </div>

                {mode === "register" ? (
                  <div className="grid gap-2">
                    <Label>{t("confirmPassword")}</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="h-11 rounded-xl bg-background/85"
                      placeholder={t("passwordPlaceholder")}
                      required
                    />
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                    {message}
                  </div>
                ) : null}

                <Button type="submit" className="h-11 rounded-xl" disabled={loading}>
                  <ArrowRight className="size-4" />
                  {loading
                    ? mode === "login"
                      ? t("loggingIn")
                      : t("registering")
                    : mode === "login"
                      ? t("signInAction")
                      : t("signUpAction")}
                </Button>

                <Link
                  href={mode === "login" ? registerHref : loginHref}
                  className="text-left text-sm text-muted-foreground underline underline-offset-4"
                >
                  {mode === "login"
                    ? t("authSwitchToRegister")
                    : t("authSwitchToLogin")}
                </Link>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
