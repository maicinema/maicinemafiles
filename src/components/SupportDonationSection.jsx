import { useNavigate } from "react-router-dom";
import spotlightImg from "../assets/donations/spotlight.jpg";
import premiereImg from "../assets/donations/premiere.jpg";
import executiveImg from "../assets/donations/executive.jpg";
import exystPoster from "../assets/donations/Exystposter.png";

function SupportDonationSection() {
  const navigate = useNavigate();

  const tiers = [
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

  const goToPayment = (tier) => {
    navigate("/support-payment", { state: { tier } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.banner}>
        <img
          src={exystPoster}
          alt="Support EXYST"
          style={styles.bannerImage}
        />
      </div>

      <h1 style={styles.bannerTitle}>Support EXYST</h1>

      <p style={styles.bannerText}>
        Help bring this film to life. Become part of the story.
      </p>

      <h2 style={styles.title}>Support the Film</h2>

      <p style={styles.subtitle}>
        Support EXYST and become part of its journey. Get exclusive access,
        early viewing, and recognition in the film.
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

  bannerTitle: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  bannerText: {
    fontSize: "16px",
    color: "#ddd",
    marginBottom: "35px",
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