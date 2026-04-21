import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

/* -------------------- PHASE 1 SMART ORDER HELPERS -------------------- */

function getPrimaryGenre(genreValue) {
  if (!genreValue) return "other";

  return String(genreValue)
    .split(",")[0]
    .trim()
    .toLowerCase() || "other";
}

function getFreshnessScore(createdAt) {
  if (!createdAt) return 0;

  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime)) return 0;

  const now = Date.now();
  const diffDays = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return 35;
  if (diffDays <= 30) return 25;
  if (diffDays <= 60) return 18;
  if (diffDays <= 120) return 10;

  return 0;
}

function getLowViewsBoost(views) {
  const safeViews = Number(views) || 0;

  if (safeViews <= 5) return 50;
  if (safeViews <= 15) return 38;
  if (safeViews <= 30) return 26;
  if (safeViews <= 60) return 14;
  if (safeViews <= 100) return 8;

  return 0;
}

function getBaseFilmScore(film) {
  const lowViewsBoost = getLowViewsBoost(film.views);
  const freshnessScore = getFreshnessScore(film.created_at);

  return lowViewsBoost + freshnessScore;
}

function buildSmartFilmOrder(films) {
  if (!Array.isArray(films) || films.length === 0) return [];

  const scoredFilms = films
    .map((film) => ({
      ...film,
      __score: getBaseFilmScore(film),
      __primaryGenre: getPrimaryGenre(film.genre)
    }))
    .sort((a, b) => {
      if (b.__score !== a.__score) return b.__score - a.__score;

      const aViews = Number(a.views) || 0;
      const bViews = Number(b.views) || 0;
      if (aViews !== bViews) return aViews - bViews;

      const aCreated = new Date(a.created_at || 0).getTime();
      const bCreated = new Date(b.created_at || 0).getTime();
      return bCreated - aCreated;
    });

  const groups = {};
  scoredFilms.forEach((film) => {
    const key = film.__primaryGenre || "other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(film);
  });

  const genreKeys = Object.keys(groups).sort((a, b) => {
    const aTop = groups[a][0]?.__score || 0;
    const bTop = groups[b][0]?.__score || 0;
    return bTop - aTop;
  });

  const ordered = [];
  let hasMore = true;

  while (hasMore) {
    hasMore = false;

    genreKeys.forEach((genreKey) => {
      if (groups[genreKey] && groups[genreKey].length > 0) {
        ordered.push(groups[genreKey].shift());
        hasMore = true;
      }
    });
  }

  return ordered.map(({ __score, __primaryGenre, ...film }) => film);
}

function chunkArray(array, size) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/* -------------------------------------------------------------------- */

function MyCinema() {
  const [films, setFilms] = useState([]);
  const [rows, setRows] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const rowRefs = useRef([]);

  useEffect(() => {
    loadFilms();

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
      clearTimeout(timeout);
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

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const orderedFilms = useMemo(() => {
    return buildSmartFilmOrder(films);
  }, [films]);

  useEffect(() => {
    if (orderedFilms.length > 0) {
      setRows(chunkArray(orderedFilms, 10));
    } else {
      setRows([]);
    }
  }, [orderedFilms]);

  const bannerFilms = useMemo(() => {
    return orderedFilms.slice(0, 5);
  }, [orderedFilms]);

  useEffect(() => {
    if (bannerFilms.length < 2) return;

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerFilms.length);
    }, 25000);

    return () => clearInterval(bannerInterval);
  }, [bannerFilms]);

  useEffect(() => {
    if (currentBanner >= bannerFilms.length) {
      setCurrentBanner(0);
    }
  }, [bannerFilms, currentBanner]);

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

      const uniqueFilms = [...new Map((data || []).map((f) => [f.id, f])).values()];

      console.log("FILMS LOADED:", uniqueFilms.length);

      setFilms(uniqueFilms);
    } catch (err) {
      console.log("LOAD FILMS CRASH:", err);
    }
  }

  const bannerFilm = bannerFilms[currentBanner];

  useEffect(() => {
    if (!bannerFilm?.video_url) return;

    const video = videoRef.current;
    if (!video) return;

    video.src = bannerFilm.video_url;
    video.load();

    setTimeout(() => {
      video.removeAttribute("src");
    }, 100);
  }, [bannerFilm]);

  useEffect(() => {
    if (!bannerFilm?.video_url) return;

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

  async function handleFilmClick(film) {
    if (loading) return;

    if (!user) {
      navigate(`/createaccount?filmId=${film.id}`);
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
      navigate(`/subscribe`);
      return;
    }

    navigate(`/watch/${film.id}`);
  }

  async function trackVisitor() {
    try {
      await supabase.from("visitors").insert({});
    } catch (err) {
      console.log("Visitor tracking error", err);
    }
  }

  if (isMobile) {
    return <MyCinemaMobile films={orderedFilms} />;
  }

  return (
    <div style={styles.page}>
      {errorMessage && <p>{errorMessage}</p>}

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
          }}
          onMouseEnter={() => {
            const video = videoRef.current;
            if (!video || !bannerFilm.video_url) return;

            const startTime = parseTimeToSeconds(
              bannerFilm.previewStart || "00:00"
            );
            const duration = parseTimeToSeconds(
              bannerFilm.previewDuration || "00:10"
            );

            video.src = bannerFilm.video_url;
            video.load();

            video.onloadeddata = () => {
              video.currentTime = startTime;
              video.muted = false;
              video.volume = 1;

              video.play().catch(() => {});

              video.ontimeupdate = () => {
                if (video.currentTime >= startTime + duration) {
                  video.pause();
                }
              };
            };
          }}
          onMouseLeave={() => {
            const video = videoRef.current;
            if (!video) return;

            video.pause();
            video.currentTime = 0;
            video.onloadeddata = null;
            video.ontimeupdate = null;
            video.removeAttribute("src");
            video.load();
          }}
        >
          {bannerFilm.video_url && (
            <video
              ref={videoRef}
              data-src={bannerFilm.video_url}
              poster={bannerFilm.poster_url}
              style={styles.bannerVideo}
              playsInline
              preload="auto"
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

        {rows.map((row, index) => (
          <div key={index} style={styles.wrapper}>
            <div
              style={styles.row}
              ref={(el) => (rowRefs.current[index] = el)}
            >
              {row.map((movie) => (
                <div key={movie.id} style={styles.cardWrap}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilmClick(movie);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <MovieCard movie={movie} />
                  </div>
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
  }
};

export default MyCinema;