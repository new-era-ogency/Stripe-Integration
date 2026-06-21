import UserNav from "@/components/layout/UserNav"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="border-b border-zinc-800/80 bg-[#000000] p-4">
        <UserNav />
      </header>
      {children}
    </>
  )
}
