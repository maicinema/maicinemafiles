import banner from "../assets/cinema-banner.jpg";
import Navbar from "../components/Navbar";
import SubscribeSection from "../components/SubscribeSection";
import TrendingNow from "../components/TrendingNow";
import LeavingSoon from "../components/LeavingSoon";
import ComingSoonFilms from "../components/ComingSoonFilms";

function Home() {
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
            paddingLeft: "20px", // ✅ smaller padding for mobile
            paddingRight: "20px"
          }}
        >
          <div
            style={{
              maxWidth: "800px"
            }}
          >
            <h1
              style={{
                fontSize: "clamp(28px, 6vw, 64px)", // ✅ responsive text
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

      <SubscribeSection />
      <TrendingNow />
      <LeavingSoon />
      <ComingSoonFilms />
    </>
  );
}

export default Home;