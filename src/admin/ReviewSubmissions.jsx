import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function ReviewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState({});
  const [submittingAdminFilm, setSubmittingAdminFilm] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

  const [adminFilm, setAdminFilm] = useState({
    title: "",
    director: "",
    producer: "",
    cinematographer: "",
    actors: "",
    genre: "",
    rating: "",
    language: "",
    year: "",
    duration: "",
    description: "",
    previewStart: "",
previewEnd: "",
    email: "",
    goLiveDate: "",
    goLiveTime: "",
    poster: null,
    film: null
  });

  const minGoLiveDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);

    const { data, error } = await supabase
      .from("film_submissions")
      .select("*")
      .eq("status", "pending")
      .order("id", { ascending: false });

    if (error) {
      console.log("Load submissions error:", error);
      alert(error.message || "Failed to load submissions");
      setLoading(false);
      return;
    }

    setSubmissions(data || []);
    setLoading(false);
  }

  function handleAdminChange(e) {
    const { name, value } = e.target;

    setAdminFilm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleAdminFile(e) {
    const { name, files } = e.target;

    if (files && files[0]) {
      setAdminFilm((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    }
  }

  function setReviewNote(id, value) {
    setReviewNotes((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  async function uploadPoster(file, prefix = "submission") {
    if (!file) return "";

    const fileName = `${prefix}-poster-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw new Error(error.message || "Poster upload failed");
    }

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);
    return data?.publicUrl || "";
  }

  async function uploadVideo(file, prefix = "submission", onProgress) {
  if (!file) return "";

  const fileName = `${prefix}-video-${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("films")
    .upload(fileName, file, {
      upsert: true,
      onUploadProgress: (progress) => {
        if (onProgress) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percent);
        }
      }
    });

  if (error) {
    throw new Error(error.message || "Film upload failed");
  }

  const { data } = supabase.storage
    .from("films")
    .getPublicUrl(fileName);

  return data?.publicUrl || "";
}

  function formatDuration(minutes) {
  if (!minutes) return "";

  const total = parseInt(minutes, 10);
  if (isNaN(total)) return "";

  const hours = Math.floor(total / 60);
  const mins = total % 60;

  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

  function copyShareLink() {
    const link = `${window.location.origin}/submit-film`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert(`Submission link copied:\n${link}`);
      })
      .catch(() => {
        window.prompt("Copy this submission link:", link);
      });
  }

  function watchFilm(film) {
    if (film.video) {
      window.open(film.video, "_blank");
      return;
    }

    alert("No film file available yet for preview.");
  }

    async function approveFilm(submission) {
    try {
      const now = new Date();
      const goLiveAt = submission.go_live_at ? new Date(submission.go_live_at) : null;

      const releaseStatus =
        goLiveAt && goLiveAt <= now ? "live" : "coming_soon";

      const payload = {
        title: submission.title || "",
        director: submission.director || "",
        genre: submission.genre || "",
        rating: submission.rating || "",
        language: submission.language || "",
        year: submission.year || "",
       duration: parseInt(String(submission.duration).replace(/\D/g, ""), 10) || 0,
        description: submission.description || "",
        poster: submission.poster || "",
        video: submission.video || "",
        views: 0,
        price: 3,
        status: releaseStatus,
        go_live_at: submission.go_live_at || null,
        contract_expires_at: null
      };

      const { error: insertError } = await supabase
        .from("films")
        .insert(payload);

      if (insertError) {
        throw new Error(insertError.message || "Failed to approve film");
      }

      const { error: updateError } = await supabase
        .from("film_submissions")
        .update({
          status: "approved",
          review_note: reviewNotes[submission.id] || ""
        })
        .eq("id", submission.id);

      if (updateError) {
        throw new Error(updateError.message || "Failed to update submission");
      }

      alert("Film approved successfully.");
      await loadSubmissions();
    } catch (error) {
      console.log("Approve film error:", error);
      alert(error.message || "Failed to approve film");
    }
  }

  async function rejectFilm(submission) {
    const note = reviewNotes[submission.id];

    if (!note || !note.trim()) {
      alert("Please write a reason for rejection.");
      return;
    }

    const { error } = await supabase
      .from("film_submissions")
      .update({
        status: "rejected",
        review_note: note.trim()
      })
      .eq("id", submission.id);

    if (error) {
      console.log("Reject film error:", error);
      alert(error.message || "Failed to reject submission");
      return;
    }

    alert("Film rejected successfully.");
    await loadSubmissions();
  }

  async function approveAdminFilm(e) {
    e.preventDefault();

    if (
      !adminFilm.title ||
      !adminFilm.genre ||
      !adminFilm.description ||
      !adminFilm.goLiveDate ||
      !adminFilm.goLiveTime
    ) {
      alert("Please complete the important film details.");
      return;
    }

    if (!adminFilm.poster || !adminFilm.film) {
      alert("Please upload both poster and film file.");
      return;
    }

    const goLiveAt = new Date(`${adminFilm.goLiveDate}T${adminFilm.goLiveTime}`);

    if (Number.isNaN(goLiveAt.getTime())) {
      alert("Invalid go live date or time.");
      return;
    }

    const minDateTime = new Date();
    minDateTime.setDate(minDateTime.getDate() + 14);
    minDateTime.setHours(0, 0, 0, 0);

    try {
      setSubmittingAdminFilm(true);

      const posterUrl = await uploadPoster(adminFilm.poster, "admin");
      const videoUrl = await uploadVideo(adminFilm.film, "admin", setUploadProgress);
      const now = new Date();
      const releaseStatus = goLiveAt <= now ? "live" : "coming_soon";

            const filmPayload = {
        title: adminFilm.title.trim(),
        director: adminFilm.director.trim(),
        genre: adminFilm.genre.trim(),
        rating: adminFilm.rating.trim(),
        language: adminFilm.language.trim(),
        year: adminFilm.year.trim(),
        duration: parseInt(String(adminFilm.duration).replace(/\D/g, ""), 10) || 0,
        description: adminFilm.description.trim(),
        poster: posterUrl,
        video: videoUrl,
        preview_start: adminFilm.previewStart,
preview_end: adminFilm.previewEnd,
        views: 0,
        price: 3,
        status: releaseStatus,
        go_live_at: goLiveAt.toISOString(),
        contract_expires_at: null
      };

            const { error: filmError } = await supabase.from("films").insert(filmPayload);

      if (filmError) {
        throw new Error(filmError.message || "Failed to create admin film");
      }

      alert("Admin film uploaded successfully.");

      setAdminFilm({
        title: "",
        director: "",
        producer: "",
        cinematographer: "",
        actors: "",
        genre: "",
        rating: "",
        language: "",
        year: "",
        duration: "",
        description: "",
        email: "",
        goLiveDate: "",
        goLiveTime: "",
        poster: null,
        film: null
      });

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = "";
      });
    } catch (error) {
      console.log("Admin approve film error:", error);
      alert(error.message || "Failed to upload admin film");
    } finally {
      setSubmittingAdminFilm(false);
    }
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1>Film Submissions</h1>

          <button style={styles.shareTopButton} onClick={copyShareLink}>
            Share Submission Link
          </button>
        </div>

        {loading ? (
          <p>Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p>No pending submissions found.</p>
        ) : (
          <div style={styles.grid}>
            {submissions.map((film) => (
              <div key={film.id} style={styles.card}>
                {film.poster ? (
                  <img src={film.poster} alt={film.title} style={styles.poster} />
                ) : (
                  <div style={styles.placeholder}>Poster</div>
                )}

                <h2>{film.title}</h2>

                <p style={styles.meta}>Director: {film.director || "-"}</p>
                <p style={styles.meta}>Genre: {film.genre || "-"}</p>
                <p style={styles.meta}>Rating: {film.rating || "-"}</p>
                <p style={styles.meta}>Email: {film.email || "-"}</p>
                <p style={styles.meta}>
                  Go Live:{" "}
                  {film.go_live_at
                    ? new Date(film.go_live_at).toLocaleString()
                    : "-"}
                </p>

                <textarea
                  placeholder="Review notes (approval or rejection)"
                  value={reviewNotes[film.id] || ""}
                  onChange={(e) => setReviewNote(film.id, e.target.value)}
                  style={styles.textarea}
                />

                <div style={styles.buttons}>
                  <button style={styles.share} onClick={copyShareLink}>
                    Share
                  </button>

                  <button style={styles.watch} onClick={() => watchFilm(film)}>
                    Watch
                  </button>

                  <button style={styles.approve} onClick={() => approveFilm(film)}>
                    Approve
                  </button>

                  <button style={styles.reject} onClick={() => rejectFilm(film)}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h1 style={{ marginTop: "80px" }}>Upload Personal Film</h1>

        <form onSubmit={approveAdminFilm} style={styles.form}>
          <input
            name="title"
            placeholder="Film Title"
            value={adminFilm.title}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="director"
            placeholder="Director"
            value={adminFilm.director}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="producer"
            placeholder="Producer"
            value={adminFilm.producer}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="cinematographer"
            placeholder="Cinematographer"
            value={adminFilm.cinematographer}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="actors"
            placeholder="Lead Actors"
            value={adminFilm.actors}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="genre"
            placeholder="Genre"
            value={adminFilm.genre}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="rating"
            placeholder="PG Rating"
            value={adminFilm.rating}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="language"
            placeholder="Language"
            value={adminFilm.language}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="year"
            placeholder="Year"
            value={adminFilm.year}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
  name="duration"
  type="text"
  placeholder="Duration in minutes"
  value={adminFilm.duration}
  onChange={handleAdminChange}
  style={styles.input}
/>
<label style={styles.label}>Preview Start Time (mm:ss)</label>
<input
  name="previewStart"
  placeholder="e.g. 00:30"
  value={adminFilm.previewStart}
  onChange={handleAdminChange}
  style={styles.input}
/>

<label style={styles.label}>Preview End Time (mm:ss)</label>
<input
  name="previewEnd"
  placeholder="e.g. 01:45"
  value={adminFilm.previewEnd}
  onChange={handleAdminChange}
  style={styles.input}
/>
{adminFilm.duration && !isNaN(adminFilm.duration) && (
  <p style={{ color: "#00ffae", fontSize: "14px", marginTop: "5px" }}>
    Preview: {formatDuration(adminFilm.duration)}
  </p>
)}

          <input
            name="email"
            placeholder="Filmmaker Email (optional for admin upload)"
            value={adminFilm.email}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <label style={styles.label}>Preferred Go Live Date</label>
          <input
            type="date"
            name="goLiveDate"
            value={adminFilm.goLiveDate}
            min={minGoLiveDate}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <label style={styles.label}>Preferred Go Live Time</label>
          <input
            type="time"
            name="goLiveTime"
            value={adminFilm.goLiveTime}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <textarea
            name="description"
            placeholder="Film Description"
            value={adminFilm.description}
            onChange={handleAdminChange}
            style={styles.textarea}
          />

          <label style={styles.label}>Poster</label>
          <input
            type="file"
            name="poster"
            accept="image/*"
            onChange={handleAdminFile}
            style={styles.input}
          />

          <label style={styles.label}>Film File</label>
          <input
            type="file"
            name="film"
            accept="video/*"
            onChange={handleAdminFile}
            style={styles.input}
          />

{uploadProgress > 0 && (
  <p style={{ color: "#00ffae", marginBottom: "10px" }}>
    Uploading: {uploadProgress}%
  </p>
)}

          <button style={styles.approve} disabled={submittingAdminFilm}>
            {submittingAdminFilm
              ? "Uploading..."
              : "Approve & Send to Coming Soon"}
          </button>
        </form>
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
    padding: "80px",
    paddingTop: "120px"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },
  shareTopButton: {
    background: "#8b5cf6",
    border: "none",
    padding: "12px 18px",
    color: "white",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "30px",
    marginTop: "40px"
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "8px"
  },
  poster: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px"
  },
  placeholder: {
    height: "160px",
    background: "#222",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    marginBottom: "10px"
  },
  meta: {
    color: "#aaa"
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap"
  },
  share: {
    background: "#8b5cf6",
    border: "none",
    padding: "8px 14px",
    color: "white",
    cursor: "pointer"
  },
  watch: {
    background: "#3b82f6",
    border: "none",
    padding: "8px 14px",
    color: "white",
    cursor: "pointer"
  },
  approve: {
    background: "#10b981",
    border: "none",
    padding: "10px",
    color: "white",
    cursor: "pointer"
  },
  reject: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    color: "white",
    cursor: "pointer"
  },
  textarea: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    border: "none",
    height: "80px"
  },
  form: {
    maxWidth: "560px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "40px"
  },
  label: {
    marginTop: "8px",
    color: "#ddd"
  },
  input: {
    padding: "10px",
    border: "none"
  }
};

export default ReviewSubmissions