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
const [customAmount, setCustomAmount] = useState("");

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

    const { data: eventData } = await supabase
      .from("events")
      .select("id, total_seats, title")
      .eq("title", event.title)
      .single();

    if (!eventData) {
      alert("Event not found");
      return;
    }

    const { count } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("event", event.title);

    if (count >= eventData.total_seats) {
      alert("Tickets are sold out");
      return;
    }

    const { data, error } = await supabase
      .from("ticket_purchases")
      .insert([
        {
          event_title: event.title,
          ticket_title: ticket.title,
         ticket_price: isNaN(ticket.price) ? customAmount : ticket.price,
          event_date: event.date,
          buyer_name: user.name,
          buyer_email: user.email,
          buyer_phone: user.phone
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
          <p>
  {ticket.title} — {
    isNaN(ticket.price)
      ? ticket.price
      : `$${ticket.price}`
  }
</p>
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

{isNaN(ticket.price) && (
  <input
    placeholder="Enter your amount"
    value={customAmount}
    onChange={(e) => setCustomAmount(e.target.value)}
    style={styles.input}
  />
)}

          <button style={styles.button} onClick={handlePurchase}>
            Pay & Generate Ticket
          </button>
        </>
      ) : (
        <div style={styles.ticketBox}>
          <h2>Ticket Generated</h2>
          <p>{generatedTicket.event_title}</p>
          <p>{generatedTicket.ticket_title}</p>

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