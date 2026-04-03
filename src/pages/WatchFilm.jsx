import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";


function WatchFilm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const [film, setFilm] = useState(null);
const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
  if (!loading) {
    checkAccess();
    loadFilm();
  }
}, [loading]);

  // ✅ CHECK PAYMENT ACCESS
 // ✅ CHECK PAYMENT ACCESS
async function checkAccess() {

    if (loading) return;

if (!user) {
  navigate(`/createaccount?filmId=${id}`);
  return;
}

  const now = new Date().toISOString();

  const { data } = await supabase
    .from("payments")
    .select("*")
   .eq("user_id", user.id)
    .eq("status", "completed");

  const validAccess = data?.some((p) => {
    // 🎬 RENT (48 hours)
    if (p.type === "rent" && p.film_id === id) {
      return p.expires_at > now;
    }

    // 🎟 SUBSCRIPTION (monthly)
    if (p.type === "subscription") {
      return p.expires_at > now;
    }

    return false;
  });

  if (!validAccess) {
    navigate(`/rent/${id}`);
  }
}

  // ✅ LOAD FILM FROM DATABASE
  async function loadFilm() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("id", id)
      .single();

    setFilm(data);
  }

  if (!film) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <div
  style={styles.container}
  onContextMenu={(e) => e.preventDefault()}
>
      <h1>{film.title}</h1>

      {film.video_url ? (
  <iframe
    src={film.video_url}
    style={styles.video}
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
    allowFullScreen
  />
) : (
  <p>Loading video...</p>
)}
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    paddingTop: "120px",
    textAlign: "center"
  },

  video: {
    width: "80%",
    maxWidth: "1000px",
    marginTop: "20px"
  }
};

export default WatchFilm;