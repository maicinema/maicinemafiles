import { useState } from "react";
import ImageGallery from "../components/ImageGallery";

/* PRODUCTION */
import production1 from "../assets/studio/production1.jpg";
import production2 from "../assets/studio/production2.jpg";
import production3 from "../assets/studio/production3.jpg";
import production4 from "../assets/studio/production4.jpg";
import production5 from "../assets/studio/production5.jpg";

/* TELEVISION */
import television1 from "../assets/studio/television1.jpg";
import television2 from "../assets/studio/television2.jpg";
import television3 from "../assets/studio/television3.jpg";
import television4 from "../assets/studio/television4.jpg";
import television5 from "../assets/studio/television5.jpg";

/* EVENTS */
import events1 from "../assets/studio/events1.jpg";
import events2 from "../assets/studio/events2.jpg";
import events3 from "../assets/studio/events3.jpg";
import events4 from "../assets/studio/events4.jpg";
import events5 from "../assets/studio/events5.jpg";

/* MAICINEMA */
import maicinema1 from "../assets/studio/maicinema1.jpg";
import maicinema2 from "../assets/studio/maicinema2.jpg";
import maicinema3 from "../assets/studio/maicinema3.jpg";
import maicinema4 from "../assets/studio/maicinema4.jpg";
import maicinema5 from "../assets/studio/maicinema5.jpg";

/* FOUNDER */
import founder from "../assets/studio/founder1.jpg";

function ManageStudios(){

/* EDIT STATE */

const [editing,setEditing] = useState(null)

/* PRODUCTION STATE */

const [productionText,setProductionText] = useState(`
PrinceMaozi Global Studios is built on a deep passion for cinematic storytelling and visual creativity...
`)

const [productionImages,setProductionImages] = useState([
production1,
production2,
production3,
production4,
production5
])

/* IMAGE DELETE */

const deleteImage = (index)=>{
setProductionImages(productionImages.filter((_,i)=>i!==index))
}

/* IMAGE ADD */

const addImage = (e)=>{
if(!e.target.files[0]) return

const file = URL.createObjectURL(e.target.files[0])

setProductionImages(prev=>[
...prev,
file
])
}

return(

<div style={styles.page}>


{/* FILM PRODUCTION */}

<section style={styles.section}>

<h2>Film Production</h2>

<img src={productionImages[0]} style={styles.mainImage}/>

<p style={styles.text}>
{productionText}
</p>

<ImageGallery images={productionImages}/>

<div style={styles.adminButtons}>
<button style={styles.adminBtn}>Add</button>

<button
style={styles.adminBtn}
onClick={()=>setEditing("production")}
>
Edit
</button>

<button style={styles.adminBtn}>Delete</button>
</div>

</section>



{/* TELEVISION */}

<section style={styles.section}>

<h2>Television Production</h2>

<img src={television1} style={styles.mainImage}/>

<p style={styles.text}>
Beyond film production, PrinceMaozi Global Studios is actively involved
in television production and digital broadcast media.
</p>

<ImageGallery
images={[
television1,
television2,
television3,
television4,
television5
]}
/>

<div style={styles.adminButtons}>
<button style={styles.adminBtn}>Add</button>
<button style={styles.adminBtn}>Edit</button>
<button style={styles.adminBtn}>Delete</button>
</div>

</section>



{/* EVENTS */}

<section style={styles.section}>

<h2>Event Coverage</h2>

<img src={events1} style={styles.mainImage}/>

<p style={styles.text}>
PrinceMaozi Global Studios also provides professional
coverage for live events.
</p>

<ImageGallery
images={[
events1,
events2,
events3,
events4,
events5
]}
/>

<div style={styles.adminButtons}>
<button style={styles.adminBtn}>Add</button>
<button style={styles.adminBtn}>Edit</button>
<button style={styles.adminBtn}>Delete</button>
</div>

</section>



{/* MAICINEMA */}

<section style={styles.section}>

<h2>MaiCinema</h2>

<img src={maicinema1} style={styles.mainImage}/>

<p style={styles.text}>
MaiCinema is a digital streaming platform founded to support independent filmmakers.
</p>

<ImageGallery
images={[
maicinema1,
maicinema2,
maicinema3,
maicinema4,
maicinema5
]}
/>

<div style={styles.adminButtons}>
<button style={styles.adminBtn}>Add</button>
<button style={styles.adminBtn}>Edit</button>
<button style={styles.adminBtn}>Delete</button>
</div>

</section>



{/* FOUNDER */}

<section style={styles.section}>

<h2>Founder</h2>

<div style={styles.founderCard}>

<img src={founder} style={styles.founderImage}/>

<p style={styles.text}>
PrinceMaozi (Alachekam Chisom Collins) is a fast-growing filmmaker.
</p>

</div>

<div style={styles.adminButtons}>
<button style={styles.adminBtn}>Add</button>
<button style={styles.adminBtn}>Edit</button>
<button style={styles.adminBtn}>Delete</button>
</div>

</section>



{/* EDIT FORM */}

{editing==="production" && (

<div style={styles.modal}>

<div style={styles.form}>

<h2>Edit Film Production</h2>

<textarea
style={styles.textarea}
value={productionText}
onChange={(e)=>setProductionText(e.target.value)}
/>

<h3>Gallery Images</h3>

{productionImages.map((img,index)=>(
<div key={index} style={styles.imageRow}>

<img src={img} style={styles.editImage}/>

<button
style={styles.deleteBtn}
onClick={()=>deleteImage(index)}
>
Delete
</button>

</div>
))}

<input type="file" onChange={addImage}/>

<div style={styles.formButtons}>

<button
style={styles.saveBtn}
onClick={()=>setEditing(null)}
>
Save
</button>

<button
style={styles.cancelBtn}
onClick={()=>setEditing(null)}
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

)

}

const styles={

page:{background:"#000",color:"white"},

section:{padding:"80px"},

text:{color:"#ccc",lineHeight:"1.7",maxWidth:"900px"},

mainImage:{width:"100%",maxWidth:"800px",borderRadius:"10px",marginBottom:"30px"},

founderCard:{display:"flex",gap:"40px",alignItems:"center",marginTop:"30px"},

founderImage:{width:"250px",borderRadius:"10px"},

adminButtons:{marginTop:"20px",display:"flex",gap:"10px"},

adminBtn:{background:"#111",color:"white",border:"1px solid #444",padding:"8px 14px",cursor:"pointer"},

modal:{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.9)",
display:"flex",
justifyContent:"center",
alignItems:"center"
},

form:{
background:"#111",
padding:"40px",
width:"700px"
},

textarea:{
width:"100%",
height:"200px",
marginBottom:"20px"
},

imageRow:{
display:"flex",
alignItems:"center",
gap:"20px",
marginBottom:"10px"
},

editImage:{
width:"120px"
},

deleteBtn:{
background:"red",
color:"white",
border:"none",
padding:"6px 12px",
cursor:"pointer"
},

formButtons:{
marginTop:"20px",
display:"flex",
gap:"20px"
},

saveBtn:{
background:"green",
color:"white",
border:"none",
padding:"10px 20px",
cursor:"pointer"
},

cancelBtn:{
background:"gray",
color:"white",
border:"none",
padding:"10px 20px",
cursor:"pointer"
}

};

export default ManageStudios;