import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function parseTimeToSeconds(time) {
  if (!time) return 0;
  if (typeof time === "number") return time;

  const parts = String(time).split(":");
  if (parts.length !== 2) return 0;

  return Number(parts[0]) * 60 + Number(parts[1]);
}

function getPreviewTimes(film) {
  const startTime = parseTimeToSeconds(
    film.previewStart || film.preview_start || "00:00"
  );

  const previewEnd = parseTimeToSeconds(
    film.previewEnd || film.preview_end || ""
  );

  const previewDuration = parseTimeToSeconds(
    film.previewDuration || film.preview_duration || "00:10"
  );

  const endTime =
    previewEnd > startTime ? previewEnd : startTime + previewDuration;

  return { startTime, endTime };
}

function MyCinemaMobile({ films }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerVideoRef = useRef(null);

  useEffect(() => {
    if (films.length < 2) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % films.length);
    }, 25000);

    return () => clearInterval(interval);
  }, [films]);

  const bannerFilm = films[currentBanner];

  const startBannerPreview = () => {
    const video = bannerVideoRef.current;
    if (!video || !bannerFilm?.video_url) return;

    const { startTime, endTime } = getPreviewTimes(bannerFilm);

    video.onloadeddata = null;
    video.ontimeupdate = null;

    video.src = bannerFilm.video_url;
    video.load();

    const playPreview = () => {
      video.currentTime = startTime;
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;

      video.play().catch((err) => {
        console.log("Mobile banner preview play error:", err);
      });

      video.ontimeupdate = () => {
        if (video.currentTime >= endTime) {
          video.pause();
          video.ontimeupdate = null;
        }
      };
    };

    if (video.readyState >= 2) {
      playPreview();
    } else {
      video.onloadeddata = playPreview;
    }
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

  async function handleFilmClick(film) {
    if (loading) return;

    if (!user) {
      navigate(`/createaccount?filmId=${film.id}`);
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

    navigate(`/watch/${film.id}`);
  }

  return (
    <div style={{ padding: "12px", background: "#000" }}>
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
          onClick={() => handleFilmClick(bannerFilm)}
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
            <h2 style={{ color: "white", margin: 0 }}>{bannerFilm.title}</h2>
          </div>
        </div>
      )}

      <h2 style={{ color: "white", marginBottom: "12px" }}>MyCinema</h2>

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
              <MobileMovieCard movie={movie} onClick={handleFilmClick} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MobileMovieCard({ movie, onClick }) {
  const videoRef = useRef(null);

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !movie.video_url) return;

    const { startTime, endTime } = getPreviewTimes(movie);

    video.onloadeddata = null;
    video.ontimeupdate = null;

    video.src = movie.video_url;
    video.load();

    const playPreview = () => {
      video.currentTime = startTime;
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;

      video.play().catch((err) => {
        console.log("Mobile card preview play error:", err);
      });

      video.ontimeupdate = () => {
        if (video.currentTime >= endTime) {
          video.pause();
          video.ontimeupdate = null;
        }
      };
    };

    if (video.readyState >= 2) {
      playPreview();
    } else {
      video.onloadeddata = playPreview;
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

  return (
    <div
      style={{ width: "100%", cursor: "pointer" }}
      onTouchStart={startPreview}
      onTouchEnd={stopPreview}
      onTouchCancel={stopPreview}
      onClick={() => onClick(movie)}
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

function chunkArray(array, size) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export default MyCinemaMobile;