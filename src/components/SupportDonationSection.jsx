import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import spotlightImg from "../assets/donations/spotlight.jpg";
import premiereImg from "../assets/donations/premiere.jpg";
import executiveImg from "../assets/donations/executive.jpg";

function SupportDonationSection() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [supportTiers, setSupportTiers] = useState([]);

  const fallbackTiers = [
    {
      name: "Supporter",
      price: "$3 – $10",
      image: spotlightImg,
      benefits: [
        "Name listed on MaiCinema supporter wall",
        "Access to private project updates",
        "Early announcements before public release",
      ],
    },
    {
      name: "Insider",
      price: "$10 – $25",
      image: premiereImg,
      benefits: [
        "Everything in Supporter",
        "Behind-the-scenes clips access",
        "Early private screening link",
        "Name included in film end credits",
      ],
    },
    {
      name: "Backer",
      price: "$25 – $50",
      image: executiveImg,
      benefits: [
        "Everything in Insider",
        "Priority name placement in credits",
        "Special Backer recognition",
        "Exclusive digital supporter badge",
      ],
    },
  ];

  useEffect(() => {
    loadBanner();
    loadSupportTiers();
  }, []);

  async function loadBanner() {
    const { data, error } = await supabase
      .from("support_banner")
      .select("*")
      .eq("is_live", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("Public banner load error:", error);
      return;
    }

    setBanner(data);
  }

  async function loadSupportTiers() {
    const { data, error } = await supabase
      .from("support_tiers")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.log("Support tiers load error:", error);
      return;
    }

    const formattedTiers = (data || []).map((tier, index) => ({
      name: tier.name,
      price: tier.price,
      image:
        tier.image_url ||
        (index === 0 ? spotlightImg : index === 1 ? premiereImg : executiveImg),
      benefits: String(tier.benefits || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }));

    setSupportTiers(formattedTiers);
  }

  const tiers = supportTiers.length > 0 ? supportTiers : fallbackTiers;

  return (
    <div style={styles.container}>
      {banner && banner.image_url && (
        <div style={styles.banner}>
          <img
            src={banner.image_url}
            alt="Support banner"
            style={styles.bannerImage}
          />
        </div>
      )}

      <h2 style={styles.title}>{banner?.title || "Support the Film"}</h2>

      <p style={styles.subtitle}>
        {banner?.subtitle ||
          "Support EXYST and become part of its journey. Get exclusive access, early viewing, and recognition in the film."}
      </p>

      <div style={styles.row}>
        {tiers.map((tier) => (
          <div key={tier.name} style={styles.card}>
            <img src={tier.image} alt={tier.name} style={styles.image} />

            <div style={styles.cardContent}>
              <h3>{tier.name}</h3>
              <p style={styles.price}>{tier.price}</p>

              <ul style={styles.list}>
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
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
  container: {
    marginBottom: "60px",
    textAlign: "center",
  },

  banner: {
    width: "100%",
    height: "500px",
    marginBottom: "30px",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  title: {
    fontSize: "32px",
    marginBottom: "15px",
  },

  subtitle: {
    maxWidth: "700px",
    margin: "0 auto 30px",
    color: "#ccc",
  },

  row: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    background: "#111",
    borderRadius: "10px",
    maxWidth: "300px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },

  cardContent: {
    padding: "15px",
  },

  price: {
    color: "#e50914",
    fontWeight: "bold",
  },

  list: {
    textAlign: "left",
    color: "#ccc",
    fontSize: "14px",
  },

  button: {
    background: "#e50914",
    border: "none",
    color: "white",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
  },
};

export default SupportDonationSection;