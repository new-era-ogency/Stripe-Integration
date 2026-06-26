export default function HeroVideoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_-15%,rgba(139,92,246,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="landing-grain absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
    </div>
  )
}
