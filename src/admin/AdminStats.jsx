import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase";

function AdminStats(){

const [films,setFilms] = useState(0)
const [tickets,setTickets] = useState(0)
const [checkedIn,setCheckedIn] = useState(0)
const [events,setEvents] = useState(0)

const [regularTickets,setRegularTickets] = useState(0)
const [vipTickets,setVipTickets] = useState(0)
const [premiumTickets,setPremiumTickets] = useState(0)

const [totalSeats,setTotalSeats] = useState(0)
const [remainingSeats,setRemainingSeats] = useState(0)

useEffect(()=>{

loadStats()

const interval = setInterval(()=>{
loadStats()
},3000)

return ()=> clearInterval(interval)

},[])

async function loadStats(){

try{

/* ---------------- EVENT ---------------- */

const { data:eventData, error:eventError } = await supabase
.from("events")
.select("*")
.eq("id",1)

if(eventError){
console.error(eventError)
return
}

let seats = 0

if(eventData && eventData.length > 0){
seats = eventData[0].total_seats
}

setTotalSeats(seats)

/* ---------------- TICKETS ---------------- */

const { data:ticketsData, error:ticketsError } = await supabase
.from("tickets")
.select("*")

if(ticketsError){
console.error(ticketsError)
return
}

const sold = ticketsData ? ticketsData.length : 0

setTickets(sold)

/* CHECKED IN */

const used = ticketsData ? ticketsData.filter(t=>t.status==="used") : []
setCheckedIn(used.length)

/* TYPES */

const regular = ticketsData ? ticketsData.filter(t=>t.type==="regular") : []
const vip = ticketsData ? ticketsData.filter(t=>t.type==="vip") : []
const premium = ticketsData ? ticketsData.filter(t=>t.type==="premium") : []

setRegularTickets(regular.length)
setVipTickets(vip.length)
setPremiumTickets(premium.length)

/* ---------------- SEAT CALCULATION ---------------- */

const remaining = seats - sold

setRemainingSeats(remaining)

/* ---------------- FILMS ---------------- */

const { data:filmsData } = await supabase
.from("films")
.select("*")

setFilms(filmsData ? filmsData.length : 0)

/* ---------------- EVENTS ---------------- */

const { data:eventsData } = await supabase
.from("events")
.select("*")

setEvents(eventsData ? eventsData.length : 0)

}catch(err){

console.error("AdminStats error:",err)

}

}

return(

<div style={styles.grid}>

<div style={styles.card}>
<h3>Total Seats</h3>
<p>{totalSeats}</p>
</div>

<div style={styles.card}>
<h3>Seats Remaining</h3>
<p>{remainingSeats}</p>
</div>

<div style={styles.card}>
<h3>Total Tickets Sold</h3>
<p>{tickets}</p>
</div>

<div style={styles.card}>
<h3>Check-In</h3>
<p>{checkedIn}</p>
</div>

<div style={styles.card}>
<h3>Regular Tickets</h3>
<p>{regularTickets}</p>
</div>

<div style={styles.card}>
<h3>VIP Tickets</h3>
<p>{vipTickets}</p>
</div>

<div style={styles.card}>
<h3>Premium Tickets</h3>
<p>{premiumTickets}</p>
</div>

<div style={styles.card}>
<h3>Films</h3>
<p>{films}</p>
</div>

<div style={styles.card}>
<h3>Events</h3>
<p>{events}</p>
</div>

</div>

)

}

const styles={

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",
gap:"20px",
marginTop:"40px"
},

card:{
background:"#111",
padding:"20px",
borderRadius:"8px",
textAlign:"center",
fontSize:"18px"
}

}

export default AdminStats