import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SUBSCRIPTION_PRICE } from "../config/pricing";

function Subscribe() {

  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayPal = async () => {
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: SUBSCRIPTION_PRICE.toString(),
      }),
    });

    const data = await res.json();

    const approveLink = data.links.find(
      (link) => link.rel === "approve"
    );

    if (approveLink) {
      window.location.href = approveLink.href;
    } else {
      alert("Payment error: No approval link found");
    }
  } catch (err) {
    console.log(err);
    alert("Payment failed");
  }
};

  return (

    <div style={styles.container}>

      <h1>Subscribe to MaiCinema</h1>

      <p style={styles.price}>
        Monthly Subscription: ${SUBSCRIPTION_PRICE}
      </p>

<button style={styles.button} onClick={handlePayPal}>
  Pay ${SUBSCRIPTION_PRICE} with PayPal
</button>

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