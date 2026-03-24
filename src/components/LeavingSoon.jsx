import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function LeavingSoon() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadLeavingSoon();

    const interval = setInterval(() => {
      loadLeavingSoon();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function loadLeavingSoon() {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live")
      .gt("contract_expires_at", now)
      .order("contract_expires_at", { ascending: true });

    if (error) {
      console.log("Leaving soon films error:", error);
      return;
    }

    const currentTime = new Date();

    const leavingSoonFilms = (data || []).filter((film) => {
      if (!film.contract_expires_at) return false;

      const expiry = new Date(film.contract_expires_at);
      const msLeft = expiry - currentTime;

      return msLeft > 0 && msLeft <= 7 * 24 * 60 * 60 * 1000;
    });

    setMovies(leavingSoonFilms);
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Leaving Soon</h2>

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
    padding: "80px"
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

export default LeavingSoon;