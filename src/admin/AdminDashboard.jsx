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

  const [logos, setLogos] = useState([]);
const [editingLogo, setEditingLogo] = useState(false);
const [newLogoFile, setNewLogoFile] = useState(null);

  const [showFooterEditor, setShowFooterEditor] = useState(false);
  const [showEmails, setShowEmails] = useState(false);

  const [youtube, setYoutube] = useState(PLATFORM.youtube);
  const [facebook, setFacebook] = useState(PLATFORM.facebook);
  const [instagram, setInstagram] = useState(PLATFORM.instagram);
  const [email, setEmail] = useState(PLATFORM.email);
  const [whatsappQR, setWhatsappQR] = useState(null);

  const [newsletterEmails, setNewsletterEmails] = useState([]);

  useEffect(() => {
    loadDashboardStats();
    loadBanners();
  }, []);

  useEffect(() => {
  loadDashboardStats();
  loadBanners();
  loadLogo(); // ADD THIS
}, []);

useEffect(() => {
  loadDashboardStats();
  loadBanners();
  loadLogo();
  loadNewsletterEmails();
}, []);

async function uploadLogo() {
  if (!newLogoFile) {
    alert("Choose a logo first");
    return;
  }

  const fileName = `${Date.now()}-${newLogoFile.name}`;

  const { error } = await supabase.storage
    .from("logos")
    .upload(fileName, newLogoFile, { upsert: true });

  if (error) {
    console.log(error);
    alert("Logo upload failed");
    return;
  }

  const { data } = supabase.storage
    .from("logos")
    .getPublicUrl(fileName);

  // delete old logo (only 1 allowed)
  await supabase.from("logos").delete().neq("id", 0);

  await supabase.from("logos").insert([
    {
      file_url: data.publicUrl,
      file_name: newLogoFile.name
    }
  ]);

  setNewLogoFile(null);
  loadLogo();
  alert("Logo updated successfully");
}

async function loadNewsletterEmails() {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Newsletter load error:", error);
    return;
  }

  setNewsletterEmails(data || []);
}

async function deleteLogo(id) {
  const confirmed = window.confirm("Delete current logo?");
  if (!confirmed) return;

  await supabase.from("logos").delete().eq("id", id);
  loadLogo();
}

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

  async function loadLogo() {
  const { data, error } = await supabase
    .from("logos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!error) setLogos(data || []);
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

    const { error } = await supabase.from("banners").delete().eq("id", id);

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

  let fileUrl = "";
  let fileType = newBannerFile.type;

  try {
    if (newBannerFile.type.startsWith("video/")) {
      const res = await fetch(
        "https://qrujwmcbobhthwzqmmjp.supabase.co/functions/v1/create-upload",
        { method: "POST" }
      );

      const uploadData = await res.json();

      if (!uploadData.success) {
        console.log("Cloudflare upload URL error:", uploadData);
        alert("Video upload setup failed");
        return;
      }

      const { uploadURL, uid } = uploadData;

      const formData = new FormData();
      formData.append("file", newBannerFile);

      const uploadRes = await fetch(uploadURL, {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        console.log("Cloudflare video upload failed:", await uploadRes.text());
        alert("Video upload failed");
        return;
      }

fileUrl = `https://iframe.videodelivery.net/${uid}`;    } else {
      const fileName = `${Date.now()}-${newBannerFile.name.replace(/\s+/g, "-")}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(fileName, newBannerFile, { upsert: true });

      if (uploadError) {
        console.log("Banner image upload error:", uploadError);
        alert("Image upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName);

      fileUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from("banners").insert([
      {
        file_url: fileUrl,
        file_type: fileType,
        file_name: newBannerFile.name
      }
    ]);

    if (insertError) {
      console.log("Banner save error:", insertError);
      alert(insertError.message || "Failed to save banner");
      return;
    }

    setNewBannerFile(null);
    await loadBanners();
    alert("Banner uploaded successfully");
  } catch (error) {
    console.log("Banner upload crash:", error);
    alert("Upload crashed");
  }
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
    <div style={styles.editForm}>
      <h3 style={styles.formTitle}>Edit Home Banner</h3>

      <div style={styles.formSection}>
        <h4>Existing Banner Files</h4>

        {banners.length === 0 ? (
          <p style={styles.desc}>
            No banner files found in database yet.
          </p>
        ) : (
          banners.map((item, index) => (
            <div key={item.id} style={styles.bannerRow}>
              <span>
                Banner {index + 1}: {item.file_name || "Uploaded file"}
              </span>

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

      <div style={styles.formSection}>
        <h4>Upload New Banner</h4>

        <input
          type="file"
          accept="image/*,video/mp4"
          onChange={(e) => setNewBannerFile(e.target.files[0])}
        />

        {newBannerFile && (
          <p style={styles.preview}>{newBannerFile.name}</p>
        )}
      </div>

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
    </div>
  )}
</div>

          <div style={styles.card}>
  <h2>Platform Logo</h2>

  {!editingLogo ? (
    <button
      type="button"
      style={styles.button}
      onClick={() => setEditingLogo(true)}
    >
      Edit
    </button>
  ) : (
    <div style={styles.editForm}>
      <h3 style={styles.formTitle}>Edit Platform Logo</h3>

      <div style={styles.formSection}>
        <h4>Current Logo</h4>

        {logos.length === 0 ? (
          <p style={styles.desc}>No logo uploaded yet.</p>
        ) : (
          logos.map((item) => (
            <div key={item.id} style={styles.bannerRow}>
              <span>{item.file_name}</span>

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => deleteLogo(item.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div style={styles.formSection}>
        <h4>Upload New Logo</h4>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewLogoFile(e.target.files[0])}
        />

        {newLogoFile && (
          <p style={styles.preview}>{newLogoFile.name}</p>
        )}
      </div>

      <div style={styles.buttonRow}>
        <button
          type="button"
          style={styles.button}
          onClick={uploadLogo}
        >
          Go Live
        </button>

        <button
          type="button"
          style={styles.close}
          onClick={() => setEditingLogo(false)}
        >
          Close
        </button>
      </div>
    </div>
  )}
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
            <input value={youtube} onChange={(e) => setYoutube(e.target.value)} style={styles.input} />

            <label>Facebook Link</label>
            <input value={facebook} onChange={(e) => setFacebook(e.target.value)} style={styles.input} />

            <label>Instagram Link</label>
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} style={styles.input} />

            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

            <label>WhatsApp QR Code</label>
            <input type="file" accept="image/*" onChange={(e) => setWhatsappQR(e.target.files[0])} />

            {whatsappQR && <p style={styles.preview}>{whatsappQR.name}</p>}

            <div style={styles.buttonRow}>
              <button type="button" style={styles.button} onClick={() => handleSave("Footer")}>
                Save Footer
              </button>

              <button type="button" style={styles.close} onClick={() => setShowFooterEditor(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {showEmails && (
          <div style={styles.modal}>
            <h2>Newsletter Subscribers</h2>

            <ul style={styles.emailList}>
              {newsletterEmails.map((item) => (
  <li key={item.id}>
    {item.email} — {item.source || "unknown"}
  </li>
))}
            </ul>

            <button type="button" style={styles.close} onClick={() => setShowEmails(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#000", minHeight: "100vh" },
  container: { background: "#000", color: "white", minHeight: "100vh", padding: "140px 40px 60px" },
  title: { textAlign: "center", marginBottom: "10px" },
  subtitle: { textAlign: "center", color: "#aaa", marginBottom: "40px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginBottom: "40px" },
  statCard: { background: "#111", padding: "25px", borderRadius: "10px", textAlign: "center" },
  statValue: { fontSize: "32px", marginTop: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "25px", marginTop: "20px" },
  card: { background: "#111", padding: "25px", borderRadius: "10px", position: "relative", zIndex: 1 },
  desc: { fontSize: "14px", color: "#aaa", marginTop: "8px", marginBottom: "18px", lineHeight: "1.6" },
  bannerItem: { marginTop: "12px", padding: "10px", background: "#000", borderRadius: "6px" },
  buttonRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" },
  button: { padding: "10px 14px", border: "none", background: "#e50914", color: "white", cursor: "pointer", position: "relative", zIndex: 10 },
  deleteButton: { padding: "10px 14px", border: "none", background: "#444", color: "white", cursor: "pointer", position: "relative", zIndex: 10 },
  preview: { marginTop: "10px", color: "#00ffae", fontSize: "14px", wordBreak: "break-word" },
  modal: { marginTop: "40px", background: "#111", padding: "30px", borderRadius: "10px", maxWidth: "500px" },
  input: { display: "block", marginTop: "10px", marginBottom: "14px", padding: "10px", width: "100%", border: "none" },
  close: { marginTop: "15px", padding: "8px 12px", background: "#444", border: "none", color: "white", cursor: "pointer", position: "relative", zIndex: 10 },
  emailList: { marginTop: "20px", lineHeight: "2" },

editForm: {
  marginTop: "20px",
  background: "#000",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "left"
},

formTitle: {
  marginBottom: "20px",
  textAlign: "center"
},

formSection: {
  marginBottom: "25px"
},

bannerRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  background: "#111",
  padding: "12px",
  borderRadius: "6px",
  marginTop: "10px"
},
};


export default AdminDashboard;