import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RENT_PRICE } from "../config/pricing";

function MovieCard({ movie }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const startPreview = () => {
    const video = videoRef.current;

    if (video && movie.video_url) {
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {});
    }
  };

  const stopPreview = () => {
    const video = videoRef.current;

    if (video && movie.video_url) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleClick = () => {
    navigate("/create-account", {
      state: {
        type: "rent",
        title: movie.title,
        price: RENT_PRICE
      }
    });
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={handleClick}
    >
      {movie.video_url ? (
        <video
          ref={videoRef}
          src={movie.video_url}
          poster={movie.poster_url}
          style={styles.image}
          muted
          playsInline
        />
      ) : (
        <img
          src={movie.poster_url}
          alt={movie.title}
          style={styles.image}
        />
      )}

      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>

        <p style={styles.meta}>
          {movie.genre} • {movie.rating}
        </p>

        <p style={styles.views}>👁 {movie.views} views</p>

        <div style={styles.actions}>
          <button
            style={styles.watchlist}
            onClick={(e) => {
              e.stopPropagation();
              alert("Added to Watchlist");
            }}
          >
            + Watchlist
          </button>

          <span style={styles.price}>Rent ${RENT_PRICE}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "220px", // ✅ FIXED SIZE
    background: "#111",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s ease"
  },

  image: {
    width: "100%",
    height: "130px", // ✅ SMALLER HEIGHT
    objectFit: "cover",
    display: "block"
  },

  info: {
    padding: "10px"
  },

  title: {
    color: "white",
    fontSize: "16px",
    margin: "0 0 5px 0"
  },

  meta: {
    color: "#bbb",
    fontSize: "12px"
  },

  views: {
    color: "#888",
    fontSize: "11px"
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px"
  },

  watchlist: {
    background: "transparent",
    border: "1px solid #e50914",
    color: "#e50914",
    padding: "3px 8px",
    fontSize: "11px",
    cursor: "pointer"
  },

  price: {
    color: "#00ffae",
    fontWeight: "bold",
    fontSize: "12px"
  }
};

export default MovieCard;