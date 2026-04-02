import { supabase } from "../lib/supabaseClient";

// ✅ GET DATA
export const getStudioData = async () => {
  const { data, error } = await supabase
    .from("studio_data")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    console.log("Error loading studio data", error);
    return null;
  }

  return data.data; // 👈 important (json field)
};

// ✅ SAVE DATA
export const saveStudioData = async (newData) => {
  const { data: existing } = await supabase
    .from("studio_data")
    .select("id")
    .limit(1)
    .single();

  if (!existing) return;

  await supabase
    .from("studio_data")
    .update({ data: newData })
    .eq("id", existing.id);
};