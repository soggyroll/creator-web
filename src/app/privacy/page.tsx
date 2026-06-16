/** @format */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Soggy Roll collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Soggy Roll",
    description: "How Soggy Roll collects, uses, and protects your data.",
    url: "/privacy",
  },
};

const SECTIONS = [
  {
    num: "01",
    title: "What we collect",
    body: [
      "Account information — your name and email address, handled by Clerk (our authentication provider).",
      "Generation inputs — any workflow files and assets you upload to run a generation. These exist solely to execute your generation. We do not retain them beyond what is necessary to do so.",
      "Generation outputs — the files we produce for you. These are stored for 7 days after completion, then permanently deleted.",
      "Payment information — processed entirely by Polar. We never see or store your card details.",
      "Usage data — anonymous, aggregated analytics collected via Vercel Analytics and Speed Insights. No personal identifiers are attached.",
    ],
  },
  {
    num: "02",
    title: "What we don't do with your data",
    body: [
      "We do not use your inputs, workflows, or outputs to train AI models — ever.",
      "We do not sell your data to third parties.",
      "We do not use your data for advertising.",
    ],
  },
  {
    num: "03",
    title: "Who we share data with",
    body: [
      "Clerk — authentication and account management.",
      "Polar — payment processing. Polar handles all billing data under their own privacy policy.",
      "GPU compute providers — your workflow and input files are transmitted to third-party GPU infrastructure to execute your generation. All providers we use are GDPR-compliant.",
      "Vercel — hosting and anonymous usage analytics.",
      "We do not share personally identifiable information with any other parties.",
    ],
  },
  {
    num: "04",
    title: "How long we keep it",
    body: [
      "Generation outputs are available for 7 days from completion, then permanently and automatically deleted.",
      "Account data is retained while your account is active.",
      "When you delete your account, all data associated with it is deleted — generation history, outputs, inputs, and account information.",
    ],
  },
  {
    num: "05",
    title: "Your rights",
    body: [
      "You can request access to, correction of, or deletion of your personal data at any time by contacting us.",
      "You can delete your account at any time. Account deletion triggers full data deletion.",
      "If you are located in the European Economic Area, you have additional rights under GDPR. All GPU infrastructure providers we use are GDPR-compliant.",
    ],
  },
  {
    num: "06",
    title: "Cookies and tracking",
    body: [
      "We use cookies required for authentication (Clerk) and session management. We do not use tracking cookies for advertising.",
      "Vercel Analytics and Speed Insights collect anonymous, aggregated performance data with no personal identifiers.",
    ],
  },
  {
    num: "07",
    title: "Changes to this policy",
    body: [
      "If we make any changes to this Privacy Policy, we will email you at least 7 days before those changes take effect.",
      "Continued use of the platform after changes take effect constitutes acceptance of the updated policy.",
    ],
  },
  {
    num: "08",
    title: "Contact",
    body: [
      "For privacy-related questions or data requests, contact us at support@soggyroll.art or through our support portal at support.soggyroll.art.",
      "For anything else, reach us at hi@soggyroll.art. We respond within 12 hours.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/icon.png"
              alt=""
              width={28}
              height={28}
              className="rounded"
            />
            <Image
              src="/soggyroll.png"
              alt="Soggy Roll"
              width={120}
              height={33}
              className="h-6 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in?redirect_url=/discover">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up?redirect_url=/discover">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="font-display text-5xl uppercase tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: June 16, 2026
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Soggy Roll is a platform for running ComfyUI workflow generations on
            GPU infrastructure. This policy explains what data we collect, how
            we use it, and what rights you have over it. We&apos;ve kept it
            short and in plain language.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-14">
          {SECTIONS.map((section) => (
            <div key={section.num} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl leading-none text-primary/40 tabular-nums">
                  {section.num}
                </span>
                <h2 className="text-lg font-semibold tracking-tight">
                  {section.title}
                </h2>
              </div>
              <ul className="flex flex-col gap-3 pl-1">
                {section.body.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/40" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-border bg-muted/30 px-6 py-6">
          <p className="text-sm font-semibold text-foreground">Questions or requests?</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We actively respond to every message. Reach us at any of the addresses below — we&apos;ll get back to you within 12 hours.
          </p>
          <div className="mt-4 flex flex-col gap-1.5 text-sm">
            <a
              href="mailto:support@soggyroll.art"
              className="text-foreground underline-offset-4 hover:underline"
            >
              support@soggyroll.art
            </a>
            <a
              href="mailto:hi@soggyroll.art"
              className="text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
            >
              hi@soggyroll.art
            </a>
            <a
              href="https://support.soggyroll.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
            >
              support.soggyroll.art ↗
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background py-8 mt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <Image
            src="/soggyroll.png"
            alt="Soggy Roll"
            width={80}
            height={22}
            className="h-4 w-auto"
          />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
