import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function ManageFilms() {
  const [films, setFilms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilms();
  }, []);

  async function loadFilms() {
    setLoading(true);

    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("Load films error:", error);
      setLoading(false);
      return;
    }

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

  async function uploadVideo(file) {
    if (!file) return null;

    const fileName = `video-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("films")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.log("Video upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from("films").getPublicUrl(fileName);
    return data?.publicUrl || null;
  }

  async function saveFilm(id) {
    const film = films.find((item) => item.id === id);
    if (!film) return;

    let updatedPoster = film.poster || "";
    let updatedVideo = film.video || "";

    if (posterFile) {
      const uploadedPoster = await uploadPoster(posterFile);
      if (uploadedPoster) updatedPoster = uploadedPoster;
    }

    if (videoFile) {
      const uploadedVideo = await uploadVideo(videoFile);
      if (uploadedVideo) updatedVideo = uploadedVideo;
    }

    const payload = {
      title: film.title || "",
      description: film.description || "",
      genre: film.genre || "",
      rating: film.rating || "",
      views: Number(film.views) || 0,
      poster: updatedPoster,
      video: updatedVideo,
      status: film.status || "live",
      contract_expires_at: film.contract_expires_at || null,

      // ✅ ADDED (preview)
     previewStart: Number(film.previewStart) || 0,
previewDuration: Number(film.previewDuration) || 10
    };

    const { error } = await supabase
      .from("films")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.log("Save film error:", error);
      alert("Failed to update film");
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
      status: "live",                 // ✅ critical
      contract_expires_at: nextExpiry,
      updated_at: new Date().toISOString() // 🔥 forces realtime trigger
    })
    .eq("id", film.id);

  if (error) {
    console.log("Go live error:", error);
    alert("Failed to return film to live");
    return;
  }

  await loadFilms();
  alert("Film is now LIVE on public page");
}

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1 style={styles.heading}>Films</h1>

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
                  {film.poster ? (
                    <img src={film.poster} alt={film.title} style={styles.poster} />
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
                        type="number"
                        value={film.previewStart || 0}
                        onChange={(e) =>
                         handleChange(film.id, "previewStart", e.target.value)
                        }
                        placeholder="Preview Start (seconds)"
                      />

                      <input
                        style={styles.input}
                        type="number"
                        value={film.previewDuration || 10}
                        onChange={(e) =>
                          handleChange(film.id, "previewDuration", e.target.value)
                        }
                        placeholder="Preview Duration (seconds)"
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
  cancelButton: {
    background: "#666",
    color: "white",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer"
  }
};

export default ManageFilms;