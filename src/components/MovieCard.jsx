import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RENT_PRICE } from "../config/pricing";

function MovieCard({ movie }) {
  const videoRef = useRef(null);
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !movie.video) return;

    hoverTimeout.current = setTimeout(() => {
      video.currentTime = movie.previewStart || 0;
      video.muted = true; // ✅ required for autoplay
      video.play().catch(() => {});
    }, 500); // 🎬 Netflix-style delay
  };

  const stopPreview = () => {
    const video = videoRef.current;

    // cancel delayed play if user leaves early
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    if (video) {
      video.pause();
      video.currentTime = 0;

      // 🔥 FORCE POSTER BACK (fix black frame)
      video.load();
    }
  };

  const handleClick = () => {
    navigate(`/film/${movie.id}`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster,
    description: movie.description,
    genre: movie.genre,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.rating || "4.5",
      reviewCount: movie.views || "100"
    }
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={handleClick}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {movie.video ? (
        <video
          ref={videoRef}
          src={movie.video}
          poster={movie.poster}
          style={styles.image}
          preload="metadata"
          playsInline
          muted
        />
      ) : (
        <img
          src={movie.poster}
          alt={movie.title}
          style={styles.image}
          loading="lazy"
        />
      )}

      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>

        <p style={styles.meta}>
          {movie.genre} • {movie.rating}
        </p>

        <p style={styles.desc}>{movie.description}</p>

        <p style={styles.views}>👁 {movie.views} views</p>

        <div style={styles.actions}>
          <button style={styles.watchlist}>+ Watchlist</button>
          <span style={styles.price}>Rent ${RENT_PRICE}</span>
        </div>
      </div>
    </div>
  );
}
const styles = {
  card: {
    width: "100%",
    maxWidth: "300px",
    background: "#111",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s",
    position: "relative"
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover"
  },

  info: {
    padding: "12px"
  },

  title: {
    color: "white",
    margin: 0,
    fontSize: "16px"
  },

  meta: {
    color: "#bbb",
    fontSize: "13px"
  },

  desc: {
    color: "#888",
    fontSize: "13px"
  },

  views: {
    color: "#aaa",
    fontSize: "12px"
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  watchlist: {
    background: "transparent",
    border: "1px solid #e50914",
    color: "#e50914",
    padding: "4px 10px",
    cursor: "pointer"
  },

  price: {
    color: "#00ffae",
    fontWeight: "bold"
  }
};

export default MovieCard;