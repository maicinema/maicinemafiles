import banner from "../assets/cinema-banner.jpg";
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
            paddingLeft: "20px",
            paddingRight: "20px"
          }}
        >
          {/* ✅ WRAPPER MOVES EVERYTHING */}
          <div
            style={{
              maxWidth: "800px",
              whiteSpace: "nowrap",
              animation: "heroSlide 20s linear infinite"
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

      {/* ✅ ANIMATION */}
      <style>
        {`
        @keyframes heroSlide {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          40% {
            transform: translateX(0%);
            opacity: 1;
          }
          70% {
            transform: translateX(0%);
            opacity: 1;
          }
          90% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        `}
      </style>

      <SubscribeSection />
      <TrendingNow />
      <LeavingSoon />
      <ComingSoonFilms />
    </>
  );
}

export default Home;