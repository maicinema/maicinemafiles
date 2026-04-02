import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  // ✅ Load film
  useEffect(() => {
    loadFilm();
  }, [id]);

  async function loadFilm() {
    const { data } = await supabase
  .from("films")
  .select("id, title, description, poster_url, video_url, genre, rating, views")
  .eq("id", Number(id))
  .single();

console.log("NEW FILM DATA:", data) // 🔥 add this

    setFilm(data);
  }

  // ✅ SEO: Dynamic Title
  useEffect(() => {
    if (film) {
      document.title = `${film.title} | MaiCinema`;
    }
  }, [film]);

  useEffect(() => {
  const interval =setInterval(() => {
  loadFilm();
}, 10000); // every 10 seconds

  return () => clearInterval(interval);
}, []);

  // ✅ SEO: Dynamic Description
  useEffect(() => {
    if (film) {
      let meta = document.querySelector("meta[name='description']");

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }

      meta.setAttribute(
        "content",
        film.description || "Watch films on MaiCinema"
      );
    }
  }, [film]);

  if (!film) return <div style={{ color: "white" }}>Loading...</div>;

  // 🎬 STRUCTURED DATA
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: film.title,
    image: film.poster_url,
    description: film.description,
    genre: film.genre,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: film.rating || "4.5",
      reviewCount: film.views || "100"
    }
  };

  return (
    <div style={{ background: "#000", color: "white", padding: "40px" }}>
      
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <h1>{film.title}</h1>

     <img
  src={film.poster_url + "?t=" + Date.now()}
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