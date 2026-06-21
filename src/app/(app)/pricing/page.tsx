import { Suspense } from "react"
import PricingPlans from "@/components/pricing/PricingPlans"

export const dynamic = "force-dynamic"

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-slate-500">
          Loading pricing…
        </div>
      }
    >
      <PricingPlans />
    </Suspense>
  )
}
