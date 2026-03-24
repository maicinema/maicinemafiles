import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SUBSCRIPTION_PRICE } from "../config/pricing";

function Subscribe() {

  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    alert("Subscription activated! All films unlocked.");

    navigate("/");
  };

  return (

    <div style={styles.container}>

      <h1>Subscribe to MaiCinema</h1>

      <p style={styles.price}>
        Monthly Subscription: ${SUBSCRIPTION_PRICE}
      </p>

      <form onSubmit={handleSubscribe} style={styles.form}>

        <input
          type="text"
          placeholder="Name on Card"
          value={cardName}
          onChange={(e)=>setCardName(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e)=>setCardNumber(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={expiry}
          onChange={(e)=>setExpiry(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e)=>setCvv(e.target.value)}
          style={styles.input}
          required
        />

        <button style={styles.button}>
          Pay ${SUBSCRIPTION_PRICE}
        </button>

      </form>

    </div>
  );
}

const styles = {

  container:{
    background:"#000",
    color:"white",
    minHeight:"100vh",
    paddingTop:"120px",
    textAlign:"center"
  },

  price:{
    color:"#00ffae",
    marginBottom:"30px",
    fontSize:"20px",
    fontWeight:"bold"
  },

  form:{
    width:"320px",
    margin:"0 auto",
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  input:{
    padding:"12px",
    border:"none"
  },

  button:{
    background:"#e50914",
    color:"white",
    border:"none",
    padding:"14px",
    cursor:"pointer",
    fontSize:"16px"
  }

};

export default Subscribe;