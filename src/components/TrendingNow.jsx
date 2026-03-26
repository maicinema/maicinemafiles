import { useEffect, useState, useRef } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function TrendingNow() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadTrending();
  }, []);

  async function loadTrending() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live")
      .order("views", { ascending: false });

    const top = (data || []).slice(0, 10).map((film) => ({
      ...film,
      poster: film.poster_url,
      video: film.video_url
    }));

    setMovies(top);
    setLoading(false); // ✅ done loading
  }

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth"
    });
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Trending Now</h2>

      <div style={styles.wrapper}>
        <button style={styles.arrowLeft} onClick={() => scroll("left")}>
          ◀
        </button>

        <div style={styles.grid} ref={scrollRef}>
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={styles.skeleton} />
              ))
            : movies.map((movie) => (
                <div key={movie.id} style={styles.cardWrap}>
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>

        <button style={styles.arrowRight} onClick={() => scroll("right")}>
          ▶
        </button>
      </div>
    </div>
  );
}

const styles = {
  section: {
    background: "black",
    padding: "20px"
  },

  heading: {
    color: "white",
    marginBottom: "20px"
  },

  wrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  grid: {
    display: "flex",
    gap: "16px",
    overflowX: "auto"
  },

  cardWrap: {
    flex: "0 0 auto",
    width: "220px"
  },

  /* ✅ SKELETON */
  skeleton: {
    width: "220px",
    height: "150px",
    background: "#222",
    borderRadius: "6px",
    animation: "pulse 1.5s infinite"
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

export default TrendingNow;