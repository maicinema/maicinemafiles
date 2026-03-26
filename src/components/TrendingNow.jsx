import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { supabase } from "../lib/supabase";

function TrendingNow() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadTrending();

    const interval = setInterval(() => {
      loadTrending();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadTrending() {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live")
      .order("views", { ascending: false });

    if (error) {
      console.log("Trending films error:", error);
      return;
    }

    const now = new Date();

    const publicFilms = (data || []).filter((film) => {
      if (!film.contract_expires_at) return true;
      return new Date(film.contract_expires_at) > now;
    });

    const topFive = publicFilms.slice(0, 5).map((film) => ({
      ...film,
      poster: film.poster_url,
      video: film.video_url,
      image: film.poster_url
    }));

    console.log("Trending top films:", topFive);
    setMovies(topFive);
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Trending Now</h2>

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
    overflowX: "auto",
    paddingBottom: "10px",
    scrollBehavior: "smooth"
  },

  cardWrap: {
    flex: "0 0 auto",
    width: "220px"
  }
};

export default TrendingNow;