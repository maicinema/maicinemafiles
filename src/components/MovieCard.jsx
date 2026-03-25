import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import { supabase } from "../lib/supabase";

function MyCinema() {
  const [films, setFilms] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    loadFilms();

    const refreshInterval = setInterval(() => {
      loadFilms();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (films.length < 2) return;

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % films.length);
    }, 10000);

    return () => clearInterval(bannerInterval);
  }, [films.length]);

  // ✅ Unlock sound after user interaction
  useEffect(() => {
    const enableSound = () => {
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.volume = 1;
      }
    };

    window.addEventListener("click", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
    };
  }, []);

  async function loadFilms() {
    setErrorMessage("");

    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live")
      .order("views", { ascending: false });

    if (error) {
      setErrorMessage(error.message || "Failed to load films");
      return;
    }

    const now = new Date();

    const publicFilms = (data || []).filter((film) => {
      if (!film.contract_expires_at) return true;
      return new Date(film.contract_expires_at) > now;
    });

    setFilms(publicFilms);
  }

  const checkAccess = async (filmId) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return false;

    const { data } = await supabase
      .from("rentals")
      .select("*")
      .eq("user_id", user.id)
      .eq("film_id", filmId)
      .gt("expires_at", new Date().toISOString());

    return data && data.length > 0;
  };

  useEffect(() => {
    const bannerFilm = films[currentBanner];
    if (!bannerFilm) return;

    const runCheck = async () => {
      const access = await checkAccess(bannerFilm.id);
      setHasAccess(access);
    };

    runCheck();
  }, [films, currentBanner]);

  const handleRent = async () => {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: "3.00"
        })
      });

      const data = await res.json();

      const approveLink = data.links?.find(
        (link) => link.rel === "approve"
      );

      if (approveLink) {
        window.location.href = approveLink.href;
      } else {
        alert("Payment link not found");
      }
    } catch {
      alert("Payment failed");
    }
  };

  const bannerFilm = films[currentBanner];

  return (
    <div style={styles.page}>
      {errorMessage && (
        <div style={styles.messageBox}>
          <h2>{errorMessage}</h2>
        </div>
      )}

      {bannerFilm && (
        <div
          style={{
            ...styles.banner,
            backgroundImage: `url(${bannerFilm.poster_url})`
          }}
        >
          {/* ✅ Banner video from film */}
          {bannerFilm.video_url && (
            <video
              ref={videoRef}
              src={bannerFilm.video_url}
              style={{ ...styles.bannerVideo, opacity: 1 }}
              autoPlay
              loop
              muted
              playsInline
            />
          )}

          <div style={styles.bannerOverlay}>
            <h1>{bannerFilm.title}</h1>

            <p>
              {bannerFilm.genre} • {bannerFilm.rating}
            </p>

            <p>{bannerFilm.description}</p>

            {!hasAccess && (
              <button style={styles.payButton} onClick={handleRent}>
                Rent Film (48h)
              </button>
            )}

            {hasAccess && (
              <p style={{ color: "#10b981" }}>
                You have access to this film
              </p>
            )}
          </div>
        </div>
      )}

      <div style={styles.gridSection}>
        <h2>MyCinema</h2>

        <div style={styles.grid}>
          {films.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "white",
    minHeight: "100vh"
  },
  messageBox: {
    padding: "100px"
  },
  banner: {
    height: "500px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  bannerVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  bannerOverlay: {
    position: "relative",
    paddingLeft: "80px",
    maxWidth: "600px",
    zIndex: 2
  },
  payButton: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#ffc439",
    color: "#000",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  },
  gridSection: {
    padding: "80px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px"
  }
};

export default MyCinema;