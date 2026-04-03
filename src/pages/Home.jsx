import { useEffect } from "react";
import { useState, useEffect } from "react";

// temporary local banners (later this will come from admin upload)
import banner1 from "../assets/cinema-banner.jpg";
import banner2 from "../assets/cinema-banner.jpg"; // duplicate for now
import SubscribeSection from "../components/SubscribeSection";
import TrendingNow from "../components/TrendingNow";
import LeavingSoon from "../components/LeavingSoon";
import ComingSoonFilms from "../components/ComingSoonFilms";

function Home() {

  // ✅ ADD THIS (forces refresh of data across components)
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000); // refresh every 60s

    return () => clearInterval(interval);
  }, []);

  const banners = [banner1, banner2];

const [currentBanner, setCurrentBanner] = useState(0);

// auto-slide
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, 5000); // change every 5s

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundImage: `url(${banners[currentBanner]})`,
transition: "background-image 1s ease-in-out",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)"
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            backgroundImage: `url(${banners[currentBanner]})`,
transition: "background-image 1s ease-in-out",
            paddingLeft: "20px",
            paddingRight: "20px"
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
                marginTop: "20px",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: "#ccc"
              }}
            >
              Stream powerful short films. Discover new voices. Experience cinema differently.
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes heroMove {
          0% { transform: translateX(0%); opacity: 1; }
          80% { transform: translateX(0%); opacity: 1; }
          90% { transform: translateX(120%); opacity: 0; }
          91% { transform: translateX(-120%); opacity: 0; }
          100% { transform: translateX(0%); opacity: 1; }
        }
        `}
      </style>

      {/* ✅ KEEP EVERYTHING EXACTLY */}
      <SubscribeSection />
      <ComingSoonFilms />
    </>
  );
}

export default Home;