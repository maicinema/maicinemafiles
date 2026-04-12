import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

/* ✅ TIME PARSER (SAME AS DESKTOP) */
function parseTimeToSeconds(time) {
  if (!time) return 0;
  if (typeof time === "number") return time;

  const parts = time.split(":");
  if (parts.length !== 2) return 0;

  return Number(parts[0]) * 60 + Number(parts[1]);
}

function MyCinemaMobile({ films }) {
    const navigate = useNavigate();
const { user, loading } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerVideoRef = useRef(null);

  /* ✅ BANNER AUTO ROTATE */
  useEffect(() => {
    if (films.length < 2) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % films.length);
    }, 25000);

    return () => clearInterval(interval);
  }, [films]);

  const bannerFilm = films[currentBanner];

  /* ✅ BANNER PREVIEW (TOUCH) */
  const startBannerPreview = () => {
    const video = bannerVideoRef.current;
    if (!video || !bannerFilm?.video_url) return;

    const startTime = parseTimeToSeconds(
      bannerFilm.previewStart || "00:00"
    );
    const duration = parseTimeToSeconds(
      bannerFilm.previewDuration || "00:10"
    );

    video.src = bannerFilm.video_url;
    video.load();

    video.onloadeddata = () => {
      video.currentTime = startTime;
      video.muted = false;
      video.volume = 1;

      video.play().catch(() => {});

      video.ontimeupdate = () => {
        if (video.currentTime >= startTime + duration) {
          video.pause();
        }
      };
    };
  };

  const stopBannerPreview = () => {
    const video = bannerVideoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    video.onloadeddata = null;
    video.ontimeupdate = null;

    video.removeAttribute("src");
    video.load();
  };

  
  return (
    <div style={{ padding: "12px", background: "#000" }}>
      
      {/* ✅ BANNER */}
      {bannerFilm && (
        <div
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "8px",
            marginBottom: "16px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer"
          }}
          onClick={async () => {
  if (loading) return;

  if (!user) {
    navigate(`/createaccount?filmId=${bannerFilm.id}`);
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

  navigate(`/watch/${bannerFilm.id}`);
}}
          onTouchStart={startBannerPreview}
          onTouchEnd={stopBannerPreview}
          onTouchCancel={stopBannerPreview}
        >
          <video
            ref={bannerVideoRef}
            poster={bannerFilm.poster_url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            playsInline
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              background: "rgba(0,0,0,0.5)",
              padding: "10px"
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

/* ✅ MOBILE MOVIE CARD (FIXED PROPERLY) */
function MobileMovieCard({ movie }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !movie.video_url) return;

    const startTime = parseTimeToSeconds(movie.previewStart || "00:00");
    const duration = parseTimeToSeconds(movie.previewDuration || "00:10");

    video.src = movie.video_url;
    video.load();

    video.onloadeddata = () => {
      video.currentTime = startTime;
      video.muted = false;
      video.volume = 1;

      video.play().catch(() => {});

      video.ontimeupdate = () => {
        if (video.currentTime >= startTime + duration) {
          video.pause();
        }
      };
    };
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

  return (
    <div
      style={{ width: "100%", cursor: "pointer" }}
      onTouchStart={startPreview}
      onTouchEnd={stopPreview}
      onTouchCancel={stopPreview}
      onClick={handleClick}
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

/* ✅ ROW LOGIC */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default MyCinemaMobile;