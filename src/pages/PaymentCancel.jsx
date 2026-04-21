import { useNavigate } from "react-router-dom";

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment Cancelled</h1>

        <p style={styles.message}>
          Your payment was not completed. No charges were made.
          You can try again anytime.
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/subscribe")}
          >
            Try Again
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box"
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#111",
    padding: "35px 28px",
    borderRadius: "12px",
    textAlign: "center",
    boxSizing: "border-box"
  },

  title: {
    marginBottom: "18px",
    color: "#ff4d4d"
  },

  message: {
    color: "#bbb",
    lineHeight: "1.7",
    marginBottom: "24px"
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  primaryButton: {
    background: "#e50914",
    color: "#fff",
    border: "none",
    padding: "14px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px"
  },

  secondaryButton: {
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "14px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px"
  }
};

export default PaymentCancel;