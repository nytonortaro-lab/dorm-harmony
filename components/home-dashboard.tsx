"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-context";
import {
  calculateProfileCompletion,
  calculateSurveyCompletion,
  getEmailName,
  getMatchResults,
  getMatchTone,
  surveyQuestions,
  type HabitSurvey,
  type SerializedAppUser,
} from "@/lib/dorm-data";
import { useDormUser } from "@/lib/use-dorm-user";

type HomeDashboardProps = {
  user: SerializedAppUser;
};

export function HomeDashboard({ user }: HomeDashboardProps) {
  const { t } = useApp();
  const { email, metadata, saveMetadata, isSaving, message, setMessage } =
    useDormUser(user);
  const [survey, setSurvey] = useState(metadata.habitSurvey);

  const displayName =
    metadata.dormProfile.displayName || getEmailName(email) || t("profileNameFallback");
  const surveyCompletion = calculateSurveyCompletion(survey);
  const profileCompletion = calculateProfileCompletion(metadata.dormProfile);
  const topMatches = getMatchResults(survey).slice(0, 3);

  async function handleSave(joinPool: boolean) {
    if (joinPool && surveyCompletion < 100) {
      setMessage(t("completeSurveyPrompt"));
      return;
    }

    await saveMetadata(
      {
        habitSurvey: survey,
        joinedPool: joinPool ? true : metadata.joinedPool,
        lastJoinedAt: joinPool ? new Date().toISOString() : metadata.lastJoinedAt,
      },
      joinPool ? t("joinedPoolSuccess") : t("habitSaved")
    );
  }

  async function handlePoolToggle() {
    if (!metadata.joinedPool && surveyCompletion < 100) {
      setMessage(t("completeSurveyPrompt"));
      return;
    }

    await saveMetadata(
      {
        habitSurvey: survey,
        joinedPool: !metadata.joinedPool,
        lastJoinedAt: !metadata.joinedPool ? new Date().toISOString() : undefined,
      },
      metadata.joinedPool ? t("leftPoolSuccess") : t("joinedPoolSuccess")
    );
  }

  function updateSurveyField(field: keyof HabitSurvey, value: string) {
    setSurvey((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <AppShell userEmail={email} displayName={displayName}>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border/70 bg-card/85 p-6 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-2xl">
                <Badge variant="secondary" className="rounded-full px-3">
                  {t("welcomeBack")}
                </Badge>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {displayName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {t("matchingHeadline")}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {t("matchingSubhead")}
                </p>
              </div>

              <div className="grid min-w-[220px] gap-2">
                <Button asChild className="rounded-xl">
                  <Link href="/discover">
                    <Search className="size-4" />
                    {t("goToPool")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/community">
                    <ArrowRight className="size-4" />
                    {t("goToCommunity")}
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant={metadata.joinedPool ? "secondary" : "outline"}
                  className="rounded-xl"
                  onClick={handlePoolToggle}
                  disabled={isSaving}
                >
                  <BadgeCheck className="size-4" />
                  {metadata.joinedPool ? t("leavePool") : t("joinPool")}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="border-0 bg-background/85 py-0 shadow-none ring-1 ring-border/70">
                <CardHeader>
                  <CardDescription>{t("surveyCompletion")}</CardDescription>
                  <CardTitle>{surveyCompletion}%</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Progress value={surveyCompletion} />
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/85 py-0 shadow-none ring-1 ring-border/70">
                <CardHeader>
                  <CardDescription>{t("profileCompletion")}</CardDescription>
                  <CardTitle>{profileCompletion}%</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Progress value={profileCompletion} />
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/85 py-0 shadow-none ring-1 ring-border/70">
                <CardHeader>
                  <CardDescription>{t("poolStatus")}</CardDescription>
                  <CardTitle>
                    {metadata.joinedPool ? t("joinedPool") : t("notInPool")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 text-sm text-muted-foreground">
                  {metadata.joinedPool ? t("poolHintReady") : t("poolHintDraft")}
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="size-5" />
                {t("questionnaire")}
              </CardTitle>
              <CardDescription>{t("questionnaireHint")}</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 pb-6">
              {surveyQuestions.map((question) => (
                <div key={question.id} className="grid gap-2">
                  <Label>{t(question.labelKey)}</Label>
                  <Select
                    value={survey[question.id]}
                    onValueChange={(value) => updateSurveyField(question.id, value)}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl bg-background/85">
                      <SelectValue placeholder={t("selectAnswer")} />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <div className="grid gap-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  value={survey.notes}
                  onChange={(event) => updateSurveyField("notes", event.target.value)}
                  className="min-h-28 rounded-xl bg-background/85"
                  placeholder={t("notesPlaceholder")}
                />
              </div>

              {message ? (
                <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                  {message}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="rounded-xl"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                >
                  {isSaving ? t("saving") : t("saveQuestionnaire")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  {t("saveAndJoinPool")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-5" />
                {t("matchPreview")}
              </CardTitle>
              <CardDescription>{t("matchPreviewHint")}</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 pb-6">
              {topMatches.length === 0 || surveyCompletion === 0 ? (
                <div className="rounded-xl border border-dashed border-border/80 bg-background/75 px-4 py-5 text-sm leading-6 text-muted-foreground">
                  {t("discoverEmptyHint")}
                </div>
              ) : (
                topMatches.map((match) => {
                  const tone = getMatchTone(match.score);
                  const toneLabel =
                    tone === "strong"
                      ? t("strongMatch")
                      : tone === "moderate"
                        ? t("moderateMatch")
                        : t("lightMatch");

                  return (
                    <div
                      key={match.profile.id}
                      className="rounded-xl border border-border/70 bg-background/85 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-medium">{match.profile.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {match.profile.tagline}
                          </p>
                        </div>
                        <Badge variant={tone === "strong" ? "default" : "secondary"}>
                          {match.score}% {toneLabel}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {match.profile.bio}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.profile.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserRound className="size-5" />
                {t("lifestyleSummary")}
              </CardTitle>
              <CardDescription>{t("completionHint")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pb-6">
              <div className="rounded-xl border border-border/70 bg-background/85 p-4">
                <p className="text-sm font-medium">{t("askBeforeMatch")}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {survey.notes || t("notesPlaceholder")}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/85 p-4">
                <p className="text-sm font-medium">{t("candidatePool")}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("candidatePoolHint")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
