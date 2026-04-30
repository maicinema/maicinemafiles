import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function parseTimeToSeconds(time) {
  if (!time) return 0;
  if (typeof time === "number") return time;

  const parts = String(time).trim().split(":").map(Number);

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes || 0) * 60 + (seconds || 0);
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }

  return 0;
}

function MovieCard({ movie }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !movie.video_url) return;

    const startTime = parseTimeToSeconds(
  movie.preview_start || movie.previewStart || "00:00"
);

const previewEnd = parseTimeToSeconds(
  movie.preview_end || movie.previewEnd || ""
);

const previewDuration = parseTimeToSeconds(
  movie.preview_duration || movie.previewDuration || "00:10"
);

const endTime =
  previewEnd > startTime ? previewEnd : startTime + previewDuration;
  
    video.onloadeddata = null;
    video.onloadedmetadata = null;
    video.onseeked = null;
    video.ontimeupdate = null;

    if (!video.src) {
      video.src = movie.video_url;
      video.load();
    }

    const seekAndPlay = () => {
      video.currentTime = startTime;

      video.onseeked = () => {
        video.play().catch((err) => {
          console.log("Preview play error:", err);
        });

        video.ontimeupdate = () => {
          if (video.currentTime >= endTime) {
            video.pause();
            video.ontimeupdate = null;
            video.onseeked = null;
          }
        };
      };
    };

    if (video.readyState >= 1) {
      seekAndPlay();
    } else {
      video.onloadedmetadata = seekAndPlay;
    }
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.onloadeddata = null;
    video.ontimeupdate = null;
    video.removeAttribute("src");
    video.load();
  };

  const handleClick = async () => {
    if (loading) return;

    if (!user) {
      navigate(`/createaccount?filmId=${movie.id}`);
      return;
    }

    const now = new Date().toISOString();

    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const hasSubscription = data?.some(
      (p) => p.type === "subscription" && p.expires_at > now
    );

    if (!hasSubscription) {
      navigate(`/subscribe`);
      return;
    }

    navigate(`/watch/${movie.id}`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster_url,
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

      {movie.video_url ? (
        <video
          ref={videoRef}
          data-src={movie.video_url}
          poster={movie.poster_url ? movie.poster_url + "?t=" + Date.now() : ""}
          style={styles.image}
          preload="metadata"
          playsInline
        />
      ) : (
        <img
          src={movie.poster_url ? movie.poster_url + "?t=" + Date.now() : ""}
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
  }
};

export default MovieCard;