/** @format */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRightIcon, ZapIcon, ClockIcon, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HOW_STEPS = [
  {
    num: "01",
    title: "Submit your job",
    desc: "Upload your ComfyUI workflow and any files it needs. That's the hard part — and it's not hard.",
  },
  {
    num: "02",
    title: "Pick your speed",
    desc: "Urgent, Standard, or Patient. We queue it and allocate a GPU. You don't touch any of that.",
  },
  {
    num: "03",
    title: "It runs",
    desc: "Your workflow executes in a suitable environment.",
  },
  {
    num: "04",
    title: "Download your output",
    desc: "We notify you when it's done. Files stay available for 7 days.",
  },
];

const PRICING = [
  {
    key: "patient",
    label: "Patient",
    time: "Up to 6 hours",
    desc: "Scheduled during low-demand windows. Best for batches you're not in a rush for.",
    Icon: TimerIcon,
    featured: false,
    hot: false,
  },
  {
    key: "standard",
    label: "Standard",
    time: "Up to 3 hours",
    desc: "Balanced speed and cost. Default for most users, most of the time.",
    Icon: ClockIcon,
    featured: true,
    hot: false,
  },
  {
    key: "urgent",
    label: "Urgent",
    time: "Under 15 min",
    desc: "Dispatched immediately to the best available hardware. Pay more, wait less.",
    Icon: ZapIcon,
    featured: false,
    hot: true,
  },
];

const COMPARISONS = [
  {
    label: "Consumer AI apps",
    desc: "Locked into their models, their interface, their limits. You can't bring your own workflow.",
  },
  {
    label: "Cloud GPU providers",
    desc: "Renting by the hour whether you use it or not. One idle afternoon and you've paid for nothing.",
  },
  {
    label: "Running it yourself",
    desc: "Hardware is expensive. Setup takes time. Maintenance never stops. Good luck.",
  },
];

const WHO = [
  {
    title: "Creators",
    desc: "You want to run a workflow. You don't want to buy a $3,000 GPU.",
  },
  {
    title: "Small teams",
    desc: "Need generation occasionally — not enough to justify a monthly infrastructure commitment.",
  },
  {
    title: "Anyone",
    desc: "Who's looked at a GPU cloud bill and thought: there has to be a better way.",
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero elements stagger in on load
      gsap.fromTo(
        ".gs-hero",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.1,
        },
      );

      // How it works steps stagger on scroll
      gsap.fromTo(
        ".gs-step",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gs-steps",
            start: "top 80%",
          },
        },
      );

      // Pricing cards pop in on scroll
      gsap.fromTo(
        ".gs-price",
        { y: 28, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.09,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".gs-pricing",
            start: "top 80%",
          },
        },
      );

      // Generic fade-up for any .gs-fade element
      gsap.utils.toArray<Element>(".gs-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded"
            />
          </div>
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

      <main className="flex flex-1 flex-col">
        {/* HERO */}
        <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[140px]" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/[0.06] blur-[100px]" />
          </div>
          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Big display text */}
          <h1 className="relative z-10 select-none font-display uppercase leading-[0.88] tracking-tight">
            <span className="gs-hero block text-[clamp(3.5rem,11vw,9rem)] text-foreground">
              Just submit.
            </span>
            <span className="gs-hero block text-[clamp(3.5rem,11vw,9rem)] text-primary">
              We run it.
            </span>
            <span className="gs-hero block text-[clamp(3.5rem,11vw,9rem)] text-foreground">
              You get the output.
            </span>
          </h1>

          <p className="gs-hero relative z-10 mx-auto mt-8 max-w-lg text-balance text-base leading-relaxed text-muted-foreground">
            Pick ComfyUI workflow. No GPU. No config. No subscription. Buy
            credits, run jobs, download results.
          </p>

          <div className="gs-hero relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2 font-semibold" asChild>
              <Link href="/sign-up?redirect_url=/discover">
                Start generating
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in?redirect_url=/discover">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full bg-card py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="gs-fade mb-16 text-center">
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase tracking-tight">
                How it works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Four steps. None of them are &ldquo;configure your GPU.&rdquo;
              </p>
            </div>
            <div className="gs-steps grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_STEPS.map((step) => (
                <div key={step.num} className="gs-step flex flex-col gap-3">
                  <span className="font-display text-6xl leading-none text-primary/30">
                    {step.num}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="w-full bg-background py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="gs-fade mb-16 text-center">
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase tracking-tight">
                Pick your speed
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Credits only. Nothing renews. Nothing auto-charges.
              </p>
            </div>
            <div className="gs-pricing grid gap-5 sm:grid-cols-3">
              {PRICING.map((tier) => (
                <div
                  key={tier.key}
                  className={[
                    "gs-price flex flex-col gap-4 rounded-xl border p-7 transition-colors",
                    tier.featured
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card",
                  ].join(" ")}
                >
                  {tier.featured && (
                    <Badge className="w-fit bg-primary text-xs text-primary-foreground">
                      Most popular
                    </Badge>
                  )}
                  <div
                    className={[
                      "flex size-10 items-center justify-center rounded-lg",
                      tier.featured
                        ? "bg-primary/15 text-primary"
                        : tier.hot
                          ? "bg-accent/15 text-accent"
                          : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    <tier.Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{tier.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-primary">
                      {tier.time}
                    </p>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY NOT OTHER THINGS */}
        <section className="w-full bg-card py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="gs-fade mb-4 text-center">
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase tracking-tight">
                Why US?
              </h2>
            </div>
            <p className="gs-fade mb-14 text-center text-sm text-muted-foreground">
              Soggy Roll runs your job, charges you for exactly that job, and
              gets out of the way.
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              {COMPARISONS.map((item) => (
                <div
                  key={item.label}
                  className="gs-fade flex flex-col gap-3 rounded-xl border border-border bg-background p-6"
                >
                  <span className="text-sm font-semibold text-accent">
                    {item.label}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="w-full bg-background py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="gs-fade mb-14 text-center">
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase tracking-tight">
                Who it&apos;s for
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {WHO.map((w) => (
                <div
                  key={w.title}
                  className="gs-fade flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="text-lg font-semibold">{w.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="w-full bg-card py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="gs-fade relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center">
              {/* Inner top glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,oklch(1_0_0/0.1)_0%,transparent_65%)]" />
              <div className="relative z-10 flex flex-col items-center gap-5">
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none text-primary-foreground">
                  <Image
                    src="/soggyroll.png"
                    alt="Soggy Roll"
                    width={861 * 2}
                    height={24 * 2}
                    className="inline h-24 w-auto"
                  />
                </h2>
                <p className="max-w-md text-sm text-primary-foreground/70">
                  Create an account, buy some credits, and submit your first
                  workflow in under two minutes.
                </p>
                <Button
                  size="lg"
                  className="mt-1 bg-primary-foreground font-semibold text-primary"
                  asChild
                >
                  <Link href="/sign-up?redirect_url=/discover">
                    Get started free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="Soggy Roll" width={20} height={20} />
          </div>
          <p className="text-xs text-muted-foreground">
            ComfyUI workflows on demand.
          </p>
        </div>
      </footer>
    </div>
  );
}
