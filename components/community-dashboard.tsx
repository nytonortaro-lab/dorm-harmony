"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ImageUp,
  MessageSquareText,
  RefreshCcw,
  ScrollText,
  Sparkles,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-context";
import {
  buildProfileTags,
  createId,
  createStructuredPostContent,
  getEmailName,
  normalizeDormMetadata,
  parseStructuredPostContent,
  type SerializedAppUser,
} from "@/lib/dorm-data";
import { createClient } from "@/lib/supabase/client";
import { useDormUser } from "@/lib/use-dorm-user";

type CommunityPostRow = {
  id: number;
  user_id: string;
  author_email: string;
  title: string;
  content: string;
  created_at: string;
};

type CommunityDashboardProps = {
  user: SerializedAppUser;
};

export function CommunityDashboard({ user }: CommunityDashboardProps) {
  const { t, language } = useApp();
  const { email, userId, metadata, saveMetadata, isSaving, message } = useDormUser(user);
  const [supabase] = useState(() => createClient());
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [feedMessage, setFeedMessage] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [attachQuestions, setAttachQuestions] = useState(true);
  const [questions, setQuestions] = useState(metadata.customQuestions);

  const currentMetadata = normalizeDormMetadata(metadata, email);
  const displayName =
    currentMetadata.dormProfile.displayName ||
    getEmailName(email) ||
    t("profileNameFallback");

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    setFeedMessage("");

    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setFeedMessage(error.message);
      setLoadingPosts(false);
      return;
    }

    setPosts((data ?? []) as CommunityPostRow[]);
    setLoadingPosts(false);
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPosts]);

  function updateQuestion(id: string, prompt: string) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id ? { ...question, prompt } : question
      )
    );
  }

  function addQuestion() {
    setQuestions((current) => [...current, { id: createId(), prompt: "" }]);
  }

  function removeQuestion(id: string) {
    setQuestions((current) => current.filter((question) => question.id !== id));
  }

  async function handleSaveQuestions() {
    await saveMetadata(
      {
        customQuestions: questions,
      },
      t("questionsSaved")
    );
  }

  async function handlePublish(event: React.FormEvent) {
    event.preventDefault();
    setPublishing(true);
    setFeedMessage("");

    const activeQuestions = attachQuestions
      ? questions.map((question) => question.prompt.trim()).filter(Boolean)
      : [];

    const content = createStructuredPostContent({
      body,
      imageUrl,
      questions: activeQuestions,
      authorName: displayName,
      roommateGoal: currentMetadata.dormProfile.roommateGoal,
      tags: buildProfileTags(currentMetadata.dormProfile),
    });

    const { error } = await supabase.from("community_posts").insert([
      {
        user_id: userId,
        author_email: email,
        title,
        content,
      },
    ]);

    if (error) {
      setFeedMessage(error.message);
      setPublishing(false);
      return;
    }

    setTitle("");
    setBody("");
    setImageUrl("");
    setFeedMessage(t("postPublished"));
    setPublishing(false);
    await loadPosts();
  }

  return (
    <AppShell userEmail={email} displayName={displayName}>
      <div className="space-y-6">
        <section className="rounded-xl border border-border/70 bg-card/85 p-6 shadow-[0_24px_80px_-48px_var(--shadow-color)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="rounded-full px-3">
                {t("communityTitle")}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                {t("communityTitle")}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {t("communityHint")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={loadPosts}
            >
              <RefreshCcw className="size-4" />
              {t("refresh")}
            </Button>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
              <CardHeader className="pt-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquareText className="size-5" />
                  {t("createPost")}
                </CardTitle>
                <CardDescription>{t("communityComposerHint")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 pb-6">
                <form onSubmit={handlePublish} className="grid gap-5">
                  <div className="grid gap-2">
                    <Label>{t("postTitle")}</Label>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="h-11 rounded-xl bg-background/85"
                      maxLength={120}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>{t("postBody")}</Label>
                    <Textarea
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      className="min-h-32 rounded-xl bg-background/85"
                      maxLength={2500}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>{t("postImage")}</Label>
                    <p className="text-sm text-muted-foreground">{t("postImageHint")}</p>
                    <ImageUpload
                      currentImage={imageUrl}
                      onImageChange={setImageUrl}
                      onImageDelete={() => setImageUrl("")}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant={attachQuestions ? "default" : "outline"}
                      className="rounded-xl"
                      onClick={() => setAttachQuestions((current) => !current)}
                    >
                      <ScrollText className="size-4" />
                      {t("attachQuestions")}
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl"
                      disabled={publishing}
                    >
                      <ImageUp className="size-4" />
                      {publishing ? t("publishing") : t("publishPost")}
                    </Button>
                  </div>

                  {feedMessage ? (
                    <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                      {feedMessage}
                    </div>
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
              <CardHeader className="pt-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="size-5" />
                  {t("questionnaireStudio")}
                </CardTitle>
                <CardDescription>{t("questionnaireStudioHint")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pb-6">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="grid gap-2 rounded-xl border border-border/70 bg-background/85 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Label>
                        {t("questionPrompt")} {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl"
                        onClick={() => removeQuestion(question.id)}
                      >
                        {t("removeQuestion")}
                      </Button>
                    </div>
                    <Input
                      value={question.prompt}
                      onChange={(event) =>
                        updateQuestion(question.id, event.target.value)
                      }
                      className="h-11 rounded-xl bg-background"
                      placeholder={t("askBeforeMatch")}
                    />
                  </div>
                ))}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={addQuestion}
                  >
                    {t("addQuestion")}
                  </Button>
                  <Button
                    type="button"
                    className="rounded-xl"
                    onClick={handleSaveQuestions}
                    disabled={isSaving}
                  >
                    {isSaving ? t("saving") : t("saveQuestions")}
                  </Button>
                </div>

                {message ? (
                  <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground">
                    {message}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border border-border/70 bg-card/85 py-0 shadow-[0_24px_80px_-48px_var(--shadow-color)]">
            <CardHeader className="pt-6">
              <CardTitle className="text-xl">{t("postFeed")}</CardTitle>
              <CardDescription>{t("communityHint")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pb-6">
              {loadingPosts ? (
                <div className="rounded-xl border border-border/70 bg-background/85 px-4 py-4 text-sm text-muted-foreground">
                  {t("loading")}
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/85 px-4 py-4 text-sm text-muted-foreground">
                  {t("noPostsYet")}
                </div>
              ) : (
                posts.map((post) => {
                  const payload = parseStructuredPostContent(post.content);

                  return (
                    <article
                      key={post.id}
                      className="rounded-xl border border-border/70 bg-background/85 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-medium">{post.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t("postBy")}: {payload.authorName || post.author_email}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleString(
                            language === "zh" ? "zh-CN" : "en-US"
                          )}
                        </div>
                      </div>

                      {payload.isLegacy ? (
                        <Badge variant="outline" className="mt-3">
                          {t("legacyPost")}
                        </Badge>
                      ) : null}

                      {payload.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {payload.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {payload.body}
                      </p>

                      {payload.roommateGoal ? (
                        <div className="mt-4 rounded-xl border border-border/70 bg-card px-3 py-3 text-sm text-muted-foreground">
                          {payload.roommateGoal}
                        </div>
                      ) : null}

                      {payload.imageUrl ? (
                        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
                          <Image
                            src={payload.imageUrl}
                            alt={t("uploadedImageAlt")}
                            width={1200}
                            height={800}
                            unoptimized
                            className="h-auto max-h-80 w-full object-cover"
                          />
                        </div>
                      ) : null}

                      {payload.questions.length > 0 ? (
                        <div className="mt-4 grid gap-2">
                          <p className="text-sm font-medium">{t("privateQuestions")}</p>
                          {payload.questions.map((question) => (
                            <div
                              key={question}
                              className="rounded-xl border border-border/70 bg-card px-3 py-2 text-sm text-muted-foreground"
                            >
                              {question}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
