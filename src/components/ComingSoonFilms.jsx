import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function ComingSoonFilms() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadComingSoon();

    const interval = setInterval(() => {
      loadComingSoon();
    }, 1000);

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

    setMovies(data || []);
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Coming Soon</h2>

      <div style={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              ...movie,
              image: movie.poster
            }}
          />
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
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px"
  }
};

export default ComingSoonFilms;