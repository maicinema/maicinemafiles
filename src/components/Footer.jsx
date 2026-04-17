import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa"
import { PLATFORM } from "../config/platform";

function Footer() {

return (

<footer style={styles.footer}>

{/* CUSTOMER SUPPORT */}

<div style={{ marginBottom: "40px" }}>

<button
onClick={() => window.location.href = "/support"}
style={{
background: "#e50914",
color: "white",
border: "none",
padding: "14px 24px",
borderRadius: "8px",
cursor: "pointer",
fontSize: "16px",
fontWeight: "bold"
}}
>
💬 Customer Support
</button>

</div>

{/* NEWSLETTER */}

<div style={styles.newsletter}>

<h2 style={styles.title}>
Join the MaiCinema Newsletter
</h2>

<p style={styles.text}>
Get updates about new films, releases and events.
</p>

<div style={styles.form}>

<input
type="email"
placeholder="Enter your email"
style={styles.input}
/>

<button style={styles.button}>
Subscribe
</button>

</div>

</div>


{/* SOCIAL MEDIA */}

<div style={styles.socials}>

<p style={{color:"#aaa"}}>
Follow MaiCinema
</p>

<div style={styles.icons}>

<a
href={PLATFORM.youtube}
target="_blank"
rel="noopener noreferrer"
>
<FaYoutube size={36} style={styles.icon}/>
</a>

<a
href={PLATFORM.facebook}
target="_blank"
rel="noopener noreferrer"
>
<FaFacebook size={36} style={styles.icon}/>
</a>

<a
href={PLATFORM.instagram}
target="_blank"
rel="noopener noreferrer"
>
<FaInstagram size={36} style={styles.icon}/>
</a>

</div>

</div>


{/* COPYRIGHT */}

<div style={styles.copy}>
© 2026 MaiCinema. All Rights Reserved.
</div>

</footer>

);

}

const styles = {

footer:{
background:"#000",
color:"white",
padding:"80px 20px",
textAlign:"center"
},

newsletter:{
marginBottom:"60px"
},

title:{
fontSize:"28px"
},

text:{
color:"#aaa",
marginTop:"10px"
},

form:{
marginTop:"20px",
display:"flex",
justifyContent:"center",
gap:"10px"
},

input:{
padding:"12px",
width:"260px",
border:"none"
},

button:{
background:"#e50914",
color:"white",
border:"none",
padding:"12px 20px",
cursor:"pointer"
},

socials:{
marginBottom:"30px"
},

icons:{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"40px",
marginTop:"15px"
},

icon:{
color:"#ccc",
cursor:"pointer",
transition:"0.3s"
},

copy:{
marginTop:"40px",
color:"#666",
fontSize:"14px"
}

};

export default Footer;