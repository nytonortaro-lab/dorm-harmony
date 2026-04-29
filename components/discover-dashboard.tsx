"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Snowflake, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/lib/app-context";
import {
  calculateSurveyCompletion,
  getEmailName,
  getMatchResults,
  getMatchTone,
  surveyQuestions,
  type SerializedAppUser,
} from "@/lib/dorm-data";
import { useDormUser } from "@/lib/use-dorm-user";

type DiscoverDashboardProps = {
  user: SerializedAppUser;
};

export function DiscoverDashboard({ user }: DiscoverDashboardProps) {
  const { t } = useApp();
  const { email, metadata } = useDormUser(user);
  const displayName =
    metadata.dormProfile.displayName || getEmailName(email) || t("profileNameFallback");
  const completion = calculateSurveyCompletion(metadata.habitSurvey);
  const results = getMatchResults(metadata.habitSurvey);

  return (
    <AppShell userEmail={email} displayName={displayName}>
      <div className="space-y-6">
        <section className="rounded-xl border border-border/70 bg-card/85 p-6 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="rounded-full px-3">
                {t("discoverTitle")}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                {t("candidatePool")}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {t("discoverHint")}
              </p>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>
                {t("surveyCompletion")}: {completion}%
              </p>
              <p>{metadata.joinedPool ? t("joinedPool") : t("notInPool")}</p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/">
                  <ArrowRight className="size-4" />
                  {t("backHome")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {completion === 0 ? (
          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle>{t("noSurveyYet")}</CardTitle>
              <CardDescription>{t("completeSurveyPrompt")}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {results.map((match) => {
              const tone = getMatchTone(match.score);
              const toneLabel =
                tone === "strong"
                  ? t("strongMatch")
                  : tone === "moderate"
                    ? t("moderateMatch")
                    : t("lightMatch");

              return (
                <Card
                  key={match.profile.id}
                  className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]"
                >
                  <CardHeader className="pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{match.profile.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {match.profile.tagline}
                        </CardDescription>
                      </div>
                      <Badge variant={tone === "strong" ? "default" : "secondary"}>
                        {match.score}% {toneLabel}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="grid gap-4 pb-6">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {match.profile.bio}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="size-4" />
                          {match.profile.publicProfile.sleepTime}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Volume2 className="size-4" />
                          {match.profile.publicProfile.noise}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Snowflake className="size-4" />
                          {match.profile.publicProfile.temperature}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">{t("whyMatched")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.matchedFields.length > 0 ? (
                          match.matchedFields.map((field) => {
                            const labelKey = surveyQuestions.find(
                              (question) => question.id === field
                            )?.labelKey;

                            return labelKey ? (
                              <Badge key={field} variant="outline">
                                {t(labelKey)}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t("discoverEmptyHint")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">{t("privateQuestions")}</p>
                      <div className="mt-3 grid gap-2">
                        {match.profile.starterQuestions.map((question) => (
                          <div
                            key={question}
                            className="rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-muted-foreground"
                          >
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
