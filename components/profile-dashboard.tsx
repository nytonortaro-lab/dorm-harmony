"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, UserSquare2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ImageUpload } from "@/components/image-upload";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-context";
import {
  calculateProfileCompletion,
  getEmailName,
  type DormProfile,
  type SerializedAppUser,
} from "@/lib/dorm-data";
import { useDormUser } from "@/lib/use-dorm-user";

type ProfileDashboardProps = {
  user: SerializedAppUser;
};

export function ProfileDashboard({ user }: ProfileDashboardProps) {
  const { t } = useApp();
  const { email, metadata, saveMetadata, isSaving, message } = useDormUser(user);
  const [profile, setProfile] = useState(metadata.dormProfile);

  const displayName =
    profile.displayName || getEmailName(email) || t("profileNameFallback");
  const completion = calculateProfileCompletion(profile);

  function updateField(field: keyof DormProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    await saveMetadata({ dormProfile: profile }, t("profileSaved"));
  }

  return (
    <AppShell userEmail={email} displayName={displayName}>
      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border/70 bg-card/85 p-6 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur">
            <Badge variant="secondary" className="rounded-full px-3">
              {t("personalProfile")}
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {t("personalProfile")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t("personalProfileHint")}
            </p>
          </section>

          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserSquare2 className="size-5" />
                {t("saveChanges")}
              </CardTitle>
              <CardDescription>{t("whoCanSee")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 pb-6">
              <div className="grid gap-2">
                <Label>{t("displayName")}</Label>
                <Input
                  value={profile.displayName}
                  onChange={(event) => updateField("displayName", event.target.value)}
                  className="h-11 rounded-xl bg-background/85"
                  placeholder={t("usernamePlaceholder")}
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("bio")}</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className="min-h-28 rounded-xl bg-background/85"
                  placeholder={t("bioPlaceholder")}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>{t("roommateGoal")}</Label>
                  <Input
                    value={profile.roommateGoal}
                    onChange={(event) => updateField("roommateGoal", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("roomGoalPlaceholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("mbti")}</Label>
                  <Input
                    value={profile.mbti}
                    onChange={(event) => updateField("mbti", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder="INFJ / ENTP"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("hobbies")}</Label>
                  <Input
                    value={profile.hobbies}
                    onChange={(event) => updateField("hobbies", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("hobbiesPlaceholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("sleepTime")}</Label>
                  <Input
                    value={profile.sleepTime}
                    onChange={(event) => updateField("sleepTime", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder="11:30 PM / 6:40 AM"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("cleanliness")}</Label>
                  <Input
                    value={profile.cleanliness}
                    onChange={(event) => updateField("cleanliness", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("optionDaily")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("noiseTolerance")}</Label>
                  <Input
                    value={profile.noiseTolerance}
                    onChange={(event) => updateField("noiseTolerance", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder={t("optionQuiet")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("preferredTemp")}</Label>
                  <Input
                    value={profile.preferredTemp}
                    onChange={(event) => updateField("preferredTemp", event.target.value)}
                    className="h-11 rounded-xl bg-background/85"
                    placeholder="23 C"
                  />
                </div>
              </div>

              {message ? (
                <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                  {message}
                </div>
              ) : null}

              <Button
                type="button"
                className="w-fit rounded-xl"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? t("saving") : t("saveChanges")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="size-5" />
                {t("avatar")}
              </CardTitle>
              <CardDescription>{t("avatarHint")}</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ImageUpload
                currentImage={profile.avatarUrl}
                onImageChange={(imageUrl) => updateField("avatarUrl", imageUrl)}
                onImageDelete={() => updateField("avatarUrl", "")}
              />
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle>{t("publicPreview")}</CardTitle>
              <CardDescription>{t("profileCard")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pb-6">
              <div className="rounded-xl border border-border/70 bg-background/90 p-5">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/15 text-lg font-semibold text-primary">
                    {profile.avatarUrl ? (
                      <div className="relative size-full">
                        <Image
                          src={profile.avatarUrl}
                          alt={displayName}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      displayName.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.mbti || "MBTI"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {profile.bio || t("bioPlaceholder")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[profile.cleanliness, profile.noiseTolerance, profile.preferredTemp]
                    .filter((value) => value.trim().length > 0)
                    .map((value) => (
                      <Badge key={value} variant="outline">
                        {value}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/90 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{t("profileCompletion")}</p>
                  <p className="text-sm text-muted-foreground">{completion}%</p>
                </div>
                <Progress value={completion} className="mt-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
