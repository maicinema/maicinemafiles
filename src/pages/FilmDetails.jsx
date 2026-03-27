import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    loadFilm();
  }, [id]);

  async function loadFilm() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("id", id)
      .single();

    setFilm(data);
  }

  if (!film) return <div style={{ color: "white" }}>Loading...</div>;

  /* 🎬 STRUCTURED DATA (POWER MOVE) */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": film.title,
    "image": film.poster_url,
    "description": film.description,
    "genre": film.genre,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": film.rating || "4.5",
      "reviewCount": film.views || "100"
    }
  };

  return (
    <div style={{ background: "#000", color: "white", padding: "40px" }}>

      {/* ✅ GOOGLE WILL READ THIS */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <h1>{film.title}</h1>

      <img
        src={film.poster_url}
        alt={film.title}
        style={{ width: "300px", borderRadius: "8px" }}
      />

      <p>{film.description}</p>
      <p>{film.genre} • {film.rating}</p>
      <p>👁 {film.views} views</p>

    </div>
  );
}

export default FilmDetails;