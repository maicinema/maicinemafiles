import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import MyCinemaMobile from "./MyCinemaMobile";

function parseTimeToSeconds(time) {
  if (!time) return 0;

  if (typeof time === "number") return time;

  const parts = time.split(":");
  if (parts.length !== 2) return 0;

  const minutes = Number(parts[0]);
  const seconds = Number(parts[1]);

  return minutes * 60 + seconds;
}

function MyCinema() {
  const [films, setFilms] = useState([]);
  const [rows, setRows] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const { user, loading } = useAuth();

  const videoRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const rowRefs = useRef([]);

  useEffect(() => {
  loadFilms();

  // retry for mobile (very important)
  const timeout = setTimeout(() => {
    loadFilms();
  }, 2000);

  trackVisitor();

  const channel = supabase
    .channel("films-realtime-mycinema")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "films"
      },
      () => {
        loadFilms();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

useEffect(() => {
  const unlock = () => {
    setAudioUnlocked(true);
    window.removeEventListener("click", unlock);
    window.removeEventListener("scroll", unlock);
  };

  window.addEventListener("click", unlock);
  window.addEventListener("scroll", unlock);

  return () => {
    window.removeEventListener("click", unlock);
    window.removeEventListener("scroll", unlock);
  };
}, []);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkScreen(); // ✅ RUN ON LOAD

  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
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
    }, 25000);

    return () => clearInterval(bannerInterval);
  }, [films]);

  async function loadFilms() {
  try {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live");

    if (error) {
      console.log("SUPABASE ERROR:", error.message);
      setErrorMessage(error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("NO FILMS RETURNED");
    }

    const uniqueFilms = [...new Map((data || []).map(f => [f.id, f])).values()];

    console.log("FILMS LOADED:", uniqueFilms.length);

    setFilms(uniqueFilms);
  } catch (err) {
    console.log("LOAD FILMS CRASH:", err);
  }
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
  useEffect(() => {
  if (!bannerFilm?.video_url) return;

  const video = videoRef.current;
  if (!video) return;

  // preload quietly without showing frame
  video.src = bannerFilm.video_url;
  video.load();

  // immediately remove so poster stays visible
  setTimeout(() => {
    video.removeAttribute("src");
  }, 100);
}, [bannerFilm]);

useEffect(() => {
  if (!bannerFilm || !bannerFilm.video) return;

  const video = document.createElement("video");
  video.src = bannerFilm.video_url;
  video.preload = "metadata";
}, [bannerFilm]);

  const scroll = (index, direction) => {
    const ref = rowRefs.current[index];
    if (!ref) return;

    ref.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth"
    });
  };

async function trackVisitor() {
  try {
    await supabase.from("visitors").insert({});
  } catch (err) {
    console.log("Visitor tracking error", err);
  }
}

  // ✅ MOBILE
if (isMobile) {
  return <MyCinemaMobile films={films} />;
}

// ✅ DESKTOP (RESTORED)
return (
  <div style={styles.page}>
    {errorMessage && <p>{errorMessage}</p>}

    {/* BANNER */}
    {bannerFilm && (
      <div
        style={{
          ...styles.banner,
          backgroundImage: `url(${bannerFilm.poster_url || ""})`
        }}
      >
        <div style={styles.bannerOverlay}>
          <h1 style={styles.bannerTitle}>{bannerFilm.title}</h1>
          <p style={styles.bannerMeta}>
            {bannerFilm.genre} • {bannerFilm.rating}
          </p>
          <p style={styles.bannerDesc}>{bannerFilm.description}</p>
        </div>
      </div>
    )}

    {/* DESKTOP ROWS */}
    <div style={styles.gridSection}>
      <h2 style={styles.heading}>MyCinema</h2>

      {rows.map((row, index) => (
        <div key={index} style={styles.wrapper}>
          <div
            style={styles.row}
            ref={(el) => (rowRefs.current[index] = el)}
          >
            {row.map((movie) => (
              <div key={movie.id} style={styles.cardWrap}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
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
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
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
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  padding: "20px 12px",
  background: "#000"
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
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  paddingBottom: "10px"
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
  },

  mobileGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  width: "100%"
},

mobileCardWrap: {
  width: "100%"
},
};

export default MyCinema;