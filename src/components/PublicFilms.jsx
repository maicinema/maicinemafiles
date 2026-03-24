import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase";

export default function PublicFilms(){

const [films,setFilms] = useState([])

useEffect(()=>{
loadFilms()
},[])

async function loadFilms(){

const { data, error } = await supabase
.from("films")
.select("*")
.order("created_at",{ascending:false})

if(!error){
setFilms(data)
}

}

return(

<div style={{
padding:"60px",
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
gap:"30px"
}}>

{films.map((film)=>(

<div key={film.id} style={{color:"white"}}>

<img
src={film.poster_url}
style={{
width:"100%",
borderRadius:"6px"
}}
/>

<h3>{film.title}</h3>

<p style={{opacity:0.7}}>
{film.genre} • {film.rating}
</p>

</div>

))}

</div>

)

}