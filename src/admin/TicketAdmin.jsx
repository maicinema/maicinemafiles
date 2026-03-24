import { useState, useEffect } from "react"
import TicketForm from "./TicketForm"
import { supabase } from "../lib/supabase" // ✅ FIXED

export default function TicketAdmin(){

const [tickets,setTickets] = useState([])
const [editing,setEditing] = useState(null)

/* LOAD FROM DATABASE */
async function loadTickets(){

const { data, error } = await supabase
.from("tickets")
.select("*")
.order("id",{ascending:true})

if(error){
console.log("Error loading tickets:", error)
}else{
setTickets(data)
}

}

/* LOAD ON PAGE OPEN */
useEffect(()=>{
loadTickets()
},[])

/* DELETE */
async function deleteTicket(id){

const { error } = await supabase
.from("tickets")
.delete()
.eq("id", id)

if(error){
console.log("Delete error:", error)
}else{
loadTickets() // refresh after delete
}

}

return(

<div
style={{
maxWidth:"800px",
margin:"0 auto",
padding:"20px"
}}
>

<h1 style={{textAlign:"center"}}>Ticket Manager</h1>

{/* SHOW TICKETS (READ ONLY) */}

<hr/>

<h2 style={{textAlign:"center"}}>
    
</h2>

<div style={{display:"flex", justifyContent:"center", marginTop:"20px"}}>

<TicketForm
tickets={tickets}
setTickets={setTickets}
editing={editing}
setEditing={setEditing}
reloadTickets={loadTickets} // 🔥 REQUIRED
/>

</div>

</div>

)

}