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

  // auto-slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

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
        {/* Overlay */}
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

        {/* Content */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: "80px",
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
  70% { transform: translateX(0%); opacity: 1; }

  80% { transform: translateX(120%); opacity: 0; }
  81% { transform: translateX(-120%); opacity: 0; }

  100% { transform: translateX(0%); opacity: 1; }
}
`}
</style>
      <SubscribeSection />
    </>
  );
}

export default Home;