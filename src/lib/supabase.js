import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qrujwmcbobhthwzqmmjp.supabase.co";
const supabaseAnonKey = "sb_publishable_R_-LtJr1moFsplC4CHBBwg_oYLPq-XK";

/* 🔥 SINGLETON PATTERN (VERY IMPORTANT) */
let supabase;

if (!globalThis.__supabase) {
  globalThis.__supabase = createClient(supabaseUrl, supabaseAnonKey);
}

supabase = globalThis.__supabase;

export { supabase };