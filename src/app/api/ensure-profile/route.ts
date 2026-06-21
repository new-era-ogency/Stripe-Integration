import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"

const STARTER_CREDITS = 3

export async function POST() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching user profile:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json({ credits: existing.credits, created: false })
    }

    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({ id: user.id, credits: STARTER_CREDITS })
      .select("credits")
      .single()

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({ credits: created.credits, created: true })
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
