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
      <h2 style={styles.title}>Patron Circle Donators</h2>

      <p style={styles.subtitle}>
        Support the journey of <strong>MaiCinema Originals and Streams</strong>.
        Be part of what we are building and unlock special supporter benefits.
      </p>

      <div style={styles.totalBox}>
        <p>Total Support Raised</p>
        <h1>$0</h1>
      </div>

      {/* TOP ROW */}
      <div style={styles.row}>
        {tiers.slice(0, 2).map((tier) => (
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

              <button
                style={styles.button}
                onClick={() => goToPayment(tier)}
              >
                Support
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM ROW */}
      <div style={{ ...styles.row, justifyContent: "center" }}>
        <div style={{ ...styles.card, maxWidth: "400px" }}>
          <img
            src={tiers[2].image}
            alt={tiers[2].name}
            style={styles.image}
          />

          <div style={styles.cardContent}>
            <h3>{tiers[2].name}</h3>
            <p style={styles.price}>{tiers[2].price}</p>

            <ul style={styles.list}>
              {tiers[2].benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <button
              style={styles.button}
              onClick={() => goToPayment(tiers[2])}
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "60px",
    textAlign: "center",
  },

  title: {
  fontSize: "clamp(32px, 6vw, 48px)",
  fontWeight: "bold",
  marginBottom: "15px",
},

  subtitle: {
    maxWidth: "700px",
    margin: "0 auto 30px",
    color: "#ccc",
  },

  totalBox: {
    marginBottom: "40px",
  },

  row: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  card: {
    background: "#111",
    borderRadius: "10px",
    overflow: "hidden",
    maxWidth: "320px",
    width: "100%",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },

  cardContent: {
    padding: "15px",
  },

  price: {
    color: "#e50914",
    marginBottom: "10px",
  },

  list: {
    textAlign: "left",
    fontSize: "14px",
    color: "#ccc",
    marginBottom: "15px",
  },

  button: {
    background: "#e50914",
    border: "none",
    color: "white",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default SupportDonationSection;