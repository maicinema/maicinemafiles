import { useEffect, useState } from "react";
import { PLATFORM } from "../config/platform";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function AdminDashboard() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [filmCount, setFilmCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const [homeBanner, setHomeBanner] = useState(null);
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

  function handleSave(item) {
    alert(item + " updated (backend will store later)");
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
            <p style={styles.desc}>
              Edit homepage advert banner, replace media, or upload new campaign
            </p>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setHomeBanner(e.target.files[0])}
            />

            {homeBanner && (
              <p style={styles.preview}>{homeBanner.name}</p>
            )}

            <div style={styles.buttonRow}>
              <button style={styles.button}>Edit</button>
              <button
                style={styles.button}
                onClick={() => handleSave("Home Banner")}
              >
                Go Live
              </button>
              <button style={styles.deleteButton}>Delete Old</button>
            </div>
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

            {logo && (
              <p style={styles.preview}>{logo.name}</p>
            )}

            <div style={styles.buttonRow}>
              <button style={styles.button}>Edit</button>
              <button
                style={styles.button}
                onClick={() => handleSave("Logo")}
              >
                Go Live
              </button>
              <button style={styles.deleteButton}>Delete Old</button>
            </div>
          </div>

          <div style={styles.card}>
            <h2>Footer Settings</h2>
            <p style={styles.desc}>
              Update footer social links, contact details, and WhatsApp QR
            </p>

            <button
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

            {whatsappQR && (
              <p style={styles.preview}>{whatsappQR.name}</p>
            )}

            <div style={styles.buttonRow}>
              <button
                style={styles.button}
                onClick={() => handleSave("Footer")}
              >
                Save Footer
              </button>

              <button
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
    borderRadius: "10px"
  },

  desc: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "8px",
    marginBottom: "18px",
    lineHeight: "1.6"
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
    cursor: "pointer"
  },

  deleteButton: {
    padding: "10px 14px",
    border: "none",
    background: "#444",
    color: "white",
    cursor: "pointer"
  },

  preview: {
    marginTop: "10px",
    color: "#00ffae",
    fontSize: "14px"
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
    cursor: "pointer"
  },

  emailList: {
    marginTop: "20px",
    lineHeight: "2"
  }
};

export default AdminDashboard;