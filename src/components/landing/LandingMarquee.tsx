const items = [
  "YouTube → X thread",
  "YouTube → LinkedIn",
  "YouTube → Telegram",
  "~47 seconds",
  "3 outputs per run",
  "7-day free trial",
  "Stripe billing",
]

export default function LandingMarquee() {
  const track = [...items, ...items]

  return (
    <div className="landing-marquee border-y border-zinc-800/80 bg-zinc-950/50 py-3">
      <div className="landing-marquee-track flex w-max items-center gap-10">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-10 text-sm text-zinc-500"
          >
            <span>{item}</span>
            <span className="size-1 rounded-full bg-violet-500/60" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}
