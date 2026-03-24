// app/api/chat/route.ts
import { createClient } from "@supabase/supabase-js"

// Inisialisasi client dengan SERVICE ROLE key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // <--- Kunci sakti bypass RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  // ... logika rate limit ...

  // Karena pakai supabaseAdmin, ini akan BERHASIL walaupun RLS aktif & tanpa policy public
  const { data, error } = await supabaseAdmin
    .from("chat_logs")
    .insert([{ session_id: sessionId, role: "user", content: message }])

  // ...
}
