type CookiePreferencesLinkProps = {
  className?: string
  label?: string
}

/** Opens the Iubenda cookie preferences panel when clicked. */
export default function CookiePreferencesLink({
  className = "text-sm text-zinc-500 transition-colors hover:text-zinc-300",
  label = "Cookie preferences",
}: CookiePreferencesLinkProps) {
  return (
    <a href="#" className={`iubenda-cs-preferences-link ${className}`}>
      {label}
    </a>
  )
}
