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
  }, []);

  useEffect(() => {
    if (films.length < 2) return;

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % films.length);
    }, 10000);

    return () => clearInterval(bannerInterval);
  }, [films]);

  async function loadFilms() {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live")
      .order("views", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setFilms(data || []);
  }

  // ✅ SAME PREVIEW TIMING AS CARD (14s)
  useEffect(() => {
    const video = videoRef.current;
    const film = films[currentBanner];

    if (video && film?.video_url) {
      video.currentTime = 14;
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    }
  }, [currentBanner, films]);

  const bannerFilm = films[currentBanner];

  return (
    <div style={styles.page}>
      {errorMessage && <p>{errorMessage}</p>}

      {bannerFilm && (
        <div
          style={{
            ...styles.banner,
            backgroundImage: `url(${bannerFilm.poster_url || ""})`
          }}
        >
          {bannerFilm.video_url && (
            <video
              ref={videoRef}
              src={bannerFilm.video_url}
              style={styles.bannerVideo}
              loop
              playsInline
            />
          )}

          <div style={styles.bannerOverlay}>
            <h1 style={styles.bannerTitle}>{bannerFilm.title}</h1>

            <p style={styles.bannerMeta}>
              {bannerFilm.genre} • {bannerFilm.rating}
            </p>

            <p style={styles.bannerDesc}>{bannerFilm.description}</p>
          </div>
        </div>
      )}

      <div style={styles.gridSection}>
        <h2 style={styles.heading}>MyCinema</h2>

        <div style={styles.grid}>
          {films.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                ...movie,
                video: movie.video_url,
                poster: movie.poster_url
              }}
            />
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

  bannerTitle: {
    fontSize: "48px",
    margin: 0
  },

  bannerMeta: {
    color: "#ccc",
    fontSize: "16px",
    marginTop: "10px"
  },

  bannerDesc: {
    color: "#aaa",
    marginTop: "10px",
    lineHeight: "1.5"
  },

  gridSection: {
    padding: "80px"
  },

  heading: {
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px"
  }
};

export default MyCinema;