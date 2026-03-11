import MovieCard from "./MovieCard";

import film1 from "../assets/film1.jpg";
import film2 from "../assets/film2.jpg";
import film3 from "../assets/film3.jpg";
import film4 from "../assets/film4.jpg";

function LeavingSoon() {

  const movies = [

{
title:"Fading Light",
image:film1,
genre:"Drama",
rating:"PG",
description:"Time runs out for a forgotten artist.",
views:"3K",
price:"1.99"
},

{
title:"Cold Harbor",
image:film2,
genre:"Thriller",
rating:"PG-16",
description:"A port town hides dark truths.",
views:"5K",
price:"1.99"
},

{
title:"Broken Tape",
image:film3,
genre:"Mystery",
rating:"PG-13",
description:"An old cassette reveals a crime.",
views:"4K",
price:"1.99"
},

{
title:"Final Train",
image:film4,
genre:"Drama",
rating:"PG",
description:"A last journey home.",
views:"6K",
price:"1.99"
}

];

  return (
    <div style={styles.section}>

      <h2 style={styles.heading}>Leaving Soon</h2>

      <div style={styles.grid}>
        {movies.map((movie, index) => (
          <MovieCard
  key={index}
  movie={movie}
/>
        ))}
      </div>

    </div>
  );
}

const styles = {

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
    gridTemplateColumns:"repeat(4, 1fr)",
    gap:"30px"
  }

};

export default LeavingSoon;