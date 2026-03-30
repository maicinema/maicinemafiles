import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RENT_PRICE } from "../config/pricing";

function parseTimeToSeconds(time) {
  if (!time) return 0;

  if (typeof time === "number") return time;

  const parts = time.split(":");
  if (parts.length !== 2) return 0;

  const minutes = Number(parts[0]);
  const seconds = Number(parts[1]);

  return minutes * 60 + seconds;
}

function MovieCard({ movie }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();

 const startPreview = () => {
  const video = videoRef.current;
  if (!video || !movie.video) return;

  const startTime = parseTimeToSeconds(movie.previewStart);
  const duration = parseTimeToSeconds(movie.previewDuration || "00:10");

  video.currentTime = startTime;

  video.muted = false;
  video.volume = 1;

  video.play().catch(() => {});

  video.ontimeupdate = () => {
    if (video.currentTime >= startTime + duration) {
      video.pause();
      video.ontimeupdate = null;
    }
  };
};


  const stopPreview = () => {
  const video = videoRef.current;
  if (!video) return;

  video.pause();
  video.currentTime = 0;

  video.removeAttribute("src");
  video.load();
  video.src = video.getAttribute("data-src");
};

 const handleClick = () => {
  const user = localStorage.getItem("maicinemaUser");

  if (!user) {
    navigate(`/createaccount?filmId=${movie.id}`);
    return;
  }

  navigate(`/rent/${movie.id}`);
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
      onMouseEnter={startPreview}  // ✅ faster than onMouseEnter
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
  data-src={movie.video}
  poster={movie.poster}
  style={styles.image}
  preload="metadata"
  playsInline
  muted   // 🔥 helps instant start
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