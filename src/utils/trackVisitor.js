import { supabase } from "../lib/supabase";

export async function trackVisitor() {
  try {
    const isAdminPage = window.location.pathname.startsWith("/admin");
    if (isAdminPage) return;

    let visitorId = localStorage.getItem("maicinema_visitor_id");

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("maicinema_visitor_id", visitorId);
    }

    const { error } = await supabase
      .from("visitors")
      .upsert([{ visitor_id: visitorId }], {
        onConflict: "visitor_id",
      });

    if (error) {
      console.log("Visitor tracking error:", error);
    }
  } catch (err) {
    console.log("Visitor tracking crash:", err);
  }
}