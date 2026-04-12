import { useRef, useState } from "react";
import MovieCard from "../components/MovieCard";

function MyCinemaMobile({ films }) {
  const videoRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const bannerFilm = films[currentBanner];

  return (
    <div style={{ padding: "12px", background: "#000" }}>
      
      {/* ✅ BANNER */}
      {bannerFilm && (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundImage: `url(${bannerFilm.poster_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
            marginBottom: "16px",
            position: "relative"
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.5)",
              height: "100%",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            <h2 style={{ color: "white", margin: 0 }}>
              {bannerFilm.title}
            </h2>
          </div>
        </div>
      )}

      {/* ✅ TITLE */}
      <h2 style={{ color: "white", marginBottom: "12px" }}>
        MyCinema
      </h2>

      {/* ✅ ROW SYSTEM (LIKE DESKTOP) */}
      {chunkArray(films, 10).map((row, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          {row.map((movie) => (
            <div key={movie.id} style={{ flex: "0 0 140px" }}>
              <MobileMovieCard movie={movie} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ✅ MOBILE CARD WITH TOUCH PREVIEW */
function MobileMovieCard({ movie }) {
  const videoRef = useRef(null);

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !movie.video_url) return;

    video.src = movie.video_url;
    video.currentTime = 5;
    video.muted = false;
    video.play().catch(() => {});
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      style={{
        width: "100%",
        cursor: "pointer"
      }}
      onTouchStart={startPreview}
      onTouchEnd={stopPreview}
    >
      {movie.video_url ? (
        <video
          ref={videoRef}
          poster={movie.poster_url}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "6px"
          }}
          playsInline
        />
      ) : (
        <img
          src={movie.poster_url}
          alt={movie.title}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "6px"
          }}
        />
      )}
    </div>
  );
}

/* ✅ SAME LOGIC AS DESKTOP */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default MyCinemaMobile;