import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase";

export default function EventControl(){

const [seats,setSeats] = useState(0)
const [status,setStatus] = useState("OPEN")

useEffect(()=>{
loadEvent()
},[])

async function loadEvent(){

const { data, error } = await supabase
.from("events")
.select("*")
.eq("id",1)

if(error){
console.error(error)
return
}

if(data && data.length > 0){
setSeats(data[0].total_seats)
setStatus(data[0].entrance_status)
}

}

/* UPDATE SEATS */

async function updateSeats(){

const { error } = await supabase
.from("events")
.update({ total_seats: seats })
.eq("id",1)

if(error){
console.error(error)
alert("Update failed")
return
}

alert("Seats Updated")

}

/* LOCK ENTRANCE */

async function lockEntrance(){

const { error } = await supabase
.from("events")
.update({ entrance_status:"LOCKED" })
.eq("id",1)

if(!error){
setStatus("LOCKED")
}

}

/* OPEN ENTRANCE */

async function openEntrance(){

const { error } = await supabase
.from("events")
.update({ entrance_status:"OPEN" })
.eq("id",1)

if(!error){
setStatus("OPEN")
}

}

return(

<div style={{
background:"#0b0b0b",
color:"#fff",
minHeight:"100vh",
paddingTop:"140px",
display:"flex",
justifyContent:"center"
}}>

<div style={{
width:"500px",
textAlign:"center"
}}>

<h1>EVENT CONTROL PANEL</h1>

<div style={{marginTop:"40px"}}>

<h3>Total Seats</h3>

<input
type="number"
value={seats}
onChange={(e)=>setSeats(Number(e.target.value))}
style={{
padding:"10px",
fontSize:"18px",
width:"120px",
textAlign:"center"
}}
/>

<button
onClick={updateSeats}
style={{
marginLeft:"10px",
padding:"10px 20px",
cursor:"pointer"
}}
>
Update
</button>

</div>

<div style={{marginTop:"40px"}}>

<h3>Entrance Control</h3>

<p>Status: {status}</p>

<button
onClick={openEntrance}
style={{
marginRight:"10px",
padding:"10px 20px",
cursor:"pointer"
}}
>
Open Entrance
</button>

<button
onClick={lockEntrance}
style={{
padding:"10px 20px",
cursor:"pointer"
}}
>
Lock Entrance
</button>

</div>

</div>

</div>

)

}