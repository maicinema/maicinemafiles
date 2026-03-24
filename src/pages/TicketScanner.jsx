import { useEffect } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../lib/supabase";

function TicketScanner(){

useEffect(()=>{

const scanner = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 },
false
)

scanner.render(

async (result)=>{

console.log("QR Result:", result)

const ticketCode = result.trim()

/* CHECK IF ENTRANCE IS LOCKED */

const { data: event } = await supabase
.from("events")
.select("*")
.eq("id",1)
.single()

if(event?.entrance_status === "LOCKED"){
alert("Entrance is locked")
return
}

/* CHECK TICKET */

const { data, error } = await supabase
.from("tickets")
.select("*")
.eq("id", ticketCode)
.single()

if(error || !data){

alert("Invalid Ticket")

return

}

/* CHECK IF ALREADY USED */

if(data.status === "used"){

alert("Ticket already used")

return

}

/* MARK TICKET USED */

await supabase
.from("tickets")
.update({ status:"used" })
.eq("id", ticketCode)

alert("Entry Approved")

},

(error)=>{}

)

return ()=>{
scanner.clear()
}

},[])

return(

<div style={{
minHeight:"100vh",
paddingTop:"140px",
display:"flex",
flexDirection:"column",
alignItems:"center",
background:"#000",
color:"#fff"
}}>

<h1>Ticket Scanner</h1>

<div
id="reader"
style={{
width:"400px",
marginTop:"40px"
}}
></div>

</div>

)

}

export default TicketScanner