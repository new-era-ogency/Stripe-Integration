import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"

export async function POST() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { supabase } = auth

  try {
    const { data, error } = await supabase.rpc("deduct_credit")

    if (error) {
      console.error("Supabase RPC error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const result = data[0]

    if (!result.success) {
      const status =
        result.message === "Unauthorized."
          ? 401
          : result.message === "Insufficient credits."
            ? 402
            : 400
      return NextResponse.json({ error: result.message }, { status })
    }

    return NextResponse.json({ newCredits: result.new_credits })
  } catch (error) {
    console.error("Error deducting credit:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
