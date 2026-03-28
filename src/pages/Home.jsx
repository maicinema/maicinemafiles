import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import banner from "../assets/cinema-banner.jpg";
import SubscribeSection from "../components/SubscribeSection";
import TrendingNow from "../components/TrendingNow";
import LeavingSoon from "../components/LeavingSoon";
import ComingSoonFilms from "../components/ComingSoonFilms";

function Home() {

  // ✅ NEW: live films state
  const [liveFilms, setLiveFilms] = useState([]);

  useEffect(() => {
    loadLiveFilms();
  }, []);

  async function loadLiveFilms() {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .eq("status", "live");

    if (!error) {
      setLiveFilms(data || []);
    }
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

      {/* ✅ NEW: ensure homepage sees LIVE films */}
      {liveFilms.length > 0 && <TrendingNow films={liveFilms} />}

      {/* KEEP YOUR EXISTING STRUCTURE */}
      <SubscribeSection />
      <LeavingSoon />
      <ComingSoonFilms />
    </>
  );
}

export default Home;