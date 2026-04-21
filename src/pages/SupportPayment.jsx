import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function SupportPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const tier = location.state?.tier;

  const [donor, setDonor] = useState({
    name: "",
    email: "",
    amount: ""
  });

  const handleChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value
    });
  };

  const extractTierAmount = (priceText) => {
    if (!priceText) return 0;

    const matches = priceText.match(/[\d,]+/g);
    if (!matches || matches.length === 0) return 0;

    const firstAmount = matches[0].replace(/,/g, "");
    return Number(firstAmount);
  };

  const handleProceedPayment = async () => {
    if (!donor.name || !donor.email) {
      alert("Please fill in your full name and email.");
      return;
    }

    const amount = tier ? extractTierAmount(tier.price) : Number(donor.amount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      const res = await fetch("https://maicinemafiles.pages.dev/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: donor.email,
          amount,
          type: "donation",
          metadata: {
            donor_name: donor.name,
            donor_email: donor.email,
            donation_tier: tier?.name || "Custom Donation"
          }
        })
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        alert(data.error || data.message || "Unable to initialize donation payment.");
        return;
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      alert("Payment link was not returned.");
    } catch (error) {
      console.log("Donation payment init error:", error);
      alert(error.message || "Something went wrong while starting donation payment.");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Support MaiCinema</h1>

      {tier && (
        <div style={styles.tierBox}>
          <h2 style={styles.tierName}>{tier.name}</h2>
          <p style={styles.tierPrice}>{tier.price}</p>
        </div>
      )}

      <div style={styles.formBox}>
        <input
          name="name"
          placeholder="Full Name"
          value={donor.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={donor.email}
          onChange={handleChange}
          style={styles.input}
        />

        {!tier && (
          <input
            name="amount"
            placeholder="Enter Donation Amount"
            value={donor.amount}
            onChange={handleChange}
            style={styles.input}
          />
        )}

        <button style={styles.button} onClick={handleProceedPayment}>
          Proceed to Payment
        </button>

        <p style={styles.note}>
          You will be redirected to secure checkout once payment is available.
        </p>
      </div>

      <p style={styles.backLink} onClick={() => navigate("/events")}>
        Back to Events
      </p>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    padding: "120px 20px 40px",
    textAlign: "center"
  },

  heading: {
    marginBottom: "25px"
  },

  tierBox: {
    marginBottom: "25px"
  },

  tierName: {
    marginBottom: "10px"
  },

  tierPrice: {
    color: "#00ffae",
    fontSize: "18px",
    fontWeight: "bold"
  },

  formBox: {
    width: "100%",
    maxWidth: "420px",
    margin: "0 auto",
    background: "#111",
    padding: "30px 24px",
    borderRadius: "10px",
    boxSizing: "border-box"
  },

  input: {
    display: "block",
    width: "100%",
    marginBottom: "14px",
    padding: "12px",
    boxSizing: "border-box",
    border: "none"
  },

  button: {
    background: "#e50914",
    padding: "14px",
    border: "none",
    color: "white",
    cursor: "pointer",
    width: "100%",
    borderRadius: "4px",
    fontSize: "16px"
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

export default SupportPayment;