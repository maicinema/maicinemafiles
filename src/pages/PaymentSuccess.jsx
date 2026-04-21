import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const reference = params.get("reference") || "";
  const type = params.get("type") || "";
  const status = params.get("status") || "success";

  const getTitle = () => {
    if (type === "subscription") return "Subscription Payment Received";
    if (type === "donation") return "Donation Payment Received";
    if (type === "ticket") return "Ticket Payment Received";
    return "Payment Received";
  };

  const getMessage = () => {
    if (type === "subscription") {
      return "Your subscription payment has been received. Verification and account unlock will be connected here next.";
    }

    if (type === "donation") {
      return "Your donation payment has been received. Verification and donor confirmation will be connected here next.";
    }

    if (type === "ticket") {
      return "Your ticket payment has been received. Verification and ticket generation will be connected here next.";
    }

    return "Your payment has been received. Verification logic will be connected here next.";
  };

  const handleContinue = () => {
    if (type === "subscription") {
      navigate("/mycinema");
      return;
    }

    if (type === "donation") {
      navigate("/events");
      return;
    }

    if (type === "ticket") {
      navigate("/events");
      return;
    }

    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{getTitle()}</h1>

        <p style={styles.status}>
          Status: <span style={styles.statusValue}>{status}</span>
        </p>

        {reference && (
          <p style={styles.reference}>
            Reference: <span style={styles.referenceValue}>{reference}</span>
          </p>
        )}

        <p style={styles.message}>{getMessage()}</p>

        <button style={styles.button} onClick={handleContinue}>
          Continue
        </button>
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
    marginBottom: "18px"
  },

  status: {
    marginBottom: "12px",
    color: "#ccc"
  },

  statusValue: {
    color: "#00ffae",
    fontWeight: "bold",
    textTransform: "capitalize"
  },

  reference: {
    marginBottom: "18px",
    color: "#ccc",
    wordBreak: "break-word"
  },

  referenceValue: {
    color: "#fff"
  },

  message: {
    color: "#bbb",
    lineHeight: "1.7",
    marginBottom: "24px"
  },

  button: {
    background: "#e50914",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "4px",
    width: "100%"
  }
};

export default PaymentSuccess;