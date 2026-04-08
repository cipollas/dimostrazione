import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE, ADMIN_USERNAME } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { userId, adminUsername, reason } = await req.json()
    if (adminUsername !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    }

    const supabase = getAdmin()
    
    // Get profile for this app
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .eq("app_source", APP_SOURCE)
      .single()
    
    if (!profile) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 })

    // Get pi_user for this app
    const { data: piUser } = await supabase
      .from("pi_users")
      .select("pi_uid")
      .eq("pi_username", profile.display_name)
      .eq("app_source", APP_SOURCE)
      .maybeSingle()
    
    if (!piUser) return NextResponse.json({ error: "Pi user non trovato" }, { status: 404 })

    // Ban user for this specific app
    await supabase.from("banned_users").upsert({
      pi_uid: piUser.pi_uid,
      username: profile.display_name,
      reason: reason || "Violazione regole chat",
      app_source: APP_SOURCE,
    }, { onConflict: "pi_uid" })

    // Delete all messages from banned user for this app
    await supabase
      .from("messages")
      .delete()
      .eq("user_id", userId)
      .eq("app_source", APP_SOURCE)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
