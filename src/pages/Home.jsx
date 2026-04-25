import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SubscribeSection from "../components/SubscribeSection";

function Home() {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Load homepage banners error:", error);
      return;
    }

    setBanners(data || []);
  }

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeBanner = banners[currentBanner];

  return (
    <>
      <div style={styles.banner}>
        {activeBanner?.file_type?.includes("video") ? (
  <iframe
    src={
      activeBanner.file_url.includes("iframe.videodelivery.net")
        ? `${activeBanner.file_url}?autoplay=true&muted=true&loop=true&controls=false`
        : activeBanner.file_url.replace(
            "https://videodelivery.net/",
            "https://iframe.videodelivery.net/"
          ).replace(
            "/manifest/video.m3u8",
            "?autoplay=true&muted=true&loop=true&controls=false"
          )
    }
    allow="autoplay; fullscreen"
    title="MaiCinema Banner Video"
    style={{
      ...styles.media,
      border: "none"
    }}
  />
) : activeBanner?.file_url ? (
  <div
    style={{
      ...styles.imageBanner,
      backgroundImage: `url(${activeBanner.file_url})`
    }}
  />
) : (
  <div style={styles.fallback} />
)}

        <div style={styles.overlay} />

        {!isMobile && (
          <div style={styles.desktopTextWrap}>
            <div style={styles.textBox}>
              <h1 style={styles.heading}>
                Welcome to <span style={{ color: "red" }}>MaiCinema</span>
              </h1>

              <p style={styles.subText}>
                Stream powerful short films. Discover new voices. Experience cinema differently.
              </p>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <div style={styles.mobileTextWrap}>
          <h1 style={styles.mobileHeading}>
            Welcome to <span style={{ color: "red" }}>MaiCinema</span>
          </h1>

          <p style={styles.mobileText}>
            Stream powerful short films. Discover new voices. Experience cinema differently.
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes heroMove {
            0% { transform: translateX(0%); opacity: 1; }
            70% { transform: translateX(0%); opacity: 1; }
            80% { transform: translateX(120%); opacity: 0; }
            81% { transform: translateX(-120%); opacity: 0; }
            100% { transform: translateX(0%); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.subscribeWrap}>
        <SubscribeSection />
      </div>
    </>
  );
}

const styles = {
  banner: {
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    height: "auto",
    aspectRatio: "16 / 9",
    backgroundColor: "#000",
    position: "relative",
    color: "white",
    overflow: "hidden"
  },

  media: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  imageBanner: {
  position: "absolute",
  inset: 0,
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#000"
},

  fallback: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#000"
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)"
  },

  desktopTextWrap: {
    position: "relative",
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    padding: "0 16px 40px 16px",
    zIndex: 2
  },

  textBox: {
    maxWidth: "800px",
    animation: "heroMove 25s linear infinite"
  },

  heading: {
    fontSize: "clamp(28px, 6vw, 64px)",
    margin: "0"
  },

  subText: {
    marginTop: "0px",
    fontSize: "clamp(14px, 2.5vw, 18px)",
    color: "#ccc"
  },

  mobileTextWrap: {
    padding: "16px",
    textAlign: "center",
    color: "white",
    marginTop: "-30px",
    animation: "heroMove 25s linear infinite"
  },

  mobileHeading: {
    fontSize: "22px",
    margin: 0
  },

  mobileText: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#ccc"
  },

  subscribeWrap: {
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    backgroundColor: "#000",
    marginTop: "-30px",
    paddingBottom: "20px"
  }
};

export default Home;