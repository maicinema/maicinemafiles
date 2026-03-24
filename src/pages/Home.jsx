import { useEffect, useState } from "react";
import banner from "../assets/cinema-banner.jpg";
import Navbar from "../components/Navbar";
import SubscribeSection from "../components/SubscribeSection";
import TrendingNow from "../components/TrendingNow";
import LeavingSoon from "../components/LeavingSoon";
import ComingSoonFilms from "../components/ComingSoonFilms";

function Home() {
  const [animationStage, setAnimationStage] = useState("center");

  useEffect(() => {
    const cycle = setInterval(() => {
      setAnimationStage("exit-right");

      setTimeout(() => {
        setAnimationStage("left-hidden");

        setTimeout(() => {
          setAnimationStage("center");
        }, 80);
      }, 2000);
    }, 12000);

    return () => clearInterval(cycle);
  }, []);

  function getHeroTransform() {
    if (animationStage === "exit-right") return "translateX(130vw)";
    if (animationStage === "left-hidden") return "translateX(-130vw)";
    return "translateX(0)";
  }

  function getHeroTransition() {
    if (animationStage === "left-hidden") return "none";
    return "transform 2s ease-in-out";
  }

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
          overflow: "hidden"
        }}
      >
        <Navbar />

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
            alignItems: "center",
            paddingLeft: "80px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              transform: getHeroTransform(),
              transition: getHeroTransition(),
              maxWidth: "800px",
              willChange: "transform"
            }}
          >
            <h1 style={{ fontSize: "64px", margin: "0" }}>
              Welcome to <span style={{ color: "red" }}>MaiCinema</span>
            </h1>

            <p style={{ marginTop: "20px", fontSize: "18px", color: "#ccc" }}>
              Stream powerful short films. Discover new voices. Experience cinema differently.
            </p>
          </div>
        </div>
      </div>

      <SubscribeSection />
      <TrendingNow />
      <LeavingSoon />
      <ComingSoonFilms />
    </>
  );
}

export default Home;