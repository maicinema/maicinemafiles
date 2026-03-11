import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";

import banner1 from "../assets/film1.jpg";
import banner2 from "../assets/film2.jpg";
import banner3 from "../assets/film3.jpg";
import banner4 from "../assets/film4.jpg";

import demoFilm from "../assets/videos/demoFilm.mp4";

function MyCinema(){

const bannerMovies = [

{
title:"Silent Streets",
image:banner1,
video:demoFilm,
genre:"Drama",
rating:"PG-13",
description:"A quiet city hides a dangerous secret that slowly begins to unfold when an unexpected visitor arrives.",
views:12000
},

{
title:"Last Frame",
image:banner2,
video:demoFilm,
genre:"Thriller",
rating:"PG-16",
description:"A filmmaker accidentally records something terrifying and must uncover the truth behind what he captured.",
views:11000
},

{
title:"Night Call",
image:banner3,
video:demoFilm,
genre:"Mystery",
rating:"PG-13",
description:"One mysterious phone call changes the course of a young man's life and leads him into a dangerous discovery.",
views:10500
},

{
title:"Dust & Echo",
image:banner4,
video:demoFilm,
genre:"Drama",
rating:"PG-18",
description:"A powerful story about memory, loss, and the echoes that remain long after people disappear.",
views:9800
}

];

const [currentBanner,setCurrentBanner] = useState(0);
const videoRef = useRef(null);


/* ROTATING BANNER TIMER */

useEffect(()=>{

const interval = setInterval(()=>{

setCurrentBanner((prev)=> (prev + 1) % bannerMovies.length);

},60000);

return ()=>clearInterval(interval);

},[]);


/* PREVIEW ON HOVER */

const startPreview = ()=>{

const video = videoRef.current;

if(video){

video.currentTime = 14;
video.muted = false;
video.volume = 1;

video.style.opacity = "1";

video.play().catch(()=>{});

}

};

const stopPreview = ()=>{

const video = videoRef.current;

if(video){

video.pause();
video.style.opacity = "0";

}

};


/* FILM LIBRARY */

const movies = [

{
title:"Silent Streets",
video:demoFilm,
genre:"Drama",
rating:"PG-13",
description:"A quiet city hides a dangerous secret.",
views:"12K",
price:"1.99"
},

{
title:"Last Frame",
image:banner2,
genre:"Thriller",
rating:"PG-16",
description:"A filmmaker records something terrifying.",
views:"9K",
price:"1.99"
},

{
title:"Night Call",
image:banner3,
genre:"Mystery",
rating:"PG-13",
description:"One phone call changes everything.",
views:"14K",
price:"1.99"
},

{
title:"Dust & Echo",
image:banner4,
genre:"Drama",
rating:"PG-18",
description:"A story about memory and loss.",
views:"7K",
price:"1.99"
},

{
title:"City After Dark",
image:banner1,
genre:"Drama",
rating:"PG-13",
description:"A city that never sleeps hides dark stories.",
views:"6K",
price:"1.99"
},

{
title:"Broken Light",
image:banner2,
genre:"Thriller",
rating:"PG-13",
description:"A photographer captures the wrong moment.",
views:"8K",
price:"1.99"
},

{
title:"Silent Voices",
image:banner3,
genre:"Drama",
rating:"PG",
description:"Voices from the past begin to surface.",
views:"5K",
price:"1.99"
},

{
title:"Shadow Room",
image:banner4,
genre:"Mystery",
rating:"PG-13",
description:"Something waits behind the door.",
views:"10K",
price:"1.99"
}

];

return(

<div style={styles.page}>


{/* HERO BANNER */}

<div
style={{
...styles.banner,
backgroundImage:`url(${bannerMovies[currentBanner].image})`
}}
onMouseEnter={startPreview}
onMouseLeave={stopPreview}
>

<video
ref={videoRef}
src={bannerMovies[currentBanner].video}
style={styles.bannerVideo}
/>

<div style={styles.bannerOverlay}>

<h1 style={styles.bannerTitle}>
{bannerMovies[currentBanner].title}
</h1>

<p style={styles.bannerMeta}>
{bannerMovies[currentBanner].genre} • {bannerMovies[currentBanner].rating}
</p>

<p style={styles.bannerDesc}>
{bannerMovies[currentBanner].description}
</p>

</div>

</div>


{/* FILM GRID */}

<div style={styles.gridSection}>

<h2 style={styles.heading}>
MyCinema Library
</h2>

<div style={styles.grid}>

{movies.map((movie,index)=>(
<MovieCard key={index} movie={movie}/>
))}

</div>

</div>

</div>

)

}


/* STYLES */

const styles={

page:{
background:"#000",
color:"white"
},

banner:{
height:"500px",
backgroundSize:"cover",
backgroundPosition:"center",
position:"relative",
display:"flex",
alignItems:"center"
},

bannerVideo:{
position:"absolute",
top:0,
left:0,
width:"100%",
height:"100%",
objectFit:"cover",
opacity:0,
transition:"opacity 0.4s"
},

bannerOverlay:{
position:"relative",
paddingLeft:"80px",
maxWidth:"600px"
},

bannerTitle:{
fontSize:"48px",
margin:0
},

bannerMeta:{
color:"#ccc",
fontSize:"16px",
marginTop:"10px"
},

bannerDesc:{
color:"#aaa",
marginTop:"10px",
lineHeight:"1.5"
},

gridSection:{
padding:"80px"
},

heading:{
marginBottom:"30px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"30px"
}

};

export default MyCinema;