import banner from "../assets/cinema-banner.jpg";
import Navbar from "../components/Navbar";
import SubscribeSection from "../components/SubscribeSection";
import TrendingNow from "../components/TrendingNow";
import LeavingSoon from "../components/LeavingSoon";
import ComingSoonFilms from "../components/ComingSoonFilms";

function Home() {
  return (
    <>

      {/* HERO SECTION */}
      <div
        style={{
          height: "100vh",
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white"
        }}
      >

        <Navbar />

        {/* DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)"
          }}
        ></div>

        {/* HERO TEXT */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: "80px"
          }}
        >
          <div>
            <h1 style={{ fontSize: "64px", margin: "0" }}>
              Welcome to <span style={{ color: "red" }}>MaiCinema</span>
            </h1>

            <p style={{ marginTop: "20px", fontSize: "18px", color: "#ccc" }}>
              Stream powerful short films. Discover new voices.
              Experience cinema differently.
            </p>
          </div>
        </div>

      </div>

      {/* SUBSCRIBE SECTION */}
      <SubscribeSection />

      {/* TRENDING NOW */}
      <TrendingNow />

      {/* LEAVING SOON */}
      <LeavingSoon />

      {/* COMING SOON */}
      <ComingSoonFilms />

    </>
  );
}

export default Home;