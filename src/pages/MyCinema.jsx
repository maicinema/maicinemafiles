import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import { supabase } from "../lib/supabase";

function MyCinema() {
  const [films, setFilms] = useState([]);
  const [rows, setRows] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    loadFilms();
  }, []);

  useEffect(() => {
    if (films.length > 0) {
      const shuffled = shuffleArray([...films]);
      setRows(chunkArray(shuffled, 10));
    }
  }, [films]);

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
      .select("*") // ✅ FIXED
      .eq("status", "live");

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setFilms(data || []);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const bannerFilm = films[currentBanner];

  const scroll = (index, direction) => {
    const ref = rowRefs.current[index];
    if (!ref) return;

    ref.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth"
    });
  };

  return (
    <div style={styles.page}>
      {errorMessage && <p>{errorMessage}</p>}

      {/* BANNER */}
      {bannerFilm && (
        <div
          style={{
            ...styles.banner,
            backgroundImage: `url(${bannerFilm.poster || ""})` // ✅ FIXED
          }}
          onMouseEnter={() => {
            const video = videoRef.current;
            if (video && bannerFilm.video) { // ✅ FIXED
              video.currentTime = 14;
              video.muted = false;
              video.volume = 1;
              video.play().catch(() => {});
            }
          }}
          onMouseLeave={() => {
            const video = videoRef.current;
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }}
        >
          {bannerFilm.video && ( // ✅ FIXED
            <video
              ref={videoRef}
              src={bannerFilm.video} // ✅ FIXED
              poster={bannerFilm.poster} // ✅ FIXED
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

      {/* ROWS */}
      <div style={styles.gridSection}>
        <h2 style={styles.heading}>MyCinema</h2>

        {rows.map((row, index) => (
          <div key={index} style={styles.wrapper}>
            <button
              style={styles.arrowLeft}
              onClick={() => scroll(index, "left")}
            >
              ◀
            </button>

            <div
              style={styles.row}
              ref={(el) => (rowRefs.current[index] = el)}
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const movie = row[i];

                return movie ? (
                  <div key={movie.id} style={styles.cardWrap}>
                    <MovieCard
                      movie={{
                        ...movie,
                        video: movie.video,   // ✅ FIXED
                        poster: movie.poster  // ✅ FIXED
                      }}
                    />
                  </div>
                ) : (
                  <div key={i} style={styles.skeleton} />
                );
              })}
            </div>

            <button
              style={styles.arrowRight}
              onClick={() => scroll(index, "right")}
            >
              ▶
            </button>
          </div>
        ))}
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
    fontSize: "48px"
  },

  gridSection: {
    padding: "20px"
  },

  heading: {
    marginBottom: "20px"
  },

  wrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },

  row: {
    display: "flex",
    gap: "16px",
    overflowX: "auto"
  },

  cardWrap: {
    flex: "0 0 auto",
    width: "220px"
  },

  skeleton: {
    width: "220px",
    height: "150px",
    background: "#222",
    borderRadius: "6px"
  },

  arrowLeft: {
    position: "absolute",
    left: 0,
    zIndex: 10,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    height: "100%",
    width: "40px",
    cursor: "pointer"
  },

  arrowRight: {
    position: "absolute",
    right: 0,
    zIndex: 10,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    height: "100%",
    width: "40px",
    cursor: "pointer"
  }
};

export default MyCinema;