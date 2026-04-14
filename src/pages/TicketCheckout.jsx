import { useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import QRCode from "react-qr-code";

function TicketCheckout() {
  const location = useLocation();
  const { event, ticket } = location.state || {};

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [generatedTicket, setGeneratedTicket] = useState(null);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handlePurchase = async () => {
    if (!user.name || !user.email) {
      alert("Fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          event: event.title,
          title: ticket.title,
          price: ticket.price,
          date: event.date,
          status: "unused",
          user_id: null
        }
      ])
      .select()
      .single();

    if (error) {
      alert("Payment failed");
      console.log(error);
      return;
    }

    setGeneratedTicket(data);
  };

  return (
    <div style={styles.page}>
      <h1>Complete Your Ticket</h1>

      {event && (
        <>
          <h2>{event.title}</h2>
          <p>{ticket.title} — ${ticket.price}</p>
        </>
      )}

      {!generatedTicket ? (
        <>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            style={styles.input}
          />

          <button style={styles.button} onClick={handlePurchase}>
            Pay & Generate Ticket
          </button>
        </>
      ) : (
        <div style={styles.ticketBox}>
          <h2>Ticket Generated</h2>
          <p>{generatedTicket.event}</p>
          <p>{generatedTicket.title}</p>

          <QRCode value={generatedTicket.id} size={200} />

          <p>Ticket ID: {generatedTicket.id}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "#fff",
    padding: "40px"
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "300px"
  },
  button: {
    background: "#e50914",
    color: "#fff",
    padding: "12px",
    border: "none",
    cursor: "pointer"
  },
  ticketBox: {
    marginTop: "30px"
  }
};

export default TicketCheckout;