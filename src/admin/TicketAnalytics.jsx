import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function TicketAnalytics(){

const [totalTickets,setTotalTickets] = useState(0);
const [sold,setSold] = useState(0);
const [checkedIn,setCheckedIn] = useState(0);

useEffect(()=>{

loadTicketStats();

},[]);

async function loadTicketStats(){

const { count:total } = await supabase
.from("tickets")
.select("*",{ count:"exact", head:true });

setTotalTickets(total || 0);

/* later we will track sold + check-ins */

const { count:used } = await supabase
.from("tickets")
.select("*",{ count:"exact", head:true })
.eq("status","used");

setSold(total || 0);
setCheckedIn(used || 0);

}

const remaining = totalTickets - sold;

return(

<div style={styles.grid}>

<div style={styles.card}>
<h3>Total Tickets</h3>
<p>{totalTickets}</p>
</div>

<div style={styles.card}>
<h3>Sold</h3>
<p>{sold}</p>
</div>

<div style={styles.card}>
<h3>Checked-In</h3>
<p>{checkedIn}</p>
</div>

<div style={styles.card}>
<h3>Remaining</h3>
<p>{remaining}</p>
</div>

</div>

);

}

const styles={

grid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px",
marginTop:"40px"
},

card:{
background:"#111",
padding:"20px",
borderRadius:"8px",
textAlign:"center",
color:"white"
}

};

export default TicketAnalytics;