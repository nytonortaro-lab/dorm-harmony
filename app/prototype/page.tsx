"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PrototypeTab = "overview" | "discover" | "my-space" | "community";

type DemoProfile = {
  id: string;
  name: string;
  bio: string;
  mbti: string;
  sleepTime: string;
  noiseTolerance: string;
  preferredTemp: string;
  tags: string[];
};

type CommunityPost = {
  id: number;
  user_id: string;
  author_email: string;
  title: string;
  content: string;
  created_at: string;
};

const demoProfiles: DemoProfile[] = [
  {
    id: "1",
    name: "Lina",
    bio: "Quiet and tidy. Prefers a calm room and sleeps before midnight.",
    mbti: "INFJ",
    sleepTime: "Before 12:00 AM",
    noiseTolerance: "Low",
    preferredTemp: "23°C",
    tags: ["Quiet", "Tidy", "Study-focused"],
  },
  {
    id: "2",
    name: "Aaron",
    bio: "Friendly but values boundaries. Likes clear rules and communication.",
    mbti: "INTP",
    sleepTime: "12:00 AM - 1:00 AM",
    noiseTolerance: "Medium",
    preferredTemp: "24°C",
    tags: ["Communicative", "Flexible", "Gaming"],
  },
  {
    id: "3",
    name: "Mika",
    bio: "Creative and social, but still values mutual respect and quiet hours.",
    mbti: "ENFP",
    sleepTime: "Around 12:00 AM",
    noiseTolerance: "Medium",
    preferredTemp: "25°C",
    tags: ["Creative", "Social", "Open-minded"],
  },
];

export default function PrototypePage() {
  const supabase = createClient();

  const [tab, setTab] = useState<PrototypeTab>("overview");
  const [selectedId, setSelectedId] = useState("1");

  const [userEmail, setUserEmail] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  const feedRef = useRef<HTMLDivElement | null>(null);

  const selectedProfile = useMemo(
    () => demoProfiles.find((p) => p.id === selectedId) ?? demoProfiles[0],
    [selectedId]
  );

  async function loadCurrentUser() {
    setLoadingUser(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    setUserEmail(user.email || "");
    setLoadingUser(false);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setPosts(data || []);
  }

  async function handlePublishPost(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must log in first.");
      setPosting(false);
      return;
    }

    const { error } = await supabase.from("community_posts").insert([
      {
        user_id: user.id,
        author_email: user.email,
        title,
        content,
      },
    ]);

    if (error) {
      setMessage(error.message);
      setPosting(false);
      return;
    }

    setTitle("");
    setContent("");
    setMessage("Post published successfully.");
    setPosting(false);

    await loadPosts();

    setTimeout(() => {
      feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/login";
  }

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-2xl font-bold">DormHarmony</p>
              <p className="mt-2 text-sm text-slate-500">
                Full prototype workspace
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {loadingUser ? "Loading user..." : `Logged in as: ${userEmail}`}
              </p>
            </div>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => setTab("overview")}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  tab === "overview"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setTab("discover")}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  tab === "discover"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Find Roommates
              </button>

              <button
                onClick={() => setTab("my-space")}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  tab === "my-space"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                My Space
              </button>

              <button
                onClick={() => setTab("community")}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  tab === "community"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Community
              </button>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-100 p-4">
              <p className="font-medium">Quick links</p>
              <div className="mt-3 space-y-2 text-sm">
                <a href="/" className="block underline">
                  Back to current home
                </a>
                <a href="/community" className="block underline">
                  Open standalone community page
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-auto rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h1 className="text-4xl font-bold">Prototype Overview</h1>
                <p className="mt-4 max-w-2xl text-slate-600">
                  This is the fuller prototype workspace. It now uses your real
                  login state and real community post data.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Profile status", "Connected"],
                  ["Questionnaire", "Demo block"],
                  ["Candidate pool", String(demoProfiles.length)],
                  ["Community feed", String(posts.length)],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-3 text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold">Recommended Profiles</h2>
                  <div className="mt-6 space-y-4">
                    {demoProfiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setSelectedId(profile.id);
                          setTab("discover");
                        }}
                        className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{profile.name}</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {profile.bio}
                            </p>
                          </div>
                          <span className="rounded-xl bg-slate-100 px-3 py-1 text-sm">
                            {profile.mbti}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {profile.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold">Current User Card</h2>
                  <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
                    <p className="text-2xl font-bold">{userEmail || "User"}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Real authenticated account
                    </p>
                    <p className="mt-4 text-sm text-slate-300">
                      This block is now connected to your real login session.
                    </p>
                    <div className="mt-5 grid gap-3 text-sm">
                      <div className="rounded-2xl bg-white/10 p-3">
                        Community posts in database: {posts.length}
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        Route: /prototype
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        Auth: active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "discover" && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Browse Profiles</h2>
                <div className="mt-6 space-y-4">
                  {demoProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedId(profile.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedId === profile.id
                          ? "border-slate-900 bg-slate-100"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-semibold">{profile.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {profile.bio}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold">
                    {selectedProfile.name}'s Profile
                  </h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-medium">Bio</p>
                      <p className="mt-2 text-slate-600">
                        {selectedProfile.bio}
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 p-4 text-sm">
                        Sleep: {selectedProfile.sleepTime}
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 text-sm">
                        Noise: {selectedProfile.noiseTolerance}
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 text-sm">
                        Temp: {selectedProfile.preferredTemp}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold">Prototype Match Result</h2>
                  <div className="mt-6 rounded-2xl bg-green-50 p-4">
                    <p className="font-medium text-green-700">Moderate Match</p>
                    <p className="mt-2 text-sm text-slate-700">
                      This area can be connected to real matching logic later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "my-space" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-300 px-4 py-3"
                    defaultValue="Nyto"
                    placeholder="Name"
                  />
                  <input
                    className="rounded-2xl border border-slate-300 px-4 py-3"
                    defaultValue="INTP"
                    placeholder="MBTI"
                  />
                  <input
                    className="rounded-2xl border border-slate-300 px-4 py-3"
                    defaultValue="Before 12:00 AM"
                    placeholder="Sleep time"
                  />
                  <input
                    className="rounded-2xl border border-slate-300 px-4 py-3"
                    defaultValue="Low"
                    placeholder="Noise tolerance"
                  />
                </div>

                <textarea
                  className="mt-4 min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3"
                  defaultValue="Quiet, independent, and values personal space."
                />

                <button className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-white">
                  Save Changes
                </button>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Questionnaire Builder</h2>
                <div className="mt-6 space-y-4">
                  {[
                    "What time do you usually sleep on weekdays?",
                    "How much noise can you tolerate?",
                    "What room temperature do you prefer?",
                  ].map((question) => (
                    <div
                      key={question}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <p className="font-medium">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "community" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Real Community</h2>

                <form onSubmit={handlePublishPost} className="mt-6 grid gap-4">
                  <input
                    className="rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                  />
                  <textarea
                    className="min-h-[140px] rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Write your community post here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2000}
                    required
                  />

                  {message && (
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={posting}
                    className="w-fit rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-60"
                  >
                    {posting ? "Publishing..." : "Publish Post"}
                  </button>
                </form>
              </div>

              <div ref={feedRef} className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Feed</h2>
                <div className="mt-6 space-y-4">
                  {posts.length === 0 ? (
                    <p className="text-slate-500">No posts yet.</p>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <p className="font-semibold">{post.title}</p>
                          <span className="text-sm text-slate-500">
                            {new Date(post.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {post.author_email}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-slate-700">
                          {post.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}