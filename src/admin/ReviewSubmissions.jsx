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
      alert(error.message);
      setLoading(false);
      return;
    }

    setSubmissions(data || []);
    setLoading(false);
  }

  function handleAdminChange(e) {
    const { name, value } = e.target;
    setAdminFilm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAdminFile(e) {
    const { name, files } = e.target;
    if (files && files[0]) {
      setAdminFilm((prev) => ({ ...prev, [name]: files[0] }));
    }
  }

  function setReviewNote(id, value) {
    setReviewNotes((prev) => ({ ...prev, [id]: value }));
  }

  async function uploadPoster(file, prefix = "submission") {
    if (!file) return "";

    const fileName = `${prefix}-poster-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);
    return data.publicUrl;
  }

  // ✅ FIXED: uploadVideo now exists
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

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("films").getPublicUrl(fileName);
    return data.publicUrl;
  }

  function formatDuration(minutes) {
    const total = parseInt(minutes, 10);
    if (isNaN(total)) return "";
    const h = Math.floor(total / 60);
    const m = total % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  async function approveAdminFilm(e) {
    e.preventDefault();

    try {
      setSubmittingAdminFilm(true);
      setUploadProgress(0);

      const posterUrl = await uploadPoster(adminFilm.poster, "admin");
      const videoUrl = await uploadVideo(
        adminFilm.film,
        "admin",
        setUploadProgress
      );

      const goLiveAt = new Date(`${adminFilm.goLiveDate}T${adminFilm.goLiveTime}`);
      const releaseStatus =
        goLiveAt <= new Date() ? "live" : "coming_soon";

      const payload = {
        title: adminFilm.title,
        director: adminFilm.director,
        genre: adminFilm.genre,
        rating: adminFilm.rating,
        language: adminFilm.language,
        year: adminFilm.year,
        duration: parseInt(adminFilm.duration) || 0,
        description: adminFilm.description,
        poster: posterUrl,
        video: videoUrl,
        preview_start: adminFilm.previewStart,
        preview_end: adminFilm.previewEnd,
        views: 0,
        price: 3,
        status: releaseStatus,
        go_live_at: goLiveAt.toISOString()
      };

      await supabase.from("films").insert(payload);

      alert("Upload successful");

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
        previewStart: "",
        previewEnd: "",
        email: "",
        goLiveDate: "",
        goLiveTime: "",
        poster: null,
        film: null
      });

      setUploadProgress(0);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingAdminFilm(false);
    }
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <AdminNavbar />
      <NavigationArrows />

      <div style={{ padding: "120px 80px", color: "#fff" }}>
        <h1>Upload Personal Film</h1>

        <form onSubmit={approveAdminFilm} style={{ maxWidth: "500px" }}>
          <input name="title" placeholder="Film Title" onChange={handleAdminChange} />
          <input name="director" placeholder="Director" onChange={handleAdminChange} />
          <input name="genre" placeholder="Genre" onChange={handleAdminChange} />
          <input name="duration" placeholder="Duration" onChange={handleAdminChange} />

          <input
            name="previewStart"
            placeholder="Preview Start (00:30)"
            onChange={handleAdminChange}
          />
          <input
            name="previewEnd"
            placeholder="Preview End (01:30)"
            onChange={handleAdminChange}
          />

          <input type="file" name="poster" onChange={handleAdminFile} />
          <input type="file" name="film" onChange={handleAdminFile} />

          {/* ✅ CORRECT PLACE */}
          {uploadProgress > 0 && (
            <p style={{ color: "#00ffae" }}>
              Uploading: {uploadProgress}%
            </p>
          )}

          <button disabled={submittingAdminFilm}>
            {submittingAdminFilm ? "Uploading..." : "Approve & Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewSubmissions;