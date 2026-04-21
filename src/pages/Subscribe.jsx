import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PRICE } from "../config/pricing";

function Subscribe() {
  const navigate = useNavigate();

  const handleProceedPayment = () => {
    alert(
      "Subscription payment setup is being updated. Paystack card checkout will be connected here next."
    );
  };

  return (
    <div style={styles.container}>
      <h1>Subscribe to MaiCinema</h1>

      <p style={styles.price}>
        Monthly Subscription: ${SUBSCRIPTION_PRICE}
      </p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>What you get</h3>

        <ul style={styles.list}>
          <li>Unlimited access to short films</li>
          <li>Stream films without individual rental payment</li>
          <li>Access to MaiCinema subscriber-only content</li>
          <li>Simple monthly subscription access</li>
        </ul>

        <button style={styles.button} onClick={handleProceedPayment}>
          Proceed to Payment
        </button>

        <p style={styles.note}>
          Card payment gateway is being prepared for this page.
        </p>
      </div>

      <p
        style={styles.backLink}
        onClick={() => navigate("/")}
      >
        Back to Home
      </p>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    paddingTop: "120px",
    textAlign: "center",
    paddingLeft: "20px",
    paddingRight: "20px"
  },

  price: {
    color: "#00ffae",
    marginBottom: "30px",
    fontSize: "20px",
    fontWeight: "bold"
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    margin: "0 auto",
    background: "#111",
    padding: "30px 24px",
    borderRadius: "10px",
    boxSizing: "border-box"
  },

  cardTitle: {
    marginBottom: "20px"
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 25px 0",
    lineHeight: "2",
    color: "#ccc"
  },

  button: {
    background: "#e50914",
    color: "white",
    border: "none",
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px",
    width: "100%"
  },

  note: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#999"
  },

  backLink: {
    marginTop: "25px",
    color: "#ccc",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default Subscribe;