import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function TicketCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, ticket } = location.state || {};

  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    amount: ""
  });

  const handleChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value
    });
  };

  const handleProceedPayment = async () => {
    if (!buyer.name || !buyer.email) {
      alert("Please fill in your full name and email.");
      return;
    }

    const amount =
      ticket && !isNaN(ticket.price)
        ? Number(ticket.price)
        : Number(buyer.amount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid ticket amount.");
      return;
    }

    try {
      const res = await fetch("https://maicinemafiles.pages.dev/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: buyer.email,
          amount,
          type: "ticket",
          metadata: {
            buyer_name: buyer.name,
            buyer_email: buyer.email,
            buyer_phone: buyer.phone,
            event_title: event?.title || "",
            event_date: event?.date || "",
            event_time: event?.time || "",
            ticket_title: ticket?.title || ""
          }
        })
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        alert(data.error || data.message || "Unable to initialize ticket payment.");
        return;
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      alert("Payment link was not returned.");
    } catch (error) {
      console.log("Ticket payment init error:", error);
      alert(error.message || "Something went wrong while starting ticket payment.");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Complete Your Ticket Purchase</h1>

      {event && (
        <div style={styles.eventBox}>
          <h2 style={styles.eventTitle}>{event.title}</h2>

          <p style={styles.ticketInfo}>
            {ticket?.title} —{" "}
            {ticket && isNaN(ticket.price) ? ticket.price : `$${ticket?.price}`}
          </p>

          {event.date && <p style={styles.metaText}>Date: {event.date}</p>}
          {event.time && <p style={styles.metaText}>Time: {event.time}</p>}
        </div>
      )}

      <div style={styles.formBox}>
        <input
          name="name"
          placeholder="Full Name"
          value={buyer.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={buyer.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={buyer.phone}
          onChange={handleChange}
          style={styles.input}
        />

        {ticket && isNaN(ticket.price) && (
          <input
            name="amount"
            placeholder="Enter your amount"
            value={buyer.amount}
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
    color: "#fff",
    minHeight: "100vh",
    padding: "120px 20px 40px",
    textAlign: "center"
  },

  heading: {
    marginBottom: "25px"
  },

  eventBox: {
    marginBottom: "25px"
  },

  eventTitle: {
    marginBottom: "10px"
  },

  ticketInfo: {
    color: "#00ffae",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px"
  },

  metaText: {
    color: "#ccc",
    marginBottom: "6px"
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
    marginBottom: "14px",
    padding: "12px",
    width: "100%",
    boxSizing: "border-box",
    border: "none"
  },

  button: {
    background: "#e50914",
    color: "#fff",
    padding: "14px",
    border: "none",
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

export default TicketCheckout;