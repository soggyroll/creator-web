import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { BrandRail } from "@/components/studio/brand-rail";
import { MediaReel } from "@/components/studio/media-reel";

const PROCESS = [
  { number: "01", title: "Find a starting point.", description: "Choose a ComfyUI workflow that fits the idea you have in mind." },
  { number: "02", title: "Make it your own.", description: "Add your inputs and pick a priority. We handle the GPUs and execution." },
  { number: "03", title: "Take it from here.", description: "Download your output when it's ready. Then make the next thing." },
];

const PRIORITIES = [
  { name: "Patient", time: "Up to 6 hours", description: "For batches and ideas that can wait." },
  { name: "Standard", time: "Up to 3 hours", description: "A balance of speed and cost." },
  { name: "Urgent", time: "Under 15 minutes", description: "For work with a little less time to spare." },
];

export default function LandingPage() {
  return (
    <div className="studio-frame">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <BrandRail />
      <div className="studio-body landing-body">
        <header className="landing-header">
          <p>ComfyUI, without the setup.</p>
          <Link href="/sign-in?redirect_url=/discover" className="studio-text-link">Sign in <ArrowUpRight aria-hidden="true" /></Link>
        </header>
        <main id="main-content">
          <section className="landing-intro" aria-labelledby="landing-title">
            <h1 id="landing-title" className="landing-title"><span>Make room.</span><span>For ideas.</span></h1>
            <div className="landing-invitation">
              <p><strong>Your workflows. Our GPUs.</strong><br />We handle the compute so you can spend more time creating.</p>
              <Link href="/discover" className="studio-action">
                <span>Find your<br />starting point</span><ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </section>
          <MediaReel />
          <div className="landing-reassurance"><p>Pay with credits. No subscription. No GPU setup.</p><a href="#how-it-works" className="studio-text-link">How it works <ArrowDownRight aria-hidden="true" /></a></div>

          <section className="landing-section" id="how-it-works" aria-labelledby="process-title">
            <p className="studio-eyebrow">From an idea to an output</p>
            <h2 className="landing-section-title" id="process-title">Your part is creating.<br /><span>We&apos;ll handle the rest.</span></h2>
            <div className="landing-process">
              {PROCESS.map((step) => <article key={step.number}><span className="studio-eyebrow">{step.number} / THE PROCESS</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
            </div>
          </section>

          <section className="landing-section landing-priorities" aria-labelledby="priority-title">
            <div><p className="studio-eyebrow">A pace for every project</p><h2 id="priority-title" className="landing-section-title">In your<br /><span>own time.</span></h2><p className="studio-description">Choose a priority when you run a workflow. Spend credits on the work you want to make.</p></div>
            <dl className="landing-priority-list">{PRIORITIES.map((priority) => <div key={priority.name}><dt>{priority.name}</dt><dd><span>{priority.time}</span><p>{priority.description}</p></dd></div>)}</dl>
          </section>

          <section className="landing-section landing-final" aria-labelledby="final-title">
            <div><p className="studio-eyebrow">Less in the way</p><h2 className="landing-section-title" id="final-title">What&apos;s your<br /><span>next idea?</span></h2></div>
            <Link href="/sign-up?redirect_url=/discover" className="studio-action"><span>Make room<br />for it.</span><ArrowUpRight aria-hidden="true" /></Link>
          </section>
        </main>
        <footer className="landing-footer"><Link href="/" className="studio-footer-wordmark">soggyroll.</Link><span>More room for making.</span><nav aria-label="Legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></footer>
      </div>
    </div>
  );
}
