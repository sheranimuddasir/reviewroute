"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? (
        <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )}
    </button>
  );
}

function HeroLogo() {
  return (
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden">
      <img src="/logo.png" alt="ReviewRoute" className="w-full h-full object-cover" />
    </div>
  );
}

const FEATURES = [
  {
    title: "NFC Tap Cards",
    description: "Physical cards customers tap with their phone and instantly taken to your review page. No app needed.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 13.5h4.5v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5c0-.621.504-1.125 1.125-1.125z" />
      </svg>
    ),
    mockup: (
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 flex items-center justify-center">
        <div className="bg-card rounded-xl shadow-lg border border-border p-4 w-full max-w-[200px]">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
            </svg>
          </div>
          <p className="text-xs text-center font-medium text-foreground">Tap to Review</p>
          <p className="text-[10px] text-center text-muted mt-0.5">beanandbrew.com</p>
        </div>
      </div>
    ),
  },
  {
    title: "Smart Review Routing",
    description: "Happy customers are guided to Google Reviews. Unhappy ones are seen first as resolved.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    mockup: (
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6">
        <div className="space-y-2">
          <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">4-5 Stars</p>
              <p className="text-[10px] text-muted">Google Review redirect</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-warning-light rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">1-3 Stars</p>
              <p className="text-[10px] text-muted">Separate Attention is needed</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Real-Time Dashboard",
    description: "Track every review as it comes in. Filter by status, respond to feedback, and monitor your average rating over time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    mockup: (
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wide">Total</p>
            <p className="text-lg font-bold text-foreground">124</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wide">Rating</p>
            <p className="text-lg font-bold text-foreground">4.6 <span className="text-amber-400">&#9733;</span></p>
          </div>
          <div className="bg-card rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wide">New</p>
            <p className="text-lg font-bold text-status-new">8</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wide">Resolved</p>
            <p className="text-lg font-bold text-status-resolved">112</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Multi-Location Support",
    description: "Manage reviews across all your business locations from a single account. Each location gets its own review page and analytics.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    mockup: (
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6">
        <div className="space-y-2">
          {["Bean & Brew Coffee", "Sunrise Dental", "The Golden Fork"].map((name, i) => (
            <div key={name} className="bg-card rounded-lg border border-border p-2.5 flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-success" : i === 1 ? "bg-accent" : "bg-info"}`} />
              <p className="text-xs font-medium text-foreground truncate">{name}</p>
              <p className="text-[10px] text-muted ml-auto shrink-0">4.{5 + i} &#9733;</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const LANDING_NAV = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/logo.png" alt="ReviewRoute" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-base text-foreground hidden sm:block">ReviewRoute</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {LANDING_NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right: Theme + Auth */}
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <HeroLogo />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Turn customer feedback into<br />
            <span className="text-accent">business growth</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            Most businesses lose customers because they never hear the truth.
            ReviewRoute gives you the real voice of your customers, the good and the bad
            so you can fix what matters and let happy customers spread the word.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="bg-accent hover:bg-accent-hover text-white font-semibold py-3.5 px-8 rounded-xl text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Start collecting reviews
            </Link>
            <a
              href="#how-it-works"
              className="bg-card hover:bg-stone-50 dark:hover:bg-stone-800 text-foreground font-semibold py-3.5 px-8 rounded-xl border border-border text-base transition-all shadow-sm hover:shadow-md"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to collect real feedback
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 text-accent">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                <div>{feature.mockup}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-card/50 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Three steps to better reviews
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Set up your page",
                desc: "Create your business profile in under a minute. Get your unique review link.",
              },
              {
                step: "2",
                title: "Hand out NFC cards",
                desc: "Customers tap the card with their phone, no app, no typing URLs.",
              },
              {
                step: "3",
                title: "Watch reviews grow",
                desc: "Happy customers go to Google. Unhappy ones are heard as well. Everyone wins!",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-md">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to hear what your customers really think?
          </h2>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Join hundreds of businesses using ReviewRoute to turn every customer
            interaction into actionable feedback and more Google reviews.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-10 rounded-xl text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Get started here!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden">
              <img src="/logo.png" alt="ReviewRoute" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-foreground">ReviewRoute</span>
          </div>
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} ReviewRoute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
