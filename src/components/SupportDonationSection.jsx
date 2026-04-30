import { useNavigate } from "react-router-dom";
import spotlightImg from "../assets/donations/spotlight.jpg";
import premiereImg from "../assets/donations/premiere.jpg";
import executiveImg from "../assets/donations/executive.jpg";

function SupportDonationSection() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Spotlight Donators",
      price: "$100 – $500",
      image: spotlightImg,
      benefits: [
        "Name listed on supporter wall",
        "Name added to selected MaiCinema Originals end credits",
        "Early supporter recognition on the platform",
        "Access to supporter updates for selected projects",
      ],
    },
    {
      name: "Premiere Donators",
      price: "$500 – $1,000",
      image: premiereImg,
      benefits: [
        "Everything in Spotlight",
        "Priority name placement in end credits",
        "Exclusive MaiCinema supporter badge",
        "Early preview updates on selected originals and streams",
        "Special appreciation feature on supporter section",
      ],
    },
    {
      name: "Executive Donators",
      price: "$1,000 and above",
      image: executiveImg,
      benefits: [
        "Everything in Premiere",
        "Executive supporter recognition on selected MaiCinema Originals",
        "Featured supporter spotlight on the platform",
        "Priority acknowledgment during premieres",
        "Highest supporter tier recognition",
      ],
    },
  ];

  const goToPayment = (tier) => {
    navigate("/support-payment", { state: { tier } });
  };

  return (
    <div style={styles.container}>

      {/* 🔥 NEW BANNER */}
      <div style={styles.banner}>
        <img
          src="/assets/Exystposter.png" // 🔥 CHANGE THIS TO YOUR FILM POSTER
          alt="Support Film"
          style={styles.bannerImage}
        />

        <div style={styles.bannerOverlay}>
          <h1 style={styles.bannerTitle}>Support EXYST</h1>
          <p style={styles.bannerText}>
            Help bring this film to life. Become part of the story.
          </p>
        </div>
      </div>

      <h2 style={styles.title}>Patron Circle Donators</h2>

      <p style={styles.subtitle}>
        Support the journey of <strong>MaiCinema Originals and Streams</strong>.
      </p>

      <div style={styles.row}>
        {tiers.map((tier) => (
          <div key={tier.name} style={styles.card}>
            <img src={tier.image} alt={tier.name} style={styles.image} />

            <div style={styles.cardContent}>
              <h3>{tier.name}</h3>
              <p style={styles.price}>{tier.price}</p>

              <ul style={styles.list}>
                {tier.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <button onClick={() => goToPayment(tier)} style={styles.button}>
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

  /* 🔥 BANNER STYLES */
  banner: {
    position: "relative",
    width: "100%",
    height: "350px",
    marginBottom: "40px",
    overflow: "hidden",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  bannerOverlay: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    color: "white",
    textAlign: "left",
  },

  bannerTitle: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  bannerText: {
    fontSize: "16px",
    color: "#ddd",
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