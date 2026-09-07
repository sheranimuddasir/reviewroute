"use client";

import { useEffect, useState } from "react";

type BusinessProfile = {
  id: string;
  name: string;
  slug: string;
  google_review_url: string;
  logo_url: string | null;
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setGoogleReviewUrl(data.google_review_url || "");
        setLogoUrl(data.logo_url || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        google_review_url: googleReviewUrl,
        logo_url: logoUrl || null,
      }),
    });

    if (!res.ok) {
      setError("Failed to save changes");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-stone-100 dark:bg-stone-800 rounded-lg w-32 animate-pulse" />
        <div className="h-72 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl border border-border p-6 max-w-lg shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Business name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1.5">
              Review link
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted shrink-0 font-mono">/r/</span>
              <input
                id="slug"
                type="text"
                value={profile?.slug || ""}
                disabled
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-stone-50 dark:bg-stone-900 text-muted text-sm font-mono"
              />
            </div>
            <p className="text-xs text-muted mt-1.5">
              Contact support to change your review link
            </p>
          </div>

          <div>
            <label htmlFor="googleUrl" className="block text-sm font-medium text-foreground mb-1.5">
              Google review URL
            </label>
            <input
              id="googleUrl"
              type="url"
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              required
              placeholder="https://search.google.com/local/writereview?placeid=..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
            />
            <p className="text-xs text-muted mt-1.5">
              Your Google Maps review link
            </p>
          </div>

          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-foreground mb-1.5">
              Logo URL <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
            />
          </div>
        </div>

        {error && (
          <div className="bg-danger-light rounded-xl p-3 text-danger text-sm mt-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success-light rounded-xl p-3 text-success text-sm mt-5 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Settings saved successfully
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-accent hover:bg-accent-hover disabled:bg-stone-200 dark:bg-stone-700 disabled:text-muted text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none text-sm"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
