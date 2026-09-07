"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // TODO: In production, this should use Supabase Auth invite flow
    // For now, we use standard sign up which works with invite links
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-5">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-sm text-muted mb-6">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>
          </p>
          <Link
            href="/login"
            className="text-sm text-accent hover:underline font-medium"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
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
          <p className="text-sm text-muted mt-1">Create your account</p>
          <p className="text-xs text-accent mt-2 bg-accent/10 rounded-lg px-3 py-1.5 inline-block">
            {/* TODO: Switch to invite-based flow */}
            Invite-only — contact your administrator
          </p>
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
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
                placeholder="Repeat your password"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
