import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PRICE } from "../config/pricing";

function SubscribeSection(){

const navigate = useNavigate();

return(

<div style={styles.container}>

<h2 style={styles.heading}>
Unlock MaiCinema
</h2>

<div style={styles.card}>

<h3 style={styles.price}>
${SUBSCRIPTION_PRICE} / month
</h3>

<ul style={styles.list}>

<li>Unlimited access to short films</li>
<li>Watch films before public release</li>
<li>Access filmmaker exclusive content</li>
<li>No rental fees</li>

</ul>

<button
style={styles.button}
onClick={()=>navigate("/create-account",{state:{type:"subscribe"}})}
>
Subscribe Now
</button>

</div>

</div>

)

}

const styles={

container:{
background:"#000",
padding:"120px 0",
textAlign:"center",
color:"white"
},

heading:{
marginBottom:"40px"
},

card:{
width:"320px",
margin:"0 auto",
background:"#111",
padding:"40px",
borderRadius:"10px"
},

price:{
fontSize:"28px",
marginBottom:"20px",
color:"#00ffae"
},

list:{
listStyle:"none",
padding:"0",
lineHeight:"2",
marginBottom:"30px",
color:"#ccc"
},

button:{
background:"#e50914",
border:"none",
padding:"14px 24px",
color:"white",
fontSize:"16px",
cursor:"pointer",
borderRadius:"4px"
}

}

export default SubscribeSection