import { useState, useEffect } from "react";

import banner1 from "../assets/cinema-banner.jpg";
import banner2 from "../assets/cinema-banner-2.jpg";

import SubscribeSection from "../components/SubscribeSection";
function Home() {

  // refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

 const banners = [banner1, banner2];
  const [currentBanner, setCurrentBanner] = useState(0);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // auto-slide banner
  useEffect(() => {
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

  return (
  <>
    {/* BANNER */}
    <div
  style={{
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    height: "auto",
    aspectRatio: "16 / 9",
        backgroundImage: `url(${banners[currentBanner]}?t=${Date.now()})`,
        transition: "background-image 1s ease-in-out",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
        position: "relative",
        color: "white",
        overflow: "hidden"
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)"
        }}
      />

      {/* DESKTOP TEXT ONLY */}
      {!isMobile && (
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            padding: "0 16px 40px 16px"
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              animation: "heroMove 25s linear infinite"
            }}
          >
            <h1
              style={{
                fontSize: "clamp(28px, 6vw, 64px)",
                margin: "0"
              }}
            >
              Welcome to <span style={{ color: "red" }}>MaiCinema</span>
            </h1>

            <p
              style={{
                marginTop: "0px",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: "#ccc"
              }}
            >
              Stream powerful short films. Discover new voices. Experience cinema differently.
            </p>
          </div>
        </div>
      )}
    </div>

    {/* MOBILE TEXT BELOW BANNER */}
    {isMobile && (
  <div
    style={{
      padding: "16px",
      textAlign: "center",
      color: "white",
      marginTop: "-30px",
      animation: "heroMove 25s linear infinite"
    }}
  >
        <h1 style={{ fontSize: "22px", margin: 0 }}>
          Welcome to <span style={{ color: "red" }}>MaiCinema</span>
        </h1>

        <p style={{ marginTop: "8px", fontSize: "14px", color: "#ccc" }}>
          Stream powerful short films. Discover new voices. Experience cinema differently.
        </p>
      </div>
    )}

    {/* ANIMATION */}
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

    {/* SUBSCRIPTION */}
    <div
  style={{
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    backgroundColor: "#000",
    marginTop: "-30px",
    paddingBottom: "20px"
  }}
>
  <SubscribeSection />
</div>
  </>
);
}
export default Home;