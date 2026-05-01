import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

const FULL_DESCRIPTION = `Join us for the exclusive private screening...`;

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPoster, setNewPoster] = useState(null);

  // 🔥 BANNER STATE
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createPoster, setCreatePoster] = useState(null);

  useEffect(() => {
    loadEvents();
    loadBanner(); // ✅ FIXED (inside useEffect)
  }, []);

  // =======================
  // 🔥 BANNER FUNCTIONS
  // =======================

  async function loadBanner() {
    const { data } = await supabase
      .from("support_banner")
      .select("*")
      .limit(1)
      .single();

    if (data) setBanner(data);
  }

  async function uploadPoster(file) {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    await supabase.storage.from("posters").upload(fileName, file);

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function saveBanner() {
    let imageUrl = banner?.image_url || "";

    if (bannerFile) {
      imageUrl = await uploadPoster(bannerFile);
    }

    await supabase
      .from("support_banner")
      .update({
        title: banner.title,
        subtitle: banner.subtitle,
        image_url: imageUrl,
      })
      .eq("id", banner.id);

    alert("Banner saved");
    setBannerFile(null);
    loadBanner();
  }

  async function goLiveBanner() {
    await supabase
      .from("support_banner")
      .update({ is_live: true })
      .eq("id", banner.id);

    alert("Banner is LIVE ✅");
    loadBanner();
  }

  async function deleteBanner() {
    if (!window.confirm("Delete banner?")) return;

    await supabase
      .from("support_banner")
      .delete()
      .eq("id", banner.id);

    setBanner(null);
    alert("Banner deleted");
  }

  // =======================
  // EVENTS (UNCHANGED)
  // =======================

  async function loadEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: false });

    setEvents(data || []);
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1>Events</h1>

        {/* ======================= */}
        {/* 🔥 SUPPORT BANNER ADMIN */}
        {/* ======================= */}

        <div style={{ marginBottom: "40px", width: "600px" }}>
          <h2>Support Banner</h2>

          {banner ? (
            <>
              <input
                value={banner.title || ""}
                onChange={(e) =>
                  setBanner({ ...banner, title: e.target.value })
                }
                placeholder="Title"
                style={styles.input}
              />

              <textarea
                value={banner.subtitle || ""}
                onChange={(e) =>
                  setBanner({ ...banner, subtitle: e.target.value })
                }
                placeholder="Subtitle"
                style={styles.textarea}
              />

              <input
                type="file"
                onChange={(e) => setBannerFile(e.target.files[0])}
                style={styles.input}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={saveBanner} style={styles.saveButton}>
                  Save
                </button>

                <button onClick={goLiveBanner} style={styles.liveButton}>
                  Go Live
                </button>

                <button onClick={deleteBanner} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={async () => {
                await supabase.from("support_banner").insert([
                  {
                    title: "",
                    subtitle: "",
                    image_url: "",
                    is_live: false,
                  },
                ]);
                loadBanner();
              }}
              style={styles.addButton}
            >
              + Add Banner
            </button>
          )}
        </div>

        {/* EVENTS BELOW (UNCHANGED) */}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#000", minHeight: "100vh" },
  container: { padding: "40px", color: "white" },

  input: { padding: "10px", width: "100%" },
  textarea: { padding: "10px", width: "100%", height: "120px" },

  addButton: { background: "#e50914", color: "white", padding: "10px" },
  saveButton: { background: "#16a34a", color: "white", padding: "10px" },
  liveButton: { background: "#e50914", color: "white", padding: "10px" },
  deleteButton: { background: "red", color: "white", padding: "10px" },
};

export default ManageEvents;