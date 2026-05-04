import { useState } from "react"
import { supabase } from "../lib/supabase";

export default function AdminFilmUpload(){
console.log("✅ ADMIN UPLOAD PAGE LOADED");

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [genre,setGenre] = useState("")
const [rating,setRating] = useState("")
const [runtime,setRuntime] = useState("")
const [releaseYear,setReleaseYear] = useState("")
const [filmId, setFilmId] = useState("")

const [poster,setPoster] = useState(null)
const [film,setFilm] = useState(null)

async function uploadFilm(){
  console.log("🚀 START");

  console.log("TITLE:", title);
  console.log("POSTER:", poster);
  console.log("FILM:", film);

  if(!title || !poster || !film){
    console.log("❌ BLOCKED HERE");
    alert("Please fill all required fields")
    return
  }

  console.log("✅ PASSED VALIDATION");

/* UPLOAD POSTER */

const posterName = Date.now() + "_" + Math.random() + "_" + poster.name
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
console.log("🚀 UPLOAD FUNCTION STARTED");

/* UPLOAD FILM TO CLOUDFLARE */

const formData = new FormData()
formData.append("file", film)
console.log("🔥 FILE SIZE (MB):", (film.size / 1024 / 1024).toFixed(2));
console.log("🔥 ANON KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("🔥 FUNCTION URL:", "https://qrujwmcbobhthwzqmmjp.supabase.co/functions/v1/upload-video");


let res;

try {
  res = await fetch(
    "https://qrujwmcbobhthwzqmmjp.supabase.co/functions/v1/upload-video",
    {
      method: "POST",
      body: formData
    }
  );
} catch (err) {
  console.error("❌ FETCH ERROR:", err);
  alert("Network error — function not reached");
  return;
}

console.log("🔥 STATUS:", res.status);

const raw = await res.text();
console.log("🔥 RAW RESPONSE:", raw);

if (!res.ok) {
  alert("Upload failed: " + raw);
  return;
}

const result = JSON.parse(raw);
if (!result.playbackUrl) {
  alert("Cloudflare upload failed");
  return;
}

const filmUrl = result.playbackUrl;

/* SAVE FILM TO DATABASE */

const { error:dbError } = await supabase
.from("films")
.upsert({
  id: Number(filmId),

  title,
  description,
  genre,
  rating,
  runtime,

  poster_url: posterUrl,
  video_url: filmUrl,

  release_year: releaseYear,
  status: "coming_soon",
  views: 0,

  // ✅ AUTO PREVIEW (VERY IMPORTANT)
  preview_start: "00:00",
  preview_end: "00:10"
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

<input
  placeholder="Film ID (to update)"
  value={filmId}
  onChange={(e)=>setFilmId(e.target.value)}
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

<p style={{ fontSize: "14px", color: "#555", maxWidth: "500px" }}>
  Recommended poster size: <strong>1920 × 1080 px</strong> landscape.
  Upload a clean poster image with <strong>no text or write-ups</strong>.
  Do not include the film title, description, credits, or any written text,
  because MaiCinema will automatically display the film title on the banner
  and film cards.
</p>

<input
type="file"
accept="image/*"
onChange={(e)=>{
  console.log("POSTER SELECTED:", e.target.files[0]);
  setPoster(e.target.files[0])
}}
/>

<br/><br/>

<label>Film File</label>
<input
type="file"
accept="video/*"
onChange={(e)=>{
  console.log("FILM SELECTED:", e.target.files[0]);
  setFilm(e.target.files[0])
}}
/>

<br/><br/>

<button
  onClick={() => {
    alert("CLICK WORKS");
    console.log("🟢 BUTTON CLICKED");
    uploadFilm();
  }}
>
  Upload Film
</button>

</div>

)

}