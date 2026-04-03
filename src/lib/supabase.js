import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ❗ DO NOT CRASH APP — just warn
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase ENV missing");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);