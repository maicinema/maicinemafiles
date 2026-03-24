import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase";

export default function EventMonitor(){

const [ticketsSold,setTicketsSold] = useState(0)
const [checkedIn,setCheckedIn] = useState(0)
const [remaining,setRemaining] = useState(0)
const [feed,setFeed] = useState([])

async function loadStats(){

/* GET TOTAL SEATS FROM EVENTS TABLE */

const { data: event } = await supabase
.from("events")
.select("total_seats")
.eq("id",1)
.single()

/* GET ALL TICKETS */

const { data: tickets } = await supabase
.from("tickets")
.select("*")

if(!tickets) return

const sold = tickets.length
const used = tickets.filter(t => t.status === "used").length

setTicketsSold(sold)
setCheckedIn(used)

/* CALCULATE REMAINING SEATS */

if(event){
setRemaining(event.total_seats - sold)
}

}

async function loadFeed(){

const { data } = await supabase
.from("tickets")
.select("*")
.eq("status","used")
.order("updated_at",{ascending:false})
.limit(10)

if(data) setFeed(data)

}

useEffect(()=>{

loadStats()
loadFeed()

const channel = supabase
.channel("ticket-feed")
.on(
"postgres_changes",
{
event:"UPDATE",
schema:"public",
table:"tickets"
},
(payload)=>{

if(payload.new.status === "used"){

setFeed(prev=>[
payload.new,
...prev.slice(0,9)
])

}

loadStats()

}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

return(

<div style={{
background:"#0b0b0b",
color:"#fff",
minHeight:"100vh",
paddingTop:"140px",
paddingLeft:"40px",
paddingRight:"40px",
fontFamily:"sans-serif"
}}>

<h1 style={{
fontSize:"32px",
marginBottom:"40px",
letterSpacing:"2px"
}}>
LIVE EVENT MONITOR
</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"30px",
marginBottom:"50px"
}}>

<div style={{
background:"#111",
padding:"30px",
borderRadius:"10px",
textAlign:"center"
}}>
<h3>Tickets Sold</h3>
<h1 style={{fontSize:"48px"}}>{ticketsSold}</h1>
</div>

<div style={{
background:"#111",
padding:"30px",
borderRadius:"10px",
textAlign:"center"
}}>
<h3>Guests Checked In</h3>
<h1 style={{fontSize:"48px"}}>{checkedIn}</h1>
</div>

<div style={{
background:"#111",
padding:"30px",
borderRadius:"10px",
textAlign:"center"
}}>
<h3>Remaining Seats</h3>
<h1 style={{fontSize:"48px"}}>{remaining}</h1>
</div>

</div>

<h2 style={{
marginBottom:"20px",
letterSpacing:"1px"
}}>
ENTRANCE ACTIVITY
</h2>

<div style={{
background:"#111",
borderRadius:"10px",
padding:"20px"
}}>

{feed.length === 0 && (
<p>No guests checked in yet</p>
)}

{feed.map(ticket=>(
<div
key={ticket.id}
style={{
padding:"12px",
borderBottom:"1px solid #222"
}}
>
Ticket #{ticket.id} entered
</div>
))}

</div>

</div>

)

}