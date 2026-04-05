import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
  const [errorMessage, setErrorMessage] = useState("");
const { user, loading } = useAuth();

  const videoRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const rowRefs = useRef([]);

  useEffect(() => {
  loadFilms();
  trackVisitor(); // ✅ MOVE HERE

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

    setFilms([...new Map((data || []).map(f => [f.id, f])).values()]);
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

  return (
    <div style={styles.page}>
      {errorMessage && <p>{errorMessage}</p>}

      {/* BANNER */}
      {bannerFilm && (
       <div
  style={{
    ...styles.banner,
    cursor: "pointer",
   backgroundImage: `url(${bannerFilm.poster_url || ""})`
  }}

  onClick={async () => {

  if (loading) return;

  if (!user) {
    window.location.href = `/createaccount?filmId=${bannerFilm.id}`;
    return;
  }

  const now = new Date().toISOString();

  const { data } = await supabase
  .from("payments")
  .select("*")
  .eq("user_id", user.id)
  .eq("status", "completed");

const hasSubscription = data?.some(
  (p) => p.type === "subscription" && p.expires_at > now
);

if (!hasSubscription) {
  window.location.href = `/subscribe`;
  return;
}

window.location.href = `/watch/${bannerFilm.id}`;

  if (!hasAccess) {
    window.location.href = `/rent/${bannerFilm.id}`;
    return;
  }

  window.location.href = `/watch/${bannerFilm.id}`;
  }}


  onMouseEnter={() => {
  const video = videoRef.current;
  if (!video || !bannerFilm.video_url) return;

  const startTime = parseTimeToSeconds(bannerFilm.previewStart || "00:00");
  const duration = parseTimeToSeconds(bannerFilm.previewDuration || "00:10");

  // ✅ clear old events
  video.onloadeddata = null;
  video.ontimeupdate = null;

  const playPreview = () => {
    video.currentTime = startTime;

    video.muted = false;
    video.volume = 1;

    video.play().catch(() => {});

    video.ontimeupdate = () => {
      if (video.currentTime >= startTime + duration) {
        video.pause();
        video.ontimeupdate = null;
      }
    };
  };

  // ✅ instant if ready, else wait
  if (video.readyState >= 2) {
    playPreview();
  } else {
    video.onloadeddata = playPreview;
  }
}}

  onMouseLeave={() => {
  const video = videoRef.current;
  if (!video) return;

  video.pause();
  video.currentTime = 0;

  video.onloadeddata = null;
  video.ontimeupdate = null;
}}
>
  {bannerFilm.video && (
   <video
  ref={videoRef}
  data-src={bannerFilm.video_url}
  poster={bannerFilm.poster_url}
  style={styles.bannerVideo}
  playsInline
  preload="metadata"
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
                    <MovieCard movie={movie} />
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