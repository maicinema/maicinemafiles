import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function SubmitFilm() {
  const [form, setForm] = useState({
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
    goLiveDate: "",
    goLiveTime: "",
    poster: null,
    film: null,
    email: "",

    // ✅ ADDED
    previewStart: "",
    previewEnd: ""
  });

  const [submitting, setSubmitting] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

  const minGoLiveDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const uploadPoster = async (file) => {
    if (!file) return "";

    const fileName = `submission-poster-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw new Error(error.message || "Poster upload failed");
    }

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);
    return data?.publicUrl || "";
  };

  const uploadVideo = async (file) => {
  if (!file) return "";

  console.log("🚀 Filmmaker video upload starting...");

  const res = await fetch(
    "https://qrujwmcbobhthwzqmmjp.supabase.co/functions/v1/create-upload",
    {
      method: "POST"
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || "Video upload setup failed");
  }

  const { uploadURL, uid } = data;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        resolve(`https://videodelivery.net/${uid}/manifest/video.m3u8`);
      } else {
        reject(new Error("Video upload failed"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading video"));
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData);
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.email || !form.genre || !form.description) {
      alert("Please fill in all important film details before submitting.");
      return;
    }

    if (!form.poster || !form.film) {
      alert("Please upload both poster and film file.");
      return;
    }

    if (!form.goLiveDate || !form.goLiveTime) {
      alert("Please choose your preferred go live date and time.");
      return;
    }

    const goLiveAt = new Date(`${form.goLiveDate}T${form.goLiveTime}`);

    if (Number.isNaN(goLiveAt.getTime())) {
      alert("Invalid go live date or time.");
      return;
    }

    const minDateTime = new Date();
    minDateTime.setDate(minDateTime.getDate() + 14);
    minDateTime.setHours(0, 0, 0, 0);

    if (goLiveAt < minDateTime) {
      alert("Go live date must be at least 14 days from today.");
      return;
    }

   try {
      setSubmitting(true);
      setUploadProgress(0);


      const posterUrl = await uploadPoster(form.poster);
      const videoUrl = await uploadVideo(form.film);

      const payload = {
        title: form.title.trim(),
        director: form.director.trim(),
        producer: form.producer.trim(),
        cinematographer: form.cinematographer.trim(),
        actors: form.actors.trim(),
        genre: form.genre.trim(),
        rating: form.rating.trim(),
        language: form.language.trim(),
        year: form.year.trim(),
        duration: form.duration.trim(),
        description: form.description.trim(),
        email: form.email.trim(),
        poster: posterUrl,
       video: videoUrl,
        go_live_at: goLiveAt.toISOString(),
        status: "pending",
        source: "filmmaker",

        // ✅ ADDED
        preview_start: form.previewStart,
        preview_end: form.previewEnd
      };

      const { error } = await supabase.from("film_submissions").insert(payload);

      if (error) {
        throw new Error(error.message || "Failed to submit film");
      }

      alert("Film submitted successfully. Admin will review it.");

      setForm({
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
        goLiveDate: "",
        goLiveTime: "",
        poster: null,
        film: null,
        email: "",
        previewStart: "",
        previewEnd: ""
      });

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = "";
      });
    } catch (error) {
      console.log("Submit film error:", error);
      alert(error.message || "Something went wrong while submitting the film.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Submit Your Film</h1>
      <p style={styles.note}>
        Choose a go-live date at least 14 days from today.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* KEEP EVERYTHING YOU HAD */}

        <input name="title" value={form.title} placeholder="Film Title" onChange={handleChange} style={styles.input} />
        <input name="director" value={form.director} placeholder="Director" onChange={handleChange} style={styles.input} />
        <input name="producer" value={form.producer} placeholder="Producer" onChange={handleChange} style={styles.input} />
        <input name="cinematographer" value={form.cinematographer} placeholder="Cinematographer" onChange={handleChange} style={styles.input} />
        <input name="actors" value={form.actors} placeholder="Lead Actors" onChange={handleChange} style={styles.input} />
        <input name="genre" value={form.genre} placeholder="Genre" onChange={handleChange} style={styles.input} />
        <input name="rating" value={form.rating} placeholder="PG Rating" onChange={handleChange} style={styles.input} />
        <input name="language" value={form.language} placeholder="Language" onChange={handleChange} style={styles.input} />
        <input name="year" value={form.year} placeholder="Release Year" onChange={handleChange} style={styles.input} />
        <input name="duration" value={form.duration} placeholder="Duration (minutes)" onChange={handleChange} style={styles.input} />

        {/* ✅ ADDED HERE (PREVIEW FIELDS) */}
        <label style={styles.label}>Preview Start Time (mm:ss)</label>
        <input
          name="previewStart"
          placeholder="e.g. 00:30"
          value={form.previewStart}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Preview End Time (mm:ss)</label>
        <input
          name="previewEnd"
          placeholder="e.g. 01:45"
          value={form.previewEnd}
          onChange={handleChange}
          style={styles.input}
        />

        <input name="email" value={form.email} placeholder="Filmmaker Email" onChange={handleChange} style={styles.input} />

        {/* KEEP REST */}
        <label style={styles.label}>Preferred Go Live Date</label>
        <input type="date" name="goLiveDate" value={form.goLiveDate} min={minGoLiveDate} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Preferred Go Live Time</label>
        <input type="time" name="goLiveTime" value={form.goLiveTime} onChange={handleChange} style={styles.input} />

        <textarea name="description" value={form.description} placeholder="Film Description" onChange={handleChange} style={styles.textarea} />

        <label style={styles.label}>Poster</label>

<p style={styles.posterNote}>
  Recommended poster size: <strong>1920 × 1080 px</strong> landscape.
  Upload a clean poster image with <strong>no text or write-ups</strong>.
  Do not include the film title, description, credits, or any written text.
  MaiCinema will automatically display the film title on the banner and film cards.
</p>

<input
  type="file"
  name="poster"
  accept="image/*"
  onChange={handleFile}
  style={styles.input}
/>

        <label style={styles.label}>Film File</label>
        <input type="file" name="film" accept="video/*" onChange={handleFile} style={styles.input} />

        {uploadProgress > 0 && (
  <p style={styles.progressText}>
    Uploading film: {uploadProgress}%
  </p>
)}

<button type="submit" style={styles.submit} disabled={submitting}>
  {submitting ? `Submitting... ${uploadProgress}%` : "Submit Film"}
</button>
      </form>
    </div>
  );
}

const styles = {
  container: { background: "#000", color: "white", minHeight: "100vh", padding: "80px" },
  note: { color: "#bbb", maxWidth: "760px", marginBottom: "30px" },
  form: { maxWidth: "560px", display: "flex", flexDirection: "column", gap: "10px" },
  label: { marginTop: "8px", color: "#ddd" },
  input: { padding: "10px", border: "none" },
  textarea: { padding: "10px", border: "none", height: "120px" },
  submit: { background: "#e50914", border: "none", padding: "12px", color: "white" },

  posterNote: {
    color: "#aaa",
    fontSize: "14px",
    lineHeight: "1.5",
    marginTop: "0",
    marginBottom: "8px"
  },

  progressText: {
    color: "#00ffae",
    fontSize: "14px",
    marginTop: "8px",
    marginBottom: "8px"
  }
};

export default SubmitFilm;