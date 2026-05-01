import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import spotlightImg from "../assets/donations/spotlight.jpg";
import premiereImg from "../assets/donations/premiere.jpg";
import executiveImg from "../assets/donations/executive.jpg";

function SupportDonationSection() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    loadBanner();
  }, []);

  async function loadBanner() {
    const { data } = await supabase
      .from("support_banner")
      .select("*")
      .eq("is_live", true)
      .single();

    if (data) setBanner(data);
  }

  const tiers = [
    {
      name: "Supporter",
      price: "$3 – $10",
      image: spotlightImg,
      benefits: ["Name listed", "Updates", "Early announcements"],
    },
    {
      name: "Insider",
      price: "$10 – $25",
      image: premiereImg,
      benefits: ["Everything in Supporter", "Behind scenes", "Private link"],
    },
    {
      name: "Backer",
      price: "$25 – $50",
      image: executiveImg,
      benefits: ["Everything in Insider", "Credits priority"],
    },
  ];

  return (
    <div style={styles.container}>
      {/* 🔥 DYNAMIC BANNER */}
      {banner && (
        <div style={styles.banner}>
          <img src={banner.image_url} style={styles.bannerImage} />
        </div>
      )}

      <h2 style={styles.title}>Support the Film</h2>

      <p style={styles.subtitle}>
        {banner?.subtitle ||
          "Support EXYST and become part of its journey."}
      </p>

      <div style={styles.row}>
        {tiers.map((tier) => (
          <div key={tier.name} style={styles.card}>
            <img src={tier.image} style={styles.image} />

            <div style={styles.cardContent}>
              <h3>{tier.name}</h3>
              <p style={styles.price}>{tier.price}</p>

              <ul style={styles.list}>
                {tier.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/support-payment", { state: { tier } })}
                style={styles.button}
              >
                Support
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: "center" },

  banner: {
    height: "500px",
    overflow: "hidden",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  title: { fontSize: "32px" },
  subtitle: { color: "#ccc" },

  row: { display: "flex", gap: "20px", justifyContent: "center" },

  card: { background: "#111", maxWidth: "300px" },
  image: { width: "100%", height: "160px" },
  button: { background: "#e50914", color: "white", padding: "10px" },
};

export default SupportDonationSection;