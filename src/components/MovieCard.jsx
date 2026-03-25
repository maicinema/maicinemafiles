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

      // Start muted (browser allows autoplay)
      video.muted = true;

      video.play()
        .then(() => {
          // Then unmute after play starts
          setTimeout(() => {
            video.muted = false;
            video.volume = 1;
          }, 300);
        })
        .catch(() => {});
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
      onMouseEnter={(e) => {
        startPreview();
        e.currentTarget.style.transform = "scale(1.15)";
      }}
      onMouseLeave={(e) => {
        stopPreview();
        e.currentTarget.style.transform = "scale(1)";
      }}
      onClick={handleClick}
    >
      {movie.video_url ? (
        <video
          ref={videoRef}
          src={movie.video_url}
          poster={movie.poster_url}
          style={styles.image}
          preload="auto"
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

        <p style={styles.desc}>{movie.description}</p>

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
    width: "260px",
    background: "#111",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s",
    position: "relative"
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    display: "block"
  },

  info: {
    padding: "12px"
  },

  title: {
    color: "white",
    margin: "0"
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