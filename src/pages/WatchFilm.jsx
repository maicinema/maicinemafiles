import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function WatchFilm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);

  useEffect(() => {
    checkAccess();
    loadFilm();
  }, []);

  // ✅ CHECK PAYMENT ACCESS
 // ✅ CHECK PAYMENT ACCESS
async function checkAccess() {
  const user = JSON.parse(localStorage.getItem("maicinemaUser"));

  if (!user) {
    navigate(`/createaccount?filmId=${id}`);
    return;
  }

  const now = new Date().toISOString();

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("user_email", user.email)
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
    <div style={styles.container}>
      <h1>{film.title}</h1>

      <video
        controls
        autoPlay
        style={styles.video}
        src={film.video || film.video_url}
      />
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