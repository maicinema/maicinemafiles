import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function RentFilm() {

  const { title } = useParams();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();

    alert("Payment successful. Film unlocked!");

    navigate(`/watch/${title}`);
  };

  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>
        Rent "{title}"
      </h1>

      <p style={styles.price}>
        Rental Price: $1.99
      </p>

      <form onSubmit={handlePayment} style={styles.form}>

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
          Pay $1.99
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

  heading:{
    marginBottom:"10px"
  },

  price:{
    color:"#00ffae",
    marginBottom:"30px"
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

export default RentFilm;