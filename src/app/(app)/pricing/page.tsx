"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const plans = [
  {
    name: "Starter",
    price: "$9",
    credits: "20 credits",
    description: "Perfect for getting started with PulseFlow.",
    features: [
      "20 content generations",
      "Twitter/X, LinkedIn & Telegram outputs",
      "YouTube transcript extraction",
      "Copy to clipboard",
    ],
    buttonLabel: "Buy Credits",
    action: "starter",
  },
  {
    name: "Pro",
    price: "$29",
    credits: "100 credits",
    description: "For creators who publish consistently.",
    features: [
      "100 content generations",
      "Advanced AI models via OpenRouter",
      "Priority generation queue",
      "Full generation history",
      "Email support",
    ],
    buttonLabel: "Upgrade",
    action: "pro",
    highlighted: true,
  },
]

export default function PricingPage() {
  const handleCheckout = (plan: string) => {
    console.log(`Initiating checkout for plan: ${plan}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Upgrade Your Plan</h1>
        <p className="mb-12 text-lg text-gray-300">
          Unlock more credits and keep turning YouTube videos into viral-ready
          content across every platform.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col border-gray-700 bg-gray-800 ${
                plan.highlighted ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col">
                <div className="mb-6 text-center">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">/mo</span>
                  <p className="mt-2 text-sm text-blue-400">{plan.credits}</p>
                </div>
                <ul className="mb-8 flex-grow space-y-3 text-left text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => handleCheckout(plan.action)}
                >
                  {plan.buttonLabel}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
