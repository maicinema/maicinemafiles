import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import poster from "../assets/events/nightwemarried-poster.jpg";

function Events() {

  /* TICKET STATES */

  const [ticketType,setTicketType] = useState(null);
  const [showForm,setShowForm] = useState(false);
  const [showPayment,setShowPayment] = useState(false);
  const [showTicket,setShowTicket] = useState(false);

  /* USER DATA */

  const [user,setUser] = useState({
    name:"",
    email:"",
    phone:""
  });

  /* EVENT COUNTDOWN */

  const eventDate = new Date("April 18, 2026 18:00:00 GMT+0600").getTime();

  const [timeLeft,setTimeLeft] = useState({
    days:0,
    hours:0,
    minutes:0,
    seconds:0
  });

  useEffect(()=>{

    const timer = setInterval(()=>{

      const now = new Date().getTime();
      const distance = eventDate - now;

      if(distance <= 0){
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({days,hours,minutes,seconds});

    },1000);

    return ()=>clearInterval(timer);

  },[]);


  /* FUNCTIONS */

  const selectTicket = (type)=>{
    setTicketType(type);
    setShowForm(true);
  };

  const handleChange = (e)=>{
    setUser({
      ...user,
      [e.target.name]:e.target.value
    });
  };

  const proceedPayment = ()=>{
    setShowForm(false);
    setShowPayment(true);
  };

  const confirmPayment = ()=>{
    setShowPayment(false);
    setShowTicket(true);
  };


  return(

    <div style={styles.page}>

      <h1 style={styles.heading}>
        Upcoming Event
      </h1>

      <div style={styles.eventContainer}>

        <img
          src={poster}
          alt="Event Poster"
          style={styles.poster}
        />

        <div style={styles.info}>

          <h2>
            Private Screening: The Night We Married
          </h2>

          <p>
            Join us for the exclusive private screening of the short film
            <strong> The Night We Married</strong>. This special event brings
            together filmmakers, film lovers, and invited guests for an
            intimate cinematic experience before the film begins streaming online.
          </p>

          <p>
            After the private screening, the film will begin streaming on
            Vimeo and on the MaiCinema platform, allowing viewers around
            the world to experience the story.
          </p>

          <p>
            Venue: <strong>Astana IT University Theater Hall</strong><br/>
            Date: <strong>April 18, 2026</strong><br/>
            Time: <strong>18:00 (Kazakhstan Time GMT+6)</strong>
          </p>

        </div>

      </div>


      {/* COUNTDOWN */}

      <div style={styles.countdownBox}>

        <h2>Private Screening Begins In</h2>

        <div style={styles.countdown}>

          <div>
            <h1>{timeLeft.days}</h1>
            <p>Days</p>
          </div>

          <div>
            <h1>{timeLeft.hours}</h1>
            <p>Hours</p>
          </div>

          <div>
            <h1>{timeLeft.minutes}</h1>
            <p>Minutes</p>
          </div>

          <div>
            <h1>{timeLeft.seconds}</h1>
            <p>Seconds</p>
          </div>

        </div>

      </div>


      {/* TICKETS */}

      <div style={styles.ticketSection}>

        <h2>Purchase Your Tickets</h2>

        <div style={styles.buttons}>

          <button
            style={styles.ticketBtn}
            onClick={()=>selectTicket("Regular Ticket — $2.10")}
          >
            Regular Ticket — $2.10
          </button>

          <button
            style={styles.ticketBtn}
            onClick={()=>selectTicket("VIP Ticket — $10.50")}
          >
            VIP Ticket — $10.50
          </button>

          <button
            style={styles.ticketBtn}
            onClick={()=>selectTicket("Premium Invitation")}
          >
            Premium Invitation — Pay What You Want
          </button>

        </div>

      </div>


      {/* USER FORM */}

      {showForm && (

        <div style={styles.formBox}>

          <h3>{ticketType}</h3>

          <input name="name" placeholder="Full Name" style={styles.input} onChange={handleChange}/>
          <input name="email" placeholder="Email Address" style={styles.input} onChange={handleChange}/>
          <input name="phone" placeholder="Phone Number" style={styles.input} onChange={handleChange}/>

          <button style={styles.payBtn} onClick={proceedPayment}>
            Proceed to Payment
          </button>

        </div>

      )}


      {/* PAYMENT */}

      {showPayment && (

        <div style={styles.formBox}>

          <h3>Payment Details</h3>

          <input placeholder="Name on Card" style={styles.input}/>
          <input placeholder="Card Number" style={styles.input}/>
          <input placeholder="Expiry Date (MM/YY)" style={styles.input}/>
          <input placeholder="CVV" style={styles.input}/>

          <button style={styles.payBtn} onClick={confirmPayment}>
            Confirm Payment
          </button>

        </div>

      )}


      {/* QR TICKET */}

      {showTicket && (

        <div style={styles.ticketBox}>

          <h2>Your Ticket</h2>

          <p>{user.name}</p>
          <p>{ticketType}</p>

          <div style={styles.qr}>

            <QRCode
              value={`${user.name}-${ticketType}`}
              size={180}
            />

          </div>

          <p>
            Present this QR code at the entrance for scanning.
          </p>

        </div>

      )}

    </div>

  );

}


/* STYLES */

const styles={

  page:{
    background:"#000",
    color:"white",
    padding:"80px"
  },

  heading:{
    marginBottom:"40px"
  },

  eventContainer:{
    display:"flex",
    gap:"40px"
  },

  poster:{
    width:"260px",
    borderRadius:"8px"
  },

  info:{
    maxWidth:"600px",
    lineHeight:"1.6",
    color:"#ccc"
  },

  countdownBox:{
    marginTop:"60px",
    textAlign:"center"
  },

  countdown:{
    display:"flex",
    justifyContent:"center",
    gap:"40px",
    marginTop:"20px"
  },

  ticketSection:{
    marginTop:"60px"
  },

  buttons:{
    display:"flex",
    gap:"20px",
    marginTop:"20px"
  },

  ticketBtn:{
    background:"#e50914",
    border:"none",
    color:"white",
    padding:"14px 20px",
    cursor:"pointer",
    borderRadius:"4px"
  },

  formBox:{
    marginTop:"40px",
    display:"flex",
    flexDirection:"column",
    gap:"15px",
    maxWidth:"350px"
  },

  input:{
    padding:"12px",
    border:"none"
  },

  payBtn:{
    background:"#00ffae",
    border:"none",
    padding:"14px",
    cursor:"pointer"
  },

  ticketBox:{
    marginTop:"40px",
    textAlign:"center"
  },

  qr:{
    marginTop:"20px"
  }

};

export default Events;