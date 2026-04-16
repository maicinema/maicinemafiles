import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function TicketForm({
  tickets,
  setTickets,
  editing,
  setEditing,
  reloadTickets
}){

const [title,setTitle] = useState("");
const [price,setPrice] = useState("");
const [date,setDate] = useState("");
const [event,setEvent] = useState("");

useEffect(()=>{
  if(editing){
    setEvent(editing.event || "");
    setTitle(editing.title || "");
    setPrice(editing.price || "");
    setDate(editing.date || "");
  }
},[editing]);

async function handleSubmit(e){

e.preventDefault();

/* 🔥 ONLY ONE LOGIC PATH (FIXED) */
if (editing) {

  const { data, error } = await supabase
    .from("tickets")
    .update({
      event,
      title,
     price: price,
      date
    })
    .eq("id", editing.id)
    .select();

  console.log("TICKET UPDATE RESULT:", data, error);

  if(error){
    alert("Update failed");
    console.log(error);
  }else{
    alert("Updated successfully");
    await reloadTickets();
  }

  setEditing(null);

}else{

  const { data, error } = await supabase
  .from("tickets")
  .insert([
    {
      event,
      title,
      price: price,
      date
    }
  ])
  .select();

  console.log("TICKET INSERT RESULT:", data, error);

  if(error){
    alert("Insert failed");
    console.log(error);
  }else{
    alert("Inserted successfully");
    await reloadTickets();
  }

}

/* RESET */
setTitle("");
setPrice("");
setDate("");
setEvent("");

}

return(

<form onSubmit={handleSubmit} style={{marginTop:"20px"}}>

<div style={{marginBottom:"10px"}}>
<input
placeholder="Event Title"
value={event}
onChange={(e)=>setEvent(e.target.value)}
style={{padding:"8px", width:"250px"}}
/>
</div>

<div style={{marginBottom:"10px"}}>
<input
placeholder="Ticket Name"
value={title}
onChange={(e)=>setTitle(e.target.value)}
style={{padding:"8px", width:"250px"}}
/>
</div>

<div style={{marginBottom:"10px"}}>
<input
placeholder="Price or label"
value={price}
onChange={(e)=>setPrice(e.target.value)}
style={{padding:"8px", width:"250px"}}
/>
</div>

<div style={{marginBottom:"10px"}}>
<input
placeholder="Event Date"
value={date}
onChange={(e)=>setDate(e.target.value)}
style={{padding:"8px", width:"250px"}}
/>
</div>

<button type="submit">
{editing ? "Update Ticket" : "Go Live"}
</button>

{editing && (
<button
type="button"
onClick={()=>setEditing(null)}
>
Cancel
</button>
)}

</form>

);

}