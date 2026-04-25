import { useEffect, useState } from "react";
import { PLATFORM } from "../config/platform";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function AdminDashboard() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [filmCount, setFilmCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(false);
  const [newBannerFile, setNewBannerFile] = useState(null);

  const [logo, setLogo] = useState(null);

  const [showFooterEditor, setShowFooterEditor] = useState(false);
  const [showEmails, setShowEmails] = useState(false);

  const [youtube, setYoutube] = useState(PLATFORM.youtube);
  const [facebook, setFacebook] = useState(PLATFORM.facebook);
  const [instagram, setInstagram] = useState(PLATFORM.instagram);
  const [email, setEmail] = useState(PLATFORM.email);
  const [whatsappQR, setWhatsappQR] = useState(null);

  const newsletterEmails = [
    "johnfilmlover@gmail.com",
    "sarahproducer@gmail.com",
    "cinemafan88@yahoo.com",
    "director.james@outlook.com",
    "shortfilmsubmissions@gmail.com"
  ];

  useEffect(() => {
    loadDashboardStats();
    loadBanners();
  }, []);

  async function loadDashboardStats() {
    try {
      const [visitorsRes, filmsRes, eventsRes] = await Promise.all([
        supabase.from("visitors").select("*", { count: "exact", head: true }),
        supabase.from("films").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true })
      ]);

      setVisitorCount(visitorsRes.count || 0);
      setFilmCount(filmsRes.count || 0);
      setEventCount(eventsRes.count || 0);
    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  }

  async function loadBanners() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Load banners error:", error);
      return;
    }

    setBanners(data || []);
  }

  async function deleteBanner(id) {
    const confirmed = window.confirm("Delete this banner file?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete banner");
      return;
    }

    await loadBanners();
  }

  async function uploadBanner() {
    if (!newBannerFile) {
      alert("Please choose a file first");
      return;
    }

    const fileName = `${Date.now()}-${newBannerFile.name.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("posters")
      .upload(fileName, newBannerFile, { upsert: true });

    if (uploadError) {
      console.log("Banner upload error:", uploadError);
      alert("Upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("banners").insert([
      {
        file_url: data.publicUrl,
        file_type: newBannerFile.type,
        file_name: newBannerFile.name
      }
    ]);

    if (insertError) {
      console.log("Banner save error:", insertError);
      alert("Failed to save banner");
      return;
    }

    setNewBannerFile(null);
    await loadBanners();
    alert("Banner uploaded successfully");
  }

  function handleSave(item) {
    alert(item + " updated");
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1 style={styles.title}>MaiCinema Admin Dashboard</h1>
        <p style={styles.subtitle}>Platform overview and public page controls</p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2>Total Visitors</h2>
            <p style={styles.statValue}>{visitorCount}</p>
          </div>

          <div style={styles.statCard}>
            <h2>Films</h2>
            <p style={styles.statValue}>{filmCount}</p>
          </div>

          <div style={styles.statCard}>
            <h2>Events</h2>
            <p style={styles.statValue}>{eventCount}</p>
          </div>
        </div>

        <div style={styles.grid}>
  <div style={styles.card}>
    <h2>Home Banner</h2>

  {!editingBanner ? (
    <button
      type="button"
      style={styles.button}
      onClick={() => setEditingBanner(true)}
    >
      Edit
    </button>
  ) : (
    <>
      {/* EXISTING BANNERS */}
      <div style={{ marginBottom: "20px" }}>
        {banners.length === 0 ? (
          <p style={styles.desc}>No banner files uploaded yet.</p>
        ) : (
          banners.map((item, index) => (
            <div key={item.id} style={styles.bannerItem}>
              <p style={styles.preview}>
                Banner {index + 1} —{" "}
                {item.file_name || item.file_url.split("/").pop()}
              </p>

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => deleteBanner(item.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* UPLOAD NEW */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="file"
          accept="image/*,video/mp4"
          onChange={(e) => setNewBannerFile(e.target.files[0])}
        />

        {newBannerFile && (
          <p style={styles.preview}>{newBannerFile.name}</p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.buttonRow}>
        <button
          type="button"
          style={styles.button}
          onClick={uploadBanner}
        >
          Go Live
        </button>

        <button
          type="button"
          style={styles.close}
          onClick={() => setEditingBanner(false)}
        >
          Close
        </button>
      </div>
    </>
  )}
</div>

          <div style={styles.card}>
            <h2>Platform Logo</h2>
            <p style={styles.desc}>
              Replace existing logo and switch live branding
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
            />

            {logo && <p style={styles.preview}>{logo.name}</p>}

            <div style={styles.buttonRow}>
              <button type="button" style={styles.button}>
                Edit
              </button>

              <button
                type="button"
                style={styles.button}
                onClick={() => handleSave("Logo")}
              >
                Go Live
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2>Footer Settings</h2>
            <p style={styles.desc}>
              Update footer social links, contact details, and WhatsApp QR
            </p>

            <button
              type="button"
              style={styles.button}
              onClick={() => setShowFooterEditor(true)}
            >
              Edit Footer
            </button>
          </div>

          <div style={styles.card}>
            <h2>Newsletter Subscribers</h2>
            <p style={styles.desc}>
              View saved emails and prepare future bulk email campaigns
            </p>

            <button
              type="button"
              style={styles.button}
              onClick={() => setShowEmails(true)}
            >
              View Emails
            </button>
          </div>
        </div>

        {showFooterEditor && (
          <div style={styles.modal}>
            <h2>Edit Footer</h2>

            <label>YouTube Link</label>
            <input
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              style={styles.input}
            />

            <label>Facebook Link</label>
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              style={styles.input}
            />

            <label>Instagram Link</label>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={styles.input}
            />

            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <label>WhatsApp QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setWhatsappQR(e.target.files[0])}
            />

            {whatsappQR && <p style={styles.preview}>{whatsappQR.name}</p>}

            <div style={styles.buttonRow}>
              <button
                type="button"
                style={styles.button}
                onClick={() => handleSave("Footer")}
              >
                Save Footer
              </button>

              <button
                type="button"
                style={styles.close}
                onClick={() => setShowFooterEditor(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showEmails && (
          <div style={styles.modal}>
            <h2>Newsletter Subscribers</h2>

            <ul style={styles.emailList}>
              {newsletterEmails.map((mail, index) => (
                <li key={index}>{mail}</li>
              ))}
            </ul>

            <button
              type="button"
              style={styles.close}
              onClick={() => setShowEmails(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    minHeight: "100vh"
  },

  container: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    padding: "140px 40px 60px"
  },

  title: {
    textAlign: "center",
    marginBottom: "10px"
  },

  subtitle: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "40px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "40px"
  },

  statCard: {
    background: "#111",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center"
  },

  statValue: {
    fontSize: "32px",
    marginTop: "10px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "25px",
    marginTop: "20px"
  },

  card: {
    background: "#111",
    padding: "25px",
    borderRadius: "10px",
    position: "relative",
    zIndex: 1
  },

  desc: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "8px",
    marginBottom: "18px",
    lineHeight: "1.6"
  },

  bannerItem: {
    marginTop: "12px",
    padding: "10px",
    background: "#000",
    borderRadius: "6px"
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "15px"
  },

  button: {
    padding: "10px 14px",
    border: "none",
    background: "#e50914",
    color: "white",
    cursor: "pointer",
    position: "relative",
    zIndex: 10
  },

  deleteButton: {
    padding: "10px 14px",
    border: "none",
    background: "#444",
    color: "white",
    cursor: "pointer",
    position: "relative",
    zIndex: 10
  },

  preview: {
    marginTop: "10px",
    color: "#00ffae",
    fontSize: "14px",
    wordBreak: "break-word"
  },

  modal: {
    marginTop: "40px",
    background: "#111",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "500px"
  },

  input: {
    display: "block",
    marginTop: "10px",
    marginBottom: "14px",
    padding: "10px",
    width: "100%",
    border: "none"
  },

  close: {
    marginTop: "15px",
    padding: "8px 12px",
    background: "#444",
    border: "none",
    color: "white",
    cursor: "pointer",
    position: "relative",
    zIndex: 10
  },

  emailList: {
    marginTop: "20px",
    lineHeight: "2"
  }
};

export default AdminDashboard;