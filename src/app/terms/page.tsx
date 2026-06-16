/** @format */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Soggy Roll",
  description: "The rules for using Soggy Roll.",
};

const SECTIONS = [
  {
    num: "01",
    title: "What Soggy Roll is",
    body: [
      "Soggy Roll is a platform for running ComfyUI workflow generations on GPU infrastructure. You submit a generation, we run it, you download the output.",
      "Access is credit-based. There are no subscriptions. You pay for what you use.",
    ],
  },
  {
    num: "02",
    title: "Credits",
    body: [
      "Credits are purchased upfront and spent when you submit generations.",
      "Credits are non-refundable once purchased — with one exception: if a generation fails due to an error on our side, the credits spent on that generation are returned to your account.",
      "We do not guarantee generation execution time. Time varies depending on infrastructure availability, the complexity of your workflow, and your inputs.",
      "Credit pricing may change. We will email you at least 7 days before any pricing change takes effect.",
    ],
  },
  {
    num: "03",
    title: "Your content",
    body: [
      "You own everything you upload and everything we generate for you. We claim no rights over your workflows, inputs, or outputs.",
      "You are responsible for the content you upload and the generations you produce. You represent that you have the rights to any files you upload.",
      "Your inputs, workflows, and outputs are never used to train AI models.",
    ],
  },
  {
    num: "04",
    title: "Generation output retention",
    body: [
      "Generation outputs are available for 7 days after completion, then permanently deleted.",
      "Soggy Roll is not a storage service. It is your responsibility to download your outputs before the retention window expires.",
      "Deleting your account also permanently deletes all associated outputs, regardless of the 7-day window.",
    ],
  },
  {
    num: "05",
    title: "Prohibited content",
    warning: true,
    body: [
      "You may not generate, upload, or attempt to generate child sexual abuse material (CSAM) or any sexual content involving minors. Accounts found in violation of this rule are immediately and permanently terminated. No refund of any remaining credit balance will be issued.",
      "You may not use Soggy Roll to produce content that is illegal under the laws of your jurisdiction.",
      "You may not attempt to interfere with, disrupt, or gain unauthorized access to our systems, infrastructure, or the GPU providers we work with.",
    ],
  },
  {
    num: "06",
    title: "Service availability",
    body: [
      "Soggy Roll operates on a best-effort basis. We do not guarantee uptime, generation completion times, or output quality.",
      "Generation time varies and is not guaranteed. Do not rely on Soggy Roll for time-sensitive use cases without accounting for variability.",
      "In the event of platform errors that prevent your generation from completing, credits will be returned to your account.",
    ],
  },
  {
    num: "07",
    title: "Account termination",
    body: [
      "You can delete your account at any time. All data associated with your account is permanently deleted.",
      "We reserve the right to terminate accounts that violate these Terms of Service, with immediate effect and without prior notice.",
      "Termination for violations of the Prohibited Content section (Section 05) is permanent and carries no refund of remaining credits.",
    ],
  },
  {
    num: "08",
    title: "Limitation of liability",
    body: [
      "Soggy Roll is provided as-is. We make no warranties, express or implied, about the platform's fitness for any particular purpose.",
      "We are not liable for the outputs generated through the platform, or for any indirect, incidental, or consequential damages arising from its use.",
      "Our total liability for any claim arising out of your use of Soggy Roll is limited to the credits remaining in your account at the time of the claim.",
    ],
  },
  {
    num: "09",
    title: "Changes to these terms",
    body: [
      "If we make any changes to these Terms of Service, we will email you at least 7 days before those changes take effect.",
      "This applies to all material changes — including pricing, credit policies, prohibited content rules, and data handling.",
      "Continued use of the platform after changes take effect constitutes acceptance of the updated terms.",
    ],
  },
  {
    num: "10",
    title: "Governing law",
    body: [
      "These Terms of Service are governed by the laws of the jurisdiction in which Soggy Roll is incorporated, without regard to its conflict of law provisions.",
      "Any disputes arising from these terms or your use of the platform will be resolved in the courts of that jurisdiction.",
    ],
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: June 16, 2026
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            By using Soggy Roll, you agree to these terms. We&apos;ve written
            them to be readable, not to obscure what they mean. If something is
            unclear, reach out.
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

              {section.warning && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Zero tolerance
                  </p>
                </div>
              )}

              <ul className="flex flex-col gap-3 pl-1">
                {section.body.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className={[
                        "mt-1.5 size-1 shrink-0 rounded-full",
                        section.warning ? "bg-accent/60" : "bg-primary/40",
                      ].join(" ")}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <p className="text-sm text-muted-foreground">
            Questions about these terms?{" "}
            <a
              href="mailto:legal@soggyroll.com"
              className="text-foreground underline-offset-4 hover:underline"
            >
              legal@soggyroll.com
            </a>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-border/40 bg-background py-8">
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
