import { useLocation } from "react-router-dom";

function SupportPayment() {
  const location = useLocation();
  const tier = location.state?.tier;

  return (
    <div style={styles.page}>
      <h1>Support Payment</h1>

      {tier && (
        <>
          <h2>{tier.name}</h2>
          <p>{tier.price}</p>
        </>
      )}

      <input placeholder="Full Name" style={styles.input} />
      <input placeholder="Email" style={styles.input} />
      <input placeholder="Amount" style={styles.input} />

      <button style={styles.button}>Proceed Payment</button>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "white",
    padding: "40px",
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "300px",
  },
  button: {
    background: "#e50914",
    padding: "12px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};

export default SupportPayment;