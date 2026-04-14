import { useState, useEffect } from "react";
import React from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import fallbackPoster from "../assets/events/nightwemarried-poster.jpg";
import { supabase } from "../lib/supabase";
import SupportDonationSection from "../components/SupportDonationSection";

function Events() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [ticketType, setTicketType] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [timeLeftMap, setTimeLeftMap] = useState({});
const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("id", { ascending: false });

        if (eventsError) {
          console.error("EVENT FETCH ERROR:", eventsError.message);
          return;
        }

        const { data: ticketsData, error: ticketsError } = await supabase
          .from("tickets")
          .select("*")
          .order("id", { ascending: true });

        if (ticketsError) {
          console.error("TICKET FETCH ERROR:", ticketsError.message);
          return;
        }

        if (isMounted) {
          setEvents(eventsData || []);
          setTickets(ticketsData || []);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err.message);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!events.length) return;

    const timer = setInterval(() => {
      const updatedTimes = {};

      events.forEach((event) => {
        const rawDateTime = `${event.date || ""} ${event.time || ""}`.trim();
        const eventDate = new Date(rawDateTime).getTime();

        if (!event.date || isNaN(eventDate)) {
          updatedTimes[event.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
          return;
        }

        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance <= 0) {
          updatedTimes[event.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
          return;
        }

        updatedTimes[event.id] = {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
      });

      setTimeLeftMap(updatedTimes);
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const selectTicket = (event, ticket) => {
    setSelectedEvent(event);
    setTicketType(`${ticket.title} — ${formatDisplay(ticket.price)}`);
    setShowForm(true);
    setShowPayment(false);
    setShowTicket(false);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const proceedPayment = () => {
    setShowForm(false);
    setShowPayment(true);
  };

  const confirmPayment = () => {
    setShowPayment(false);
    setShowTicket(true);
  };

  const formatDisplay = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? price : `$${num.toFixed(2)}`;
  };

  const getEventTickets = (eventTitle) => {
    return tickets.filter((ticket) => ticket.event === eventTitle);
  };

  return (
  <div style={styles.page}>

    <SupportDonationSection />

<h1 style={styles.heading}>Upcoming Events</h1>

    {events.map((event) => {
      const eventTickets = getEventTickets(event.title);
      const timeLeft = timeLeftMap[event.id] || {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };

      return (
        <div key={event.id} style={styles.eventBlock}>
          <div style={styles.eventContainer}>
            <img
              src={event.poster || fallbackPoster}
              alt={event.title}
              style={styles.poster}
            />

            <div style={styles.info}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>

              <p>
                Venue: <strong>{event.venue}</strong>
                <br />
                Date: <strong>{event.date}</strong>
                <br />
                Time: <strong>{event.time}</strong>
              </p>
            </div>
          </div>

          <div style={styles.countdownBox}>
            <h2>Private Screening Begins In</h2>
            <div style={styles.countdown}>
              <div><h1>{timeLeft.days}</h1><p>Days</p></div>
              <div><h1>{timeLeft.hours}</h1><p>Hours</p></div>
              <div><h1>{timeLeft.minutes}</h1><p>Minutes</p></div>
              <div><h1>{timeLeft.seconds}</h1><p>Seconds</p></div>
            </div>
          </div>

        <div style={styles.ticketSection}>
  <button
    style={styles.purchaseHeadingBtn}
    onClick={() =>
      navigate("/ticket-checkout", {
        state: {
          event,
          ticket: eventTickets.length > 0 ? eventTickets[0] : null
        }
      })
    }
  >
    Purchase Your Tickets
  </button>

  {eventTickets.length === 0 && (
    <p style={styles.noTickets}>
      Ticket options will appear after ticket setup is added for this event.
    </p>
  )}
</div>
        </div>
      );
    })}

    {showForm && (
      <div style={styles.formBox}>
        <h3>{selectedEvent?.title}</h3>
        <h4>{ticketType}</h4>

        <input
          name="name"
          placeholder="Full Name"
          style={styles.input}
          onChange={handleChange}
          value={user.name}
        />
        <input
          name="email"
          placeholder="Email Address"
          style={styles.input}
          onChange={handleChange}
          value={user.email}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          style={styles.input}
          onChange={handleChange}
          value={user.phone}
        />

        <button style={styles.payBtn} onClick={proceedPayment}>
          Proceed to Payment
        </button>
      </div>
    )}

    {showPayment && (
      <div style={styles.formBox}>
        <h3>Payment Details</h3>
        <p>{selectedEvent?.title}</p>
        <p>{ticketType}</p>

        <button style={styles.payBtn} onClick={confirmPayment}>
          Confirm Payment
        </button>
      </div>
    )}

    {showTicket && (
      <div style={styles.ticketBox}>
        <h2>Your Ticket</h2>
        <p>{selectedEvent?.title}</p>
        <p>{user.name}</p>
        <p>{ticketType}</p>

        <div style={styles.qr}>
          <QRCode
            value={`${selectedEvent?.title}-${user.name}-${ticketType}`}
            size={180}
          />
        </div>
      </div>
    )}
  </div>
);
}

const styles = {
  page: {
    background: "#000",
    color: "white",
    padding: "clamp(20px, 5vw, 80px)" // ✅ responsive padding
  },

  heading: {
    marginBottom: "40px",
    fontSize: "clamp(26px, 5vw, 40px)"
  },

  eventBlock: {
    marginBottom: "80px"
  },

  /* ✅ FIX MAIN LAYOUT */
  eventContainer: {
    display: "flex",
    flexWrap: "wrap", // ✅ allows stacking
    gap: "20px",
    alignItems: "flex-start"
  },

  purchaseHeadingBtn: {
  background: "#e50914",
  border: "none",
  color: "white",
  padding: "14px 24px",
  cursor: "pointer",
  borderRadius: "8px",
  fontSize: "clamp(22px, 4vw, 32px)",
  fontWeight: "bold",
  display: "inline-block",
  marginTop: "10px"
},

  poster: {
    width: "100%",
    maxWidth: "260px",
    borderRadius: "8px",
    objectFit: "cover"
  },

  info: {
    maxWidth: "600px",
    lineHeight: "1.6",
    color: "#ccc",
    fontSize: "clamp(14px, 2.5vw, 16px)"
  },

  countdownBox: {
    marginTop: "40px",
    textAlign: "center"
  },

  countdown: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap"
  },

  ticketSection: {
    marginTop: "40px"
  },

  buttons: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap"
  },

  ticketBtn: {
    background: "#e50914",
    border: "none",
    color: "white",
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px"
  },

  formBox: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "350px"
  },

  input: {
    padding: "10px",
    border: "none"
  },

  payBtn: {
    background: "#00ffae",
    border: "none",
    padding: "12px",
    cursor: "pointer"
  },

  ticketBox: {
    marginTop: "40px",
    textAlign: "center"
  },

  qr: {
    marginTop: "20px"
  },

  noTickets: {
    color: "#aaa"
  }
};

export default Events;