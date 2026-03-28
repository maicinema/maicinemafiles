import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function ReviewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState({});
  const [submittingAdminFilm, setSubmittingAdminFilm] = useState(false);

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

  // ✅ ADDED (ONLY THIS)
  function formatDuration(minutes) {
    if (!minutes) return "-";

    const total = parseInt(minutes, 10);
    if (isNaN(total)) return "-";

    const hours = Math.floor(total / 60);
    const mins = total % 60;

    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
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

  async function uploadVideo(file, prefix = "submission") {
    if (!file) return "";

    const fileName = `${prefix}-video-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("films")
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw new Error(error.message || "Film upload failed");
    }

    const { data } = supabase.storage.from("films").getPublicUrl(fileName);
    return data?.publicUrl || "";
  }

  function copyShareLink() {
    const link = `${window.location.origin}/submit-film`;

    navigator.clipboard.writeText(link).then(() => {
      alert(`Submission link copied:\n${link}`);
    });
  }

  function watchFilm(film) {
    if (film.video) window.open(film.video, "_blank");
    else alert("No film file available yet.");
  }

  async function approveAdminFilm(e) {
    e.preventDefault();

    try {
      setSubmittingAdminFilm(true);

      const posterUrl = await uploadPoster(adminFilm.poster, "admin");
      const videoUrl = await uploadVideo(adminFilm.film, "admin");

      await supabase.from("films").insert({
        ...adminFilm,
        poster: posterUrl,
        video: videoUrl,
        duration:
          parseInt(String(adminFilm.duration).replace(/\D/g, ""), 10) || 0
      });

      alert("Film uploaded successfully");

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
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmittingAdminFilm(false);
    }
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={styles.container}>
        <h1>Upload Personal Film</h1>

        <form onSubmit={approveAdminFilm} style={styles.form}>
          <input
            name="title"
            placeholder="Film Title"
            value={adminFilm.title}
            onChange={handleAdminChange}
            style={styles.input}
          />

          <input
            name="duration"
            type="number"
            placeholder="Duration in minutes"
            value={adminFilm.duration}
            onChange={handleAdminChange}
            style={styles.input}
          />

          {/* ✅ ADDED PREVIEW */}
          {adminFilm.duration && (
            <p style={{ color: "#00ffae", fontSize: "14px" }}>
              Preview: {formatDuration(adminFilm.duration)}
            </p>
          )}

          <input
            type="file"
            name="poster"
            onChange={handleAdminFile}
            style={styles.input}
          />

          <input
            type="file"
            name="film"
            onChange={handleAdminFile}
            style={styles.input}
          />

          <button style={styles.approve}>
            {submittingAdminFilm ? "Uploading..." : "Upload Film"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#000", minHeight: "100vh" },
  container: { color: "white", padding: "120px 80px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px" },
  approve: {
    background: "#10b981",
    padding: "10px",
    border: "none",
    color: "white"
  }
};

export default ReviewSubmissions;