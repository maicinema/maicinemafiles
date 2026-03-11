import MovieCard from "./MovieCard";

import film1 from "../assets/film1.jpg";
import film2 from "../assets/film2.jpg";
import film3 from "../assets/film3.jpg";
import film4 from "../assets/film4.jpg";
import demoFilm from "../assets/videos/demoFilm.mp4";

function TrendingNow() {

  const movies = [

    {
title:"Silent Streets",
video: demoFilm,
genre:"Drama",
rating:"PG-13",
description:"A quiet city hides a dangerous secret.",
views:"12K",
price:"1.99"
},

    {
      title:"Last Frame",
      image:film2,
      genre:"Thriller",
      rating:"PG-16",
      description:"A filmmaker records something terrifying.",
      views:"9K",
      price:"1.99"
    },

    {
      title:"Night Call",
      image:film3,
      genre:"Mystery",
      rating:"PG-13",
      description:"One phone call changes everything.",
      views:"14K",
      price:"1.99"
    },

    {
      title:"Dust & Echo",
      image:film4,
      genre:"Drama",
      rating:"PG",
      description:"A story about memory and loss.",
      views:"7K",
      price:"1.99"
    }

  ];

  return (
    <div style={styles.section}>

      <h2 style={styles.heading}>Trending Now</h2>

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

export default TrendingNow;