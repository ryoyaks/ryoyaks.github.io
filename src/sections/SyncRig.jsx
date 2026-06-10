import VideoCard from "../components/VideoCard";
import SectionHeader from "../components/SectionHeader";

const FEATURES = [
  {
    title: "Drop anything in",
    body: "Photo, video file, or live webcam — same tool, same flow. No special rig, no markers.",
  },
  {
    title: "Editable 3D pose",
    body: "Tweak joints after the solve. Pose-reference for an illustration, or hand it off to your rigging pipeline.",
  },
  {
    title: "Runs locally",
    body: "Your footage never leaves your machine. No cloud uploads, no account required.",
  },
  {
    title: "Blender export",
    body: "Send the pose straight to Blender — keyframes intact, ready to clean up or retarget.",
  },
  {
    title: "Live VMC streaming",
    body: "Broadcast directly to VMC-compatible apps for VTubing, previs, and real-time character work.",
  },
  {
    title: "Multi-character (planned)",
    body: "Track several subjects in one shot for crowd scenes and dialogue sequences.",
    planned: true,
  },
];

const STEPS = [
  { n: "01", title: "Drop", body: "Photo, video file, or webcam input." },
  { n: "02", title: "Solve", body: "SyncRig estimates the 3D pose, frame by frame." },
  { n: "03", title: "Edit & export", body: "Fine-tune, then send to Blender or stream via VMC." },
];

const INTEGRATIONS = [
  { name: "Blender", status: "Available" },
  { name: "VMC protocol", status: "Available" },
  { name: "Unity", status: "Roadmap" },
  { name: "Unreal Engine", status: "Roadmap" },
];

const FAQ = [
  {
    q: "What hardware do I need?",
    a: "A modern Windows or macOS machine. A webcam is optional — needed only for live capture.",
  },
  {
    q: "Is my footage uploaded anywhere?",
    a: "No. SyncRig runs entirely on your device. Nothing leaves your machine.",
  },
  {
    q: "Can I use it commercially?",
    a: "Pricing and licensing are being finalised. Join the waitlist to be notified when commercial terms are ready.",
  },
  {
    q: "Does it track hands and face?",
    a: "Body and face are supported today. Hand tracking is on the near-term roadmap.",
  },
  {
    q: "What 3D software is supported?",
    a: "Blender via direct export today. Unity and Unreal Engine integrations are in progress.",
  },
];

const SyncRig = () => {
  return (
    <section id="syncrig" className="relative md:p-0 px-5 py-20 md:py-32 text-[var(--fg)] border-t border-[var(--border)]">
      <div className="container mx-auto">
        <SectionHeader number="03" eyebrow="SyncRig" headline="Mocap, built for creators" />

        {/* 1. Product Hero */}
        <div className="relative h-[60vh] md:h-[70vh] min-h-[420px] overflow-hidden rounded-md border border-[var(--border)] mb-16 md:mb-24">
          <VideoCard
            poster="/syncrig-poster.webp"
            src="/syncrig-demo.webm"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 text-white">
            <div className="text-[10px] md:text-xs tracking-[0.3em] opacity-80 uppercase">Product</div>
            <h2 className="text-3xl md:text-6xl font-black mt-2 leading-tight max-w-3xl">
              Mocap that lets you keep creating
            </h2>
            <p className="text-sm md:text-lg opacity-90 mt-4 max-w-2xl leading-relaxed">
              Drop in a photo, video, or webcam — get an editable 3D pose. Built for illustrators, animators, and VTubers who don&apos;t want to spend half their day posing reference figures.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <a
                href="#syncrig-waitlist"
                className="bg-white text-black px-5 py-2.5 rounded-md font-semibold text-sm"
              >
                Join the waitlist
              </a>
              <a
                href="#syncrig-demo"
                className="border border-white/40 px-5 py-2.5 rounded-md text-sm"
              >
                Watch the demo
              </a>
            </div>
          </div>
        </div>

        {/* 2. Problem */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">The problem</div>
          <h3 className="text-2xl md:text-4xl font-black mt-3 leading-tight">
            Reference posing eats your time.
          </h3>
          <p className="text-base md:text-lg opacity-75 mt-4 leading-relaxed">
            Hunting for the right angle. Posing wooden mannequins. Bending Blender rigs by hand.
            Every illustration session loses an hour to the same fight — before you make a single mark.
          </p>
        </div>

        {/* 3. How it works */}
        <div className="mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">How it works</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-8 md:mb-10">Three steps from input to export.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="border border-[var(--border)] rounded-md p-6 md:p-7 bg-[var(--bg-elev)]"
              >
                <div className="text-3xl md:text-4xl font-black opacity-30">{s.n}</div>
                <h4 className="text-lg md:text-xl font-bold mt-3">{s.title}</h4>
                <p className="text-sm opacity-70 mt-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Features grid */}
        <div className="mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">Features</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-8 md:mb-10">What&apos;s inside.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`border border-[var(--border)] rounded-md p-5 md:p-6 bg-[var(--bg-elev)] ${
                  f.planned ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <h4 className="text-base md:text-lg font-bold">{f.title}</h4>
                  {f.planned && (
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Planned</span>
                  )}
                </div>
                <p className="text-sm opacity-70 mt-2 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Demo */}
        <div id="syncrig-demo" className="mb-16 md:mb-24 scroll-mt-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">Demo</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-8">See it work.</h3>
          <div className="relative aspect-video rounded-md overflow-hidden border border-[var(--border)] bg-black">
            <VideoCard
              poster="/syncrig-poster.webp"
              src="/syncrig-demo.webm"
              className="absolute inset-0"
            />
          </div>
          <p className="text-sm opacity-60 mt-3">Hover (desktop) or scroll the demo into view (mobile) to play.</p>
        </div>

        {/* 6. Integrations */}
        <div className="mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">Integrations</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-8">Where SyncRig fits.</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {INTEGRATIONS.map((i) => (
              <div
                key={i.name}
                className={`border border-[var(--border)] rounded-md p-4 md:p-5 ${
                  i.status === "Roadmap" ? "opacity-60" : ""
                }`}
              >
                <div className="text-sm md:text-base font-bold">{i.name}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase mt-1 opacity-60">
                  {i.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Pricing placeholder */}
        <div className="mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">Pricing</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-3">Coming soon.</h3>
          <p className="text-base opacity-70 max-w-2xl leading-relaxed">
            We&apos;re finalising the right model for SyncRig — somewhere between a one-time license and a creator-friendly subscription.
            Drop your email below and we&apos;ll write to you the day it&apos;s ready.
          </p>
        </div>

        {/* 8. FAQ */}
        <div className="mb-16 md:mb-24">
          <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">FAQ</div>
          <h3 className="text-2xl md:text-3xl font-black mt-3 mb-8">Common questions.</h3>
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4 md:py-5">
                <summary className="cursor-pointer list-none flex justify-between items-center text-base md:text-lg font-semibold">
                  {item.q}
                  <span className="text-xl opacity-50 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm md:text-base opacity-70 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* 9. Waitlist CTA */}
        <div
          id="syncrig-waitlist"
          className="scroll-mt-24 rounded-md bg-[var(--fg)] text-[var(--bg)] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="max-w-md">
            <div className="text-[10px] tracking-[0.3em] uppercase opacity-70">Waitlist</div>
            <h3 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
              Be first to know when SyncRig launches.
            </h3>
            <p className="text-sm md:text-base opacity-75 mt-2">
              No spam — one email when it&apos;s ready, plus an early-access window for waitlist members.
            </p>
          </div>
          <a
            href="mailto:ryoyaillust892763@gmail.com?subject=SyncRig%20waitlist"
            className="bg-[var(--bg)] text-[var(--fg)] px-6 py-3 rounded-md font-semibold text-sm whitespace-nowrap"
          >
            Notify me →
          </a>
        </div>
      </div>
    </section>
  );
};

export default SyncRig;
