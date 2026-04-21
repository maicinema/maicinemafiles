import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PRICE } from "../config/pricing";
import { useAuth } from "../context/AuthContext";

function Subscribe() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleProceedPayment = async () => {
    if (loading) return;

    if (!user?.email) {
      alert("Please log in first before continuing to payment.");
      navigate("/createaccount", { state: { type: "subscribe" } });
      return;
    }

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          amount: SUBSCRIPTION_PRICE,
          type: "subscription",
          metadata: {
            plan: "monthly",
            user_id: user.id || null
          }
        })
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        alert(data.error || data.message || "Unable to initialize payment.");
        return;
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      alert("Payment link was not returned.");
    } catch (error) {
      console.log("Subscribe payment init error:", error);
      alert("Something went wrong while starting payment.");
    }
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
          You will be redirected to secure checkout once payment is available.
        </p>
      </div>

      <p style={styles.backLink} onClick={() => navigate("/")}>
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