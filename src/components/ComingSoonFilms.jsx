import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function ComingSoonFilms() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadComingSoon();

    const interval = setInterval(() => {
      loadComingSoon();
    }, 5000); // ✅ not too fast

    return () => clearInterval(interval);
  }, []);

  async function loadComingSoon() {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "coming_soon")
      .order("id", { ascending: false });

    if (error) {
      console.log("Coming soon films error:", error);
      return;
    }

    const mapped = (data || []).map((film) => ({
      ...film,
      poster: film.poster_url,
      video: film.video_url,
      image: film.poster_url
    }));

    setMovies(mapped);
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Coming Soon</h2>

      <div style={styles.grid}>
        {movies.map((movie) => (
          <div key={movie.id} style={styles.cardWrap}>
            <MovieCard movie={movie} />
          </div>
        ))}
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

  grid: {
    display: "flex",
    gap: "16px",
    overflowX: "auto", // ✅ horizontal scroll
    overflowY: "hidden",
    paddingBottom: "10px",
    scrollBehavior: "smooth"
  },

  cardWrap: {
    flex: "0 0 auto",
    width: "220px"
  }
};

export default ComingSoonFilms;