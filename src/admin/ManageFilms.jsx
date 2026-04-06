import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function formatToMMSS(value) {
  if (!value) return "";

  // if already formatted like 01:30 → return
  if (typeof value === "string" && value.includes(":")) {
    return value;
  }

  // convert number → mm:ss
  const seconds = Number(value);
  if (isNaN(seconds)) return "";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function ManageFilms() {
  const [films, setFilms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rentCount, setRentCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);

  // ✅ LOAD EVERYTHING ON PAGE LOAD
  useEffect(() => {
    loadFilms();
    loadStats();
  }, []);

  // ✅ FIXED: properly scoped
  async function loadStats() {
    const { data, error } = await supabase
      .from("payments")
      .select("type");

    if (error) {
      console.log("Stats error:", error);
      return;
    }

    const rents = data.filter((p) => p.type === "rent").length;
    const subs = data.filter((p) => p.type === "subscription").length;

    setRentCount(rents);
    setSubscriptionCount(subs);
  }

  // ✅ CLEAN films loader (NO nested functions)
  async function loadFilms() {
    setLoading(true);

    const { data, error } = await supabase
      .from("films")
      .select("*")
.not("video_url", "is", null)
.not("poster_url", "is", null)
      .order("id", { ascending: false });

    if (error) {
      console.log("Load films error:", error);
      setLoading(false);
      return;
    }

    console.log("FILMS DATA:", data);

    setFilms(data || []);
    setLoading(false);
  }

  function isExpired(film) {
    if (!film.contract_expires_at) return false;
    return new Date(film.contract_expires_at) <= new Date();
  }

  function handleChange(id, field, value) {
    setFilms((prev) =>
      prev.map((film) =>
        film.id === id ? { ...film, [field]: value } : film
      )
    );
  }

  async function uploadPoster(file) {
    if (!file) return null;

    const fileName = `poster-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.log("Poster upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);
    return data?.publicUrl || null;
  }

  async function saveFilm(id) {
    const film = films.find((item) => item.id === id);
    if (!film) return;

    let updatedPoster = film.poster_url || "";
let updatedVideo = film.video_url || "";

    // ✅ poster upload
    if (posterFile) {
      const uploadedPoster = await uploadPoster(posterFile);
      if (uploadedPoster) updatedPoster = uploadedPoster;
    }

    // ✅ video upload
    if (videoFile) {
  const formData = new FormData();
  formData.append("file", videoFile);

  const res = await fetch(
    "https://qrujwmcbobhthwzqmmjp.supabase.co/functions/v1/upload-video",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: formData
    }
  );

  const result = await res.json();

  if (!result.success || !result.playbackUrl) {
  console.log("❌ Upload failed FULL:", result);
  alert("Video upload failed properly — no playback URL");
  return;
}

updatedVideo = result.playbackUrl;

}
    const payload = {
  title: film.title || "",
  description: film.description || "",
  genre: film.genre || "",
  rating: film.rating || "",
  views: Number(film.views) || 0,

  // ✅ IMPORTANT: match your DB
  poster_url: updatedPoster,
  video_url: updatedVideo,

  status: film.status || "live",
  contract_expires_at: film.contract_expires_at || null,

  // ✅ preview fields (we test both safely)
  previewStart: film.previewStart || "00:00",
previewDuration: film.previewDuration || "00:10"
};

    const { error } = await supabase
      .from("films")
      .update(payload)
      .eq("id", id);

    if (error) {
  console.log("🔥 FULL ERROR:", error);
  alert(error.message || "Failed to update film");
  return;
}

    setEditingId(null);
    setPosterFile(null);
    setVideoFile(null);
    await loadFilms();
    alert("Film updated successfully");
  }

  async function deleteFilm(id) {
    const confirmed = window.confirm("Delete this film completely?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("films")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Delete film error:", error);
      alert("Failed to delete film");
      return;
    }

    await loadFilms();
    alert("Film deleted successfully");
  }

 async function goLiveFilm(film) {
  const now = new Date();
  const currentExpiry = film.contract_expires_at
    ? new Date(film.contract_expires_at)
    : null;

  let nextExpiry = film.contract_expires_at;

  if (!currentExpiry || currentExpiry <= now) {
    const renewed = new Date();
    renewed.setMonth(renewed.getMonth() + 3);
    nextExpiry = renewed.toISOString();
  }

  const { error } = await supabase
    .from("films")
    .update({
      status: "live",
      contract_expires_at: nextExpiry
    })
    .eq("id", film.id);

  if (error) {
    console.log("🔥 Go live error FULL:", error);
    alert(error.message || "Failed to return film to live");
    return;
  }

  await loadFilms();
  alert("Film is now LIVE on public page ✅");
}

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1 style={styles.heading}>Films</h1>
<div style={{ display: "flex", gap: "20px", marginBottom: "30px", justifyContent: "center" }}>
  <div style={styles.statBox}>
    🎬 Rentals: {rentCount}
  </div>

  <div style={styles.statBox}>
    💳 Subscriptions: {subscriptionCount}
  </div>
</div>
        {loading ? (
          <p>Loading films...</p>
        ) : films.length === 0 ? (
          <p>No films found.</p>
        ) : (
          <div style={styles.grid}>
            {films.map((film) => {
              const expired = isExpired(film);

              return (
                <div key={film.id} style={styles.card}>
                  {film.poster_url ? (
  <img
    src={film.poster_url + "?t=" + Date.now()}
    alt={film.title}
    style={styles.poster}
  />
) : (
                    <div style={styles.placeholder}>No Poster</div>
                  )}

                  {editingId === film.id ? (
                    <>
                      <input
                        style={styles.input}
                        value={film.title || ""}
                        onChange={(e) =>
                          handleChange(film.id, "title", e.target.value)
                        }
                        placeholder="Title"
                      />

                      <input
                        style={styles.input}
                        value={film.genre || ""}
                        onChange={(e) =>
                          handleChange(film.id, "genre", e.target.value)
                        }
                        placeholder="Genre"
                      />

                      <input
                        style={styles.input}
                        value={film.rating || ""}
                        onChange={(e) =>
                          handleChange(film.id, "rating", e.target.value)
                        }
                        placeholder="Rating"
                      />

                      <input
                        style={styles.input}
                        type="number"
                        value={film.views || 0}
                        onChange={(e) =>
                          handleChange(film.id, "views", e.target.value)
                        }
                        placeholder="Views"
                      />

                      <textarea
                        style={styles.textarea}
                        value={film.description || ""}
                        onChange={(e) =>
                          handleChange(film.id, "description", e.target.value)
                        }
                        placeholder="Description"
                      />

                      {/* ✅ ADDED PREVIEW INPUTS */}
                      <input
  style={styles.input}
  type="text"
  placeholder="00:30"
  value={formatToMMSS(film.previewStart)}
  onChange={(e) =>
    handleChange(film.id, "previewStart", e.target.value)
  }
/>

                      <input
  style={styles.input}
  type="text"
  placeholder="01:45"
  value={formatToMMSS(film.previewDuration)}
  onChange={(e) =>
    handleChange(film.id, "previewDuration", e.target.value)
  }
/>

                      <select
                        style={styles.input}
                        value={film.status || "live"}
                        onChange={(e) =>
                          handleChange(film.id, "status", e.target.value)
                        }
                      >
                        <option value="live">live</option>
                        <option value="coming_soon">coming_soon</option>
                        <option value="expired">expired</option>
                      </select>

                      <input
                        style={styles.input}
                        type="datetime-local"
                        value={
                          film.contract_expires_at
                            ? new Date(film.contract_expires_at)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleChange(film.id, "contract_expires_at", e.target.value)
                        }
                      />

                      <label style={styles.label}>Select Poster</label>
                      <input
                        style={styles.input}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                      />

                      <label style={styles.label}>Select Video</label>
                      <input
                        style={styles.input}
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />

                      <div style={styles.buttonRow}>
                        <button
                          style={styles.saveButton}
                          onClick={() => saveFilm(film.id)}
                        >
                          Save
                        </button>

                        <button
                          style={styles.cancelButton}
                          onClick={() => {
                            setEditingId(null);
                            setPosterFile(null);
                            setVideoFile(null);
                            loadFilms();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 style={styles.title}>{film.title}</h2>

                      {expired && <div style={styles.expired}>EXPIRED</div>}

                      <p style={styles.meta}>
                        {film.genre} • {film.rating}
                      </p>

                      <p style={styles.meta}>Views: {film.views || 0}</p>

                      <p style={styles.meta}>Status: {film.status || "live"}</p>

                      <p style={styles.description}>{film.description}</p>

                      <div style={styles.buttonRow}>
                        <button
                          style={styles.editButton}
                          onClick={() => {
                            setEditingId(film.id);
                            setPosterFile(null);
                            setVideoFile(null);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          style={styles.deleteButton}
                          onClick={() => deleteFilm(film.id)}
                        >
                          Delete
                        </button>

                        <button
                          style={styles.liveButton}
                          onClick={() => goLiveFilm(film)}
                        >
                          Go Live
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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
  heading: {
    textAlign: "center",
    marginBottom: "40px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px"
  },
  card: {
    background: "#111",
    borderRadius: "10px",
    padding: "20px"
  },
  poster: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px"
  },
  placeholder: {
    width: "100%",
    height: "220px",
    background: "#222",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888"
  },
  title: {
    margin: "0 0 10px 0"
  },
  expired: {
    color: "#ff3b3b",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  meta: {
    color: "#bbb",
    margin: "6px 0"
  },
  description: {
    color: "#ddd",
    marginTop: "12px",
    lineHeight: "1.5"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none"
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#ccc"
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap"
  },
  editButton: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  liveButton: {
    background: "#e50914",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  saveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  },
  statBox: {
  background: "#111",
  padding: "15px 25px",
  borderRadius: "8px",
  fontWeight: "bold"
},

  cancelButton: {
    background: "#666",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  }
};

export default ManageFilms;