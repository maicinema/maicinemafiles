import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function TicketScanner() {

  const [result, setResult] = useState("No ticket scanned");

  return (
    <div style={styles.page}>
      <h1>Scan Ticket</h1>

      <div style={styles.scanner}>
        <Scanner
          onScan={(result) => {
            if (result) {
              setResult(result[0].rawValue);
            }
          }}
        />
      </div>

      <div style={styles.result}>
        <h3>Scan Result</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}

const styles = {
  page:{
    height:"100vh",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
  },

  scanner:{
    width:"350px"
  },

  result:{
    marginTop:"20px",
    background:"#111",
    padding:"20px",
    borderRadius:"10px"
  }
};

export default TicketScanner;