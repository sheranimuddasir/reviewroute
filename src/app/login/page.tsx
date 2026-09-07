"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md overflow-hidden">
            <img src="/logo.png" alt="ReviewRoute" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-foreground">ReviewRoute</h1>
          <p className="text-sm text-muted mt-1">Sign in to your dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
                placeholder="you@business.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
                placeholder="Your password"
              />
            </div>

            {error && (
              <div className="bg-danger-light rounded-xl p-3 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-stone-200 dark:bg-stone-700 disabled:text-muted text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none active:scale-[0.98]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
