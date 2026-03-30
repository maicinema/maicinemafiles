import { useState, useEffect } from "react";
import { PLATFORM } from "../config/platform";
import AdminStats from "./AdminStats";
import { supabase } from "../lib/supabase";
import TicketAnalytics from "./TicketAnalytics";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

function AdminDashboard(){

const [studioVideo,setStudioVideo] = useState(null);
const [homeBanner,setHomeBanner] = useState(null);
const [comingSoonBanner,setComingSoonBanner] = useState(null);
const [logo,setLogo] = useState(null);

const [visitorCount, setVisitorCount] = useState(0);
useEffect(() => {
  loadVisitors();
}, []);

async function loadVisitors() {
  const { data, error } = await supabase
    .from("visitors")
    .select("id");

  if (error) {
    console.log("Visitor fetch error:", error);
    return;
  }

  setVisitorCount(data.length);
}

const [showFooterEditor,setShowFooterEditor] = useState(false);
const [showEmails,setShowEmails] = useState(false);

/* NEWSLETTER SAMPLE DATA */

const newsletterEmails = [
"johnfilmlover@gmail.com",
"sarahproducer@gmail.com",
"cinemafan88@yahoo.com",
"director.james@outlook.com",
"shortfilmsubmissions@gmail.com"
];

/* FOOTER VALUES */

const [youtube,setYoutube] = useState(PLATFORM.youtube);
const [facebook,setFacebook] = useState(PLATFORM.facebook);
const [instagram,setInstagram] = useState(PLATFORM.instagram);
const [email,setEmail] = useState(PLATFORM.email);

const [whatsappQR,setWhatsappQR] = useState(null);

const handleSave = (item)=>{
alert(item + " updated (backend will store later)");
};

return(

<div style={styles.page}>

<AdminNavbar />
<NavigationArrows />

<div style={styles.container}>

<h1>MaiCinema Admin Dashboard</h1>

<AdminStats />

{/* 🔥 ADD THIS BLOCK RIGHT HERE */}
<div style={{
  display: "flex",
  justifyContent: "center",
  marginTop: "30px",
  marginBottom: "20px"
}}>
  <div style={{
    background: "#111",
    padding: "25px",
    borderRadius: "8px",
    minWidth: "250px",
    textAlign: "center"
  }}>
    <h2>Total Visitors</h2>
    <p style={{ fontSize: "28px", marginTop: "10px" }}>
      {visitorCount}
    </p>
  </div>
</div>

<TicketAnalytics />

<div style={styles.grid}>

{/* TICKET SCANNER */}

<div style={styles.card}>

<h2>Ticket Scanner</h2>

<p style={styles.desc}>
Scan guest tickets at event entrance
</p>

<button
style={styles.button}
onClick={()=>window.open("/ticket-scanner","_blank")}
>
Open Scanner
</button>

</div>


{/* EVENT MONITOR */}

<div style={styles.card}>

<h2>Event Monitor</h2>

<p style={styles.desc}>
Live guest entry monitor
</p>

<button
style={styles.button}
onClick={()=>window.open("/event-monitor","_blank")}
>
Open Monitor
</button>

</div>


{/* EVENT CONTROL */}

<div style={styles.card}>

<h2>Event Control</h2>

<p style={styles.desc}>
Lock entrance or manage seats
</p>

<button
style={styles.button}
onClick={()=>window.open("/event-control","_blank")}
>
Open Control
</button>

</div>


{/* STUDIO INTRO VIDEO */}

<div style={styles.card}>

<h2>Studio Intro Video</h2>

<input
type="file"
accept="video/*"
onChange={(e)=>setStudioVideo(e.target.files[0])}
/>

{studioVideo && (
<p style={styles.preview}>{studioVideo.name}</p>
)}

<button
style={styles.button}
onClick={()=>handleSave("Studio Intro Video")}
>
Save
</button>

</div>


{/* HOME BANNER */}

<div style={styles.card}>

<h2>Home Banner</h2>

<input
type="file"
accept="image/*"
onChange={(e)=>setHomeBanner(e.target.files[0])}
/>

{homeBanner && (
<p style={styles.preview}>{homeBanner.name}</p>
)}

<button
style={styles.button}
onClick={()=>handleSave("Home Banner")}
>
Save
</button>

</div>


{/* COMING SOON BANNER */}

<div style={styles.card}>

<h2>Coming Soon Banner</h2>

<input
type="file"
accept="image/*"
onChange={(e)=>setComingSoonBanner(e.target.files[0])}
/>

{comingSoonBanner && (
<p style={styles.preview}>{comingSoonBanner.name}</p>
)}

<button
style={styles.button}
onClick={()=>handleSave("Coming Soon Banner")}
>
Save
</button>

</div>


{/* LOGO */}

<div style={styles.card}>

<h2>Platform Logo</h2>

<input
type="file"
accept="image/*"
onChange={(e)=>setLogo(e.target.files[0])}
/>

{logo && (
<p style={styles.preview}>{logo.name}</p>
)}

<button
style={styles.button}
onClick={()=>handleSave("Logo")}
>
Save
</button>

</div>


{/* FOOTER SETTINGS */}

<div style={styles.card}>

<h2>Footer Settings</h2>

<button
style={styles.button}
onClick={()=>setShowFooterEditor(true)}
>
Edit Footer
</button>

</div>


{/* NEWSLETTER */}

<div style={styles.card}>

<h2>Newsletter Subscribers</h2>

<button
style={styles.button}
onClick={()=>setShowEmails(true)}
>
View Emails
</button>

</div>

</div>


{/* FOOTER EDITOR */}

{showFooterEditor && (

<div style={styles.modal}>

<h2>Edit Footer</h2>

<label>YouTube Link</label>
<input
value={youtube}
onChange={(e)=>setYoutube(e.target.value)}
style={styles.input}
/>

<label>Facebook Link</label>
<input
value={facebook}
onChange={(e)=>setFacebook(e.target.value)}
style={styles.input}
/>

<label>Instagram Link</label>
<input
value={instagram}
onChange={(e)=>setInstagram(e.target.value)}
style={styles.input}
/>

<label>Email Address</label>
<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={styles.input}
/>

<label>WhatsApp QR Code</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setWhatsappQR(e.target.files[0])}
/>

{whatsappQR && (
<p style={styles.preview}>{whatsappQR.name}</p>
)}

<button
style={styles.button}
onClick={()=>handleSave("Footer")}
>
Save Footer
</button>

<button
style={styles.close}
onClick={()=>setShowFooterEditor(false)}
>
Close
</button>

</div>

)}


{/* NEWSLETTER EMAIL LIST */}

{showEmails && (

<div style={styles.modal}>

<h2>Newsletter Subscribers</h2>

<ul style={styles.emailList}>

{newsletterEmails.map((mail,index)=>(
<li key={index}>{mail}</li>
))}

</ul>

<button
style={styles.close}
onClick={()=>setShowEmails(false)}
>
Close
</button>

</div>

)}

</div>

</div>

)

}

const styles={

page:{
background:"#000",
minHeight:"100vh"
},

container:{
background:"#000",
color:"white",
minHeight:"100vh",
padding:"140px 80px 80px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
gap:"25px",
marginTop:"40px"
},

card:{
background:"#111",
padding:"25px",
borderRadius:"8px"
},

desc:{
fontSize:"14px",
color:"#aaa",
marginTop:"5px"
},

button:{
marginTop:"15px",
padding:"10px 14px",
border:"none",
background:"#e50914",
color:"white",
cursor:"pointer"
},

preview:{
marginTop:"10px",
color:"#00ffae",
fontSize:"14px"
},

modal:{
marginTop:"40px",
background:"#111",
padding:"30px",
borderRadius:"8px",
maxWidth:"400px"
},

input:{
display:"block",
marginTop:"10px",
padding:"10px",
width:"100%",
border:"none"
},

close:{
marginTop:"15px",
padding:"8px 12px",
background:"#444",
border:"none",
color:"white",
cursor:"pointer"
},

emailList:{
marginTop:"20px",
lineHeight:"2"
}

};

export default AdminDashboard;