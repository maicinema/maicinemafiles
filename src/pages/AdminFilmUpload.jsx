import { useState } from "react"
import { supabase } from "../lib/supabase";

export default function AdminFilmUpload(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [genre,setGenre] = useState("")
const [rating,setRating] = useState("")
const [runtime,setRuntime] = useState("")
const [releaseYear,setReleaseYear] = useState("")

const [poster,setPoster] = useState(null)
const [film,setFilm] = useState(null)

async function uploadFilm(){

if(!title || !poster || !film){
alert("Please fill all required fields")
return
}

/* UPLOAD POSTER */

const posterName = Date.now() + "_" + poster.name

const { data:posterData, error:posterError } = await supabase
.storage
.from("posters")
.upload(posterName, poster)

if(posterError){
console.error(posterError)
alert("Poster upload failed")
return
}

const posterUrl = supabase
.storage
.from("posters")
.getPublicUrl(posterName).data.publicUrl

/* UPLOAD FILM */

const filmName = Date.now() + "_" + film.name

const { error:filmError } = await supabase
.storage
.from("films")
.upload(filmName, film)

if(filmError){
console.error(filmError)
alert("Film upload failed")
return
}

const filmUrl = supabase
.storage
.from("films")
.getPublicUrl(filmName).data.publicUrl

/* SAVE FILM TO DATABASE */

const { error:dbError } = await supabase
.from("films")
.insert({
title,
description,
genre,
rating,
runtime,
poster: posterUrl,
video: filmUrl,
release_year: releaseYear,
status: "coming_soon",     // 🔥 IMPORTANT
views: 0                   // 🔥 IMPORTANT
})

if(dbError){
console.error(dbError)
alert("Database save failed")
return
}

alert("Film uploaded successfully")

}

return(

<div style={{padding:"80px"}}>

<h1>Upload Film</h1>

<input placeholder="Film Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<br/><br/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<br/><br/>

<input placeholder="Genre"
value={genre}
onChange={(e)=>setGenre(e.target.value)}
/>

<br/><br/>

<input placeholder="PG Rating"
value={rating}
onChange={(e)=>setRating(e.target.value)}
/>

<br/><br/>

<input placeholder="Runtime"
value={runtime}
onChange={(e)=>setRuntime(e.target.value)}
/>

<br/><br/>

<input placeholder="Release Year"
value={releaseYear}
onChange={(e)=>setReleaseYear(e.target.value)}
/>

<br/><br/>

<label>Poster</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setPoster(e.target.files[0])}
/>

<br/><br/>

<label>Film File</label>
<input
type="file"
accept="video/*"
onChange={(e)=>setFilm(e.target.files[0])}
/>

<br/><br/>

<button onClick={uploadFilm}>
Upload Film
</button>

</div>

)

}