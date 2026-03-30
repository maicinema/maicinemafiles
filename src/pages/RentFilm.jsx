import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { RENT_PRICE } from "../config/pricing";

function RentFilm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // ✅ LOAD FILM DETAILS
  useEffect(() => {
    loadFilm();
    checkIfPaid();
  }, []);

  async function loadFilm() {
    const { data } = await supabase
      .from("films")
      .select("*")
      .eq("id", id)
      .single();

    setFilm(data);
  }

  // ✅ CHECK IF USER ALREADY HAS VALID ACCESS
  async function checkIfPaid() {
    const user = JSON.parse(localStorage.getItem("maicinemaUser"));
    if (!user) return;

    const now = new Date().toISOString();

    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("film_id", id)
      .eq("user_email", user.email)
      .eq("status", "completed");

    const validPayment = data?.some((p) => {
      return p.type === "rent" && p.expires_at > now;
    });

    if (validPayment) {
      navigate(`/watch/${id}`);
    }
  }

  // ✅ HANDLE PAYMENT SUCCESS
  async function handlePaymentSuccess() {
    const user = JSON.parse(localStorage.getItem("maicinemaUser"));

    if (!user) {
      alert("Please create an account first");
      navigate(`/createaccount?filmId=${id}`);
      return;
    }

    const now = new Date().toISOString();

    // 🔒 CHECK IF ALREADY PAID (avoid duplicate payment)
    const { data: existing } = await supabase
      .from("payments")
      .select("*")
      .eq("film_id", id)
      .eq("user_email", user.email)
      .eq("status", "completed");

    const alreadyPaid = existing?.some((p) => p.expires_at > now);

    if (alreadyPaid) {
      navigate(`/watch/${id}`);
      return;
    }

    // ⏳ SET 48 HOURS ACCESS
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // 💾 SAVE PAYMENT
    const { error } = await supabase.from("payments").insert({
      user_email: user.email,
      film_id: id,
      amount: RENT_PRICE,
      status: "completed",
      type: "rent",
      expires_at: expiresAt.toISOString()
    });

    if (error) {
      console.log(error);
      alert("Payment failed");
      return;
    }

    alert("Payment successful 🎬");

    navigate(`/watch/${id}`);
  }

  // ✅ CARD PAYMENT (temporary)
  const handleCardPayment = (e) => {
    e.preventDefault();
    handlePaymentSuccess();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        Rent "{film?.title || "Film"}"
      </h1>

      <p style={styles.price}>
        Rental Price: ${RENT_PRICE}
      </p>

      {/* 💳 CARD PAYMENT */}
      <form onSubmit={handleCardPayment} style={styles.form}>
        <input
          type="text"
          placeholder="Name on Card"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          style={styles.input}
          required
        />

        <button style={styles.button}>
          Pay ${RENT_PRICE}
        </button>
      </form>

      {/* 🔥 PAYPAL (plug later cleanly) */}
      {/* 
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: RENT_PRICE }
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(() => {
            handlePaymentSuccess();
          });
        }}
      />
      */}
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
    paddingTop: "120px",
    textAlign: "center"
  },

  heading: {
    marginBottom: "10px"
  },

  price: {
    color: "#00ffae",
    marginBottom: "30px"
  },

  form: {
    width: "320px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "12px",
    border: "none"
  },

  button: {
    background: "#e50914",
    color: "white",
    border: "none",
    padding: "14px",
    cursor: "pointer",
    fontSize: "16px"
  }
};

export default RentFilm;