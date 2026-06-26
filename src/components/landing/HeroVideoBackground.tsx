export default function HeroVideoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_65%_-10%,rgba(139,92,246,0.14),transparent_60%)]" />
      <div className="landing-grain absolute inset-0 opacity-25" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
    </div>
  )
}
