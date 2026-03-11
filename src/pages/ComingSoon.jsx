import comingsoon from "../assets/comingsoon.jpg";

function ComingSoon() {

const films = [

{
title:"Silent Streets",
rating:"PG-13",
genre:"Drama",
description:"A quiet city hides a dangerous secret.",
release:"June 15, 2026",
poster:"/src/assets/film1.jpg"
},

{
title:"Last Frame",
rating:"PG-16",
genre:"Thriller",
description:"A filmmaker records something terrifying.",
release:"June 22, 2026",
poster:"/src/assets/film2.jpg"
},

{
title:"Night Call",
rating:"PG-13",
genre:"Mystery",
description:"One phone call changes everything.",
release:"July 2, 2026",
poster:"/src/assets/film3.jpg"
},

{
title:"Dust & Echo",
rating:"PG",
genre:"Drama",
description:"A story about memory and loss.",
release:"July 12, 2026",
poster:"/src/assets/film4.jpg"
},

{
title:"Broken Light",
rating:"PG-13",
genre:"Thriller",
description:"A photographer captures the wrong moment.",
release:"July 20, 2026",
poster:"/src/assets/film1.jpg"
},

{
title:"City After Dark",
rating:"PG-13",
genre:"Drama",
description:"A city that never sleeps hides dark stories.",
release:"August 3, 2026",
poster:"/src/assets/film2.jpg"
},

{
title:"Silent Voices",
rating:"PG",
genre:"Drama",
description:"Voices from the past begin to surface.",
release:"August 14, 2026",
poster:"/src/assets/film3.jpg"
},

{
title:"Shadow Room",
rating:"PG-13",
genre:"Mystery",
description:"Something waits behind the door.",
release:"August 28, 2026",
poster:"/src/assets/film4.jpg"
}

];

return (

<div style={styles.page}>

{/* BANNER */}

<div
style={{
...styles.banner,
backgroundImage:`url(${comingsoon})`
}}
>

<div style={styles.bannerOverlay}>
<h1 style={styles.bannerTitle}>Coming Soon</h1>
</div>

</div>

{/* FILM GRID */}

<div style={styles.section}>

<div style={styles.grid}>

{films.map((film,index)=>(

<div
key={index}
style={styles.card}
onMouseEnter={(e)=>{
e.currentTarget.style.transform="scale(1.1)";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.transform="scale(1)";
}}
>

<img
src={film.poster}
alt={film.title}
style={styles.poster}
/>

<div style={styles.info}>

<h3 style={styles.title}>{film.title}</h3>

<p style={styles.meta}>
{film.genre} • {film.rating}
</p>

<p style={styles.desc}>
{film.description}
</p>

<p style={styles.release}>
Release: {film.release}
</p>

</div>

</div>

))}

</div>

</div>

</div>

);

}

const styles = {

page:{
background:"#000",
color:"white"
},

banner:{
height:"400px",
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center"
},

bannerOverlay:{
paddingLeft:"80px"
},

bannerTitle:{
fontSize:"48px"
},

section:{
padding:"80px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"30px"
},

card:{
background:"#111",
borderRadius:"8px",
overflow:"hidden",
cursor:"pointer",
transition:"transform 0.3s"
},

poster:{
width:"100%",
height:"160px",
objectFit:"cover"
},

info:{
padding:"15px"
},

title:{
margin:"0",
fontSize:"18px"
},

meta:{
color:"#bbb",
fontSize:"13px"
},

desc:{
color:"#888",
fontSize:"13px"
},

release:{
color:"#00ffae",
fontSize:"13px",
marginTop:"8px"
}

};

export default ComingSoon;