import { NextResponse } from "next/server"
import { isErrorResponse, requireAuthenticatedUser } from "@/lib/api/auth"

const STARTER_CREDITS = 3

export async function GET() {
  const auth = await requireAuthenticatedUser()
  if (isErrorResponse(auth)) {
    return auth
  }

  const { user, supabase } = auth

  try {
    let { data: profile, error: profileError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching user credits:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      )
    }

    if (!profile) {
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

      profile = created
    }

    const { data: history, error: historyError } = await supabase
      .from("generations")
      .select(
        "id, video_url, created_at, output_x, output_linkedin, output_telegram"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (historyError) {
      console.error("Error fetching generation history:", historyError)
      return NextResponse.json(
        { error: "Failed to fetch generation history" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits: profile.credits,
      history: history ?? [],
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
