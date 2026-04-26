"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CommunityPost = {
  id: number;
  user_id: string;
  author_email: string;
  title: string;
  content: string;
  created_at: string;
};

export default function CommunityPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const feedRef = useRef<HTMLDivElement | null>(null);

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

  async function loadCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    setUserEmail(user.email || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must log in first.");
      setLoading(false);
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
      setLoading(false);
      return;
    }

    setTitle("");
    setContent("");
    setMessage("Post published successfully.");
    setLoading(false);

    await loadPosts();

    setTimeout(() => {
      feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Community</h1>
          <p className="mt-3 text-slate-600">
            Logged in as: {userEmail || "Loading..."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-2xl bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Back to Home
            </a>

            <a
              href="/prototype"
              className="rounded-2xl bg-amber-100 px-4 py-2 text-amber-900 transition hover:bg-amber-200"
            >
              Open Full Prototype
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Create Post</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                placeholder="Write a title"
                required
                maxLength={120}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[140px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                placeholder="Write your post here"
                required
                maxLength={2000}
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>

        <div
          ref={feedRef}
          className="rounded-3xl bg-white p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Post Feed</h2>

          <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <p className="text-slate-500">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {post.title}
                    </h3>
                    <span className="text-sm text-slate-500">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {post.author_email}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap text-slate-700">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}