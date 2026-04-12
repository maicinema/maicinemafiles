import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function WatchFilm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const [film, setFilm] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!loading) {
      checkAccess();
    }
  }, [loading]);

  // ✅ FINAL ACCESS CONTROL (ONLY SOURCE OF TRUTH)
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

    const validSubscription = data?.some(
      (p) => p.type === "subscription" && p.expires_at > now
    );

    if (!validSubscription) {
      setHasAccess(false);
      setCheckingAccess(false);
      return;
    }

    setHasAccess(true);
    setCheckingAccess(false);
    loadFilm();
  }

  // ✅ LOAD FILM ONLY IF AUTHORIZED
  async function loadFilm() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("id", id)
      .single();

    setFilm(data);
  }

  // ⏳ While checking access
  if (checkingAccess) {
    return <div style={{ color: "white" }}>Checking access...</div>;
  }

  // ❌ No access UI (NO redirect loop, cleaner UX)
  if (!hasAccess) {
    return (
      <div style={styles.container}>
        <h2>Subscribe to watch this film</h2>
        <button onClick={() => navigate("/subscribe")}>
          Subscribe Now
        </button>
      </div>
    );
  }

  // ⏳ Loading film
  if (!film) {
    return <div style={{ color: "white" }}>Loading film...</div>;
  }

  // ✅ FINAL PLAYER (ONLY SHOWN IF AUTHORIZED)
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