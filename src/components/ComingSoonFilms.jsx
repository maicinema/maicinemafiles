import { useEffect, useState, useRef } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function ComingSoonFilms() {
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadComingSoon();
  }, []);

  async function loadComingSoon() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("status", "coming_soon")
      .order("id", { ascending: false });

    const formatted = (data || []).map((film) => ({
      ...film,
      poster: film.poster_url,
      video: film.video_url
    }));

    setMovies(formatted);
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
      <h2 style={styles.heading}>Coming Soon</h2>

      <div style={styles.wrapper}>
        <button style={styles.arrowLeft} onClick={() => scroll("left")}>
          ◀
        </button>

        <div style={styles.grid} ref={scrollRef}>
          {Array.from({ length: 10 }).map((_, i) => {
            const movie = movies[i];

            return movie ? (
              <div key={movie.id} style={styles.cardWrap}>
                <MovieCard movie={movie} />
              </div>
            ) : (
              <div key={i} style={styles.skeleton} />
            );
          })}
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
    overflowX: "auto",
    scrollBehavior: "smooth"
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
    fontSize: "20px",
    cursor: "pointer",
    height: "100%",
    width: "40px"
  },

  arrowRight: {
    position: "absolute",
    right: 0,
    zIndex: 10,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    height: "100%",
    width: "40px"
  }
};

export default ComingSoonFilms;