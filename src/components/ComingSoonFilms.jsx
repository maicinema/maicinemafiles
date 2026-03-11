import MovieCard from "./MovieCard";

import film1 from "../assets/film1.jpg";
import film2 from "../assets/film2.jpg";
import film3 from "../assets/film3.jpg";
import film4 from "../assets/film4.jpg";

function ComingSoonFilms(){

const movies=[

{
title:"Dark Horizon",
image:film1,
genre:"Sci-Fi",
rating:"PG-13",
description:"A signal from deep space arrives.",
views:"Coming Soon",
price:"1.99"
},

{
title:"Silent River",
image:film2,
genre:"Drama",
rating:"PG",
description:"A village waits for the flood.",
views:"Coming Soon",
price:"1.99"
},

{
title:"Neon Dreams",
image:film3,
genre:"Thriller",
rating:"PG-16",
description:"A city that never sleeps.",
views:"Coming Soon",
price:"1.99"
},

{
title:"The Third Door",
image:film4,
genre:"Mystery",
rating:"PG-13",
description:"One door should never be opened.",
views:"Coming Soon",
price:"1.99"
}

];

return(

<div style={styles.section}>

<h2 style={styles.heading}>Coming Soon</h2>

<div style={styles.grid}>
{movies.map((movie,index)=>(
<MovieCard key={index} movie={movie}/>
))}
</div>

</div>

)

}

const styles={

section:{
background:"black",
padding:"80px"
},

heading:{
color:"white",
marginBottom:"30px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"30px"
}

}

export default ComingSoonFilms;