import ImageGallery from "../components/ImageGallery";
import { getStudioData } from "../platform/studioData";
import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import NavigationArrows from "../components/NavigationArrows";

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

function Studios(){
const [article,setArticle] = useState(`
PrinceMaozi Global Studios is built on a deep passion for cinematic
storytelling and visual creativity. The studio focuses primarily on film
production, developing independent films, short films, and digital cinema
projects designed to reach modern global audiences. At its core, the studio
believes that powerful storytelling has the ability to inspire people,
connect cultures, and communicate ideas that transcend borders.

Through innovative filmmaking techniques, modern production technology,
and creative collaboration, the studio continues to build projects that
combine artistic expression with professional production standards.
Every film project developed under PrinceMaozi Global Studios is guided
by a commitment to originality, emotional depth, and strong visual identity.

The studio actively supports independent filmmakers, actors, writers,
and creatives by providing opportunities to collaborate and produce
meaningful content. This environment encourages experimentation,
creative growth, and the development of new voices within the film
industry. From concept development and script writing to filming,
editing, and distribution, the studio maintains a complete production
workflow designed to deliver compelling cinematic experiences.
`);

const [televisionArticle,setTelevisionArticle] = useState(`
Beyond film production, PrinceMaozi Global Studios is actively involved
in television production and digital broadcast media. The television
division focuses on developing programs that inform, entertain,
and engage audiences through compelling broadcast content.

The studio produces programs such as talk shows, podcasts,
documentary features, interview series, and digital broadcast
segments that explore social topics, cultural discussions,
entertainment trends, and current affairs. By blending
journalistic storytelling with cinematic visual production,
the studio aims to create television content that feels both
informative and visually engaging.

Modern audiences consume media across multiple digital
platforms, and PrinceMaozi Global Studios recognizes the
importance of adapting to this evolving landscape.
Through high-quality recording, editing, and distribution
strategies, the television division ensures that its
programming remains accessible, dynamic, and relevant
for today's viewers.
`);

const [eventsArticle,setEventsArticle] = useState(`
PrinceMaozi Global Studios also provides professional
coverage for live events, capturing memorable moments
through cinematic video production and photography.
Events such as concerts, weddings, conferences,
award ceremonies, and live performances are documented
with a focus on storytelling and visual impact.

Using professional cameras, lighting equipment,
and advanced audio recording technology,
the studio ensures that every event is captured
with clarity and artistic presentation.
Each project is approached with attention to
detail, ensuring that the final production
preserves the atmosphere, energy,
and significance of the event.

By combining technical expertise with creative
visual direction, PrinceMaozi Global Studios
delivers event coverage that transforms
important moments into lasting visual stories
that clients can preserve and share for years.
`);

const [maicinemaArticle,setMaicinemaArticle] = useState(`
MaiCinema is a digital streaming platform founded to
support independent filmmakers and provide audiences
with access to powerful short films from around the world.
Created as part of PrinceMaozi Global Studios, the
platform focuses on discovering new cinematic voices
and presenting stories that might otherwise remain unseen.

Founded in 2026, MaiCinema was designed to bridge
the gap between independent filmmakers and global
viewers. The platform allows creators to distribute
their films digitally while maintaining creative
ownership and gaining exposure to international audiences.

By focusing on short films and emerging filmmakers,
MaiCinema encourages experimentation, originality,
and storytelling that reflects diverse cultures
and perspectives.
`);

const [founderArticle,setFounderArticle] = useState(`
PrinceMaozi (Alachekam Chisom Collins) is a fast-growing
and award-winning filmmaker, director, actor,
and television personality. He studied Media
Technologies at Astana IT University where
he developed a strong foundation in digital
media production and storytelling.

Driven by a passion for visual storytelling,
PrinceMaozi founded PrinceMaozi Global Studios
to create a platform for cinematic innovation,
independent film production, and digital
distribution. Through the studio he continues
to develop film projects, television programs,
and streaming platforms that empower creative
voices and connect filmmakers with global audiences.
`);

const [headerImage,setHeaderImage] = useState(production1);
const [eventsHeader,setEventsHeader] = useState(events1);
const [televisionHeader,setTelevisionHeader] = useState(television1);
const [maicinemaHeader,setMaicinemaHeader] = useState(maicinema1);
const [founderHeader,setFounderHeader] = useState(founder);

const [images,setImages] = useState([
production1,
production2,
production3,
production4,
production5
]);

const [televisionImages,setTelevisionImages] = useState([
television1,
television2,
television3,
television4,
television5
]);

const [eventsImages,setEventsImages] = useState([
events1,
events2,
events3,
events4,
events5
]);

const [maicinemaImages,setMaicinemaImages] = useState([
maicinema1,
maicinema2,
maicinema3,
maicinema4,
maicinema5
]);

const deleteImage = (index)=>{
setImages(images.filter((_,i)=>i!==index))
};

const addImage = (e)=>{
if(!e.target.files[0]) return
const img = URL.createObjectURL(e.target.files[0])
setImages([...images,img])
};

/* ARTICLE FUNCTIONS */

const addGalleryImages = (e)=>{
if(!e.target.files) return

const files = Array.from(e.target.files)
const images = files.map(file => URL.createObjectURL(file))

setNewArticleGallery([...newArticleGallery,...images])
}

const publishArticle = ()=>{

const article = {
text:newArticleText,
header:newArticleHeader,
gallery:newArticleGallery,
date:new Date().toISOString()
}

setArticles([article,...articles])

setNewArticleText("")
setNewArticleHeader(null)
setNewArticleGallery([])

setFormOpen(false)
}

const studioData = getStudioData();

/* FORM STATE */
const [activeSection,setActiveSection] = useState(null);
const [formOpen,setFormOpen] = useState(false);
const [editingMember,setEditingMember] = useState(null);

/* DEFAULT TEAM */

const defaultTeam = [

{ name:"Daniel Brooks", role:"Lead Developer" },
{ name:"Sophia Martinez", role:"Marketing Director" },
{ name:"Michael Tan", role:"Production Manager" },
{ name:"Aisha Bello", role:"Social Media Manager" },
{ name:"David Kim", role:"Public Relations Lead" }

];

/* ENSURE TEAM ALWAYS SHOWS */

const [team,setTeam] = useState(
(studioData?.team && studioData.team.length > 0)
? studioData.team
: defaultTeam
);

/* STUDIO ARTICLES */

const [articles,setArticles] = useState([]);

const [newArticleText,setNewArticleText] = useState("");
const [newArticleHeader,setNewArticleHeader] = useState(null);
const [newArticleGallery,setNewArticleGallery] = useState([]);

return(

<div style={styles.page}>
  <AdminNavbar />
  <NavigationArrows />

  <div style={styles.container}>

{/* FILM PRODUCTION */}

<section style={styles.section}>

<h2>Film Production</h2>

<img src={production1} style={styles.mainImage}/>

<p style={styles.text}>
PrinceMaozi Global Studios is built on a deep passion for cinematic
storytelling and visual creativity. The studio focuses primarily on film
production, developing independent films, short films, and digital cinema
projects designed to reach modern global audiences. At its core, the studio
believes that powerful storytelling has the ability to inspire people,
connect cultures, and communicate ideas that transcend borders.
</p>

<p style={styles.text}>
Through innovative filmmaking techniques, modern production technology,
and creative collaboration, the studio continues to build projects that
combine artistic expression with professional production standards.
Every film project developed under PrinceMaozi Global Studios is guided
by a commitment to originality, emotional depth, and strong visual identity.
</p>

<p style={styles.text}>
The studio actively supports independent filmmakers, actors, writers,
and creatives by providing opportunities to collaborate and produce
meaningful content. This environment encourages experimentation,
creative growth, and the development of new voices within the film
industry. From concept development and script writing to filming,
editing, and distribution, the studio maintains a complete production
workflow designed to deliver compelling cinematic experiences.
</p>

<ImageGallery
images={[
production1,
production2,
production3,
production4,
production5
]}
/>

<div style={styles.adminButtons}>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("production");setFormOpen(true)}}>Add</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("production");setFormOpen(true)}}>Edit</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("production");setFormOpen(true)}}>Delete</button>
</div>

</section>


{/* TELEVISION */}

<section style={styles.section}>

<h2>Television Production</h2>

<img src={television1} style={styles.mainImage}/>

<p style={styles.text}>
Beyond film production, PrinceMaozi Global Studios is actively involved
in television production and digital broadcast media. The television
division focuses on developing programs that inform, entertain,
and engage audiences through compelling broadcast content.
</p>

<p style={styles.text}>
The studio produces programs such as talk shows, podcasts,
documentary features, interview series, and digital broadcast
segments that explore social topics, cultural discussions,
entertainment trends, and current affairs. By blending
journalistic storytelling with cinematic visual production,
the studio aims to create television content that feels both
informative and visually engaging.
</p>

<p style={styles.text}>
Modern audiences consume media across multiple digital
platforms, and PrinceMaozi Global Studios recognizes the
importance of adapting to this evolving landscape.
Through high-quality recording, editing, and distribution
strategies, the television division ensures that its
programming remains accessible, dynamic, and relevant
for today's viewers.
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

<button
style={styles.adminBtn}
onClick={()=>{
setActiveSection("television");
setFormOpen(true);
}}
>
Add
</button>

<button
style={styles.adminBtn}
onClick={()=>{
setActiveSection("television");
setFormOpen(true);
}}
>
Edit
</button>

<button
style={styles.adminBtn}
onClick={()=>{
setActiveSection("television");
setFormOpen(true);
}}
>
Delete
</button>

</section>


{/* EVENTS */}

<section style={styles.section}>

<h2>Event Coverage</h2>

<img src={events1} style={styles.mainImage}/>

<p style={styles.text}>
PrinceMaozi Global Studios also provides professional
coverage for live events, capturing memorable moments
through cinematic video production and photography.
Events such as concerts, weddings, conferences,
award ceremonies, and live performances are documented
with a focus on storytelling and visual impact.

Using professional cameras, lighting equipment,
and advanced audio recording technology,
the studio ensures that every event is captured
with clarity and artistic presentation.
Each project is approached with attention to
detail, ensuring that the final production
preserves the atmosphere, energy,
and significance of the event.

By combining technical expertise with creative
visual direction, PrinceMaozi Global Studios
delivers event coverage that transforms
important moments into lasting visual stories
that clients can preserve and share for years.
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
<button style={styles.adminBtn} onClick={()=>{setActiveSection("events");setFormOpen(true)}}>Add</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("events");setFormOpen(true)}}>Edit</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("events");setFormOpen(true)}}>Delete</button>
</div>

</section>


{/* MAICINEMA */}

<section style={styles.section}>

<h2>MaiCinema</h2>

<img src={maicinema1} style={styles.mainImage}/>
<p style={styles.text}>
MaiCinema is a digital streaming platform founded to
support independent filmmakers and provide audiences
with access to powerful short films from around the world.
Created as part of PrinceMaozi Global Studios, the
platform focuses on discovering new cinematic voices
and presenting stories that might otherwise remain unseen.

Founded in 2026, MaiCinema was designed to bridge
the gap between independent filmmakers and global
viewers. The platform allows creators to distribute
their films digitally while maintaining creative
ownership and gaining exposure to international audiences.

By focusing on short films and emerging filmmakers,
MaiCinema encourages experimentation, originality,
and storytelling that reflects diverse cultures
and perspectives.
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
<button style={styles.adminBtn} onClick={()=>{setActiveSection("maicinema");setFormOpen(true)}}>Add</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("maicinema");setFormOpen(true)}}>Edit</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("maicinema");setFormOpen(true)}}>Delete</button>
</div>

</section>

{/* STUDIO UPDATES */}

<section style={styles.section}>

<h2>Studio Updates</h2>

<div style={styles.adminButtons}>
<button
style={styles.adminBtn}
onClick={()=>{
setActiveSection("article")
setFormOpen(true)
}}
>
Add Article
</button>
</div>

{articles.map((item,index)=>(
<div key={index} style={{marginTop:"40px",maxWidth:"900px"}}>

<img
src={item.header}
style={{width:"100%",borderRadius:"10px",marginBottom:"20px"}}
/>

<p style={styles.text}>{item.text}</p>

<div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"20px"}}>

{item.gallery.map((img,i)=>(
<img
key={i}
src={img}
style={{width:"120px",borderRadius:"6px"}}
/>
))}

</div>

</div>
))}

</section>

{/* FOUNDER */}

<section style={styles.section}>

<h2>Founder</h2>

<div style={styles.founderCard}>

<img
src={founderHeader}
style={styles.founderImage}
/>

<p style={styles.text}>
PrinceMaozi (Alachekam Chisom Collins) is a fast-growing and award-winning filmmaker, 
director, actor, and television personality. He studied Media Technologies at Astana 
IT University where he developed a strong foundation in digital media production and storytelling.

Driven by a passion for visual storytelling, PrinceMaozi founded PrinceMaozi Global Studios to create
 a platform for cinematic innovation, independent film production, and digital distribution. 
 Through the studio he continues to develop film projects, television programs, and streaming 
 platforms that empower creative voices and connect filmmakers with global audiences.
</p>

</div>

<div style={styles.adminButtons}>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("founder");setFormOpen(true)}}>Add</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("founder");setFormOpen(true)}}>Edit</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("founder");setFormOpen(true)}}>Delete</button>
</div>

</section>


{/* TEAM */}

<section style={styles.section}>

<h2>Team Leads</h2>

<div style={styles.teamGrid}>

{team.map((member,index)=>(
<div key={index} style={styles.teamCard}>

<img src={member.image || founder} style={styles.teamImage}/>

<h4>{member.name}</h4>

<p style={styles.role}>{member.role}</p>

<button
style={styles.adminBtn}
onClick={()=>{
setEditingMember(index)
setActiveSection("team")
setFormOpen(true)
}}
>
Edit
</button>

</div>
))}

</div>

<div style={styles.adminButtons}>
<button
style={styles.adminBtn}
onClick={()=>{
setActiveSection("teamAdd")
setFormOpen(true)
}}
>
Add Team Member
</button>

<button style={styles.adminBtn} onClick={()=>{setActiveSection("production");setFormOpen(true)}}>Edit</button>
<button style={styles.adminBtn} onClick={()=>{setActiveSection("production");setFormOpen(true)}}>Delete</button>
</div>

</section>


{/* FORM MODAL */}

{formOpen && (

<div style={styles.modal}>

<div style={styles.form}>

<h2>
{activeSection === "article"
? "Add Article"
: activeSection === "television"
? "Edit Television Production"
: activeSection === "events"
? "Edit Event Coverage"
: activeSection === "maicinema"
? "Edit MaiCinema"
: activeSection === "founder"
? "Edit Founder"
: activeSection === "team"
? "Edit Team Member"
: "Edit Film Production"}
</h2>

{activeSection !== "team" && activeSection !== "teamAdd" && activeSection !== "article" && (
<>
<h3>Header Image</h3>

<img
src={
activeSection === "television"
? televisionHeader
: activeSection === "events"
? eventsHeader
: activeSection === "maicinema"
? maicinemaHeader
: activeSection === "founder"
? founderHeader
: headerImage
}
style={styles.editImage}
/>

<div style={{marginBottom:"20px"}}>

<button
style={styles.deleteBtn}
onClick={()=>{
if(activeSection === "television"){
setTelevisionHeader(null)
}else if(activeSection === "events"){
setEventsHeader(null)
}else if(activeSection === "maicinema"){
setMaicinemaHeader(null)
}else if(activeSection === "founder"){
setFounderHeader(null)
}else{
setHeaderImage(null)
}
}}
>
Delete Header
</button>

<input
type="file"
onChange={(e)=>{
if(!e.target.files[0]) return
const img = URL.createObjectURL(e.target.files[0])

if(activeSection === "television"){
setTelevisionHeader(img)
}else if(activeSection === "events"){
setEventsHeader(img)
}else if(activeSection === "maicinema"){
setMaicinemaHeader(img)
}else if(activeSection === "founder"){
setFounderHeader(img)
}else{
setHeaderImage(img)
}
}}
/>

</div>
</>
)}

{activeSection !== "article" && activeSection !== "team" && activeSection !== "teamAdd" && (

<textarea
style={styles.textarea}
value={
activeSection === "television"
? televisionArticle
: activeSection === "events"
? eventsArticle
: activeSection === "maicinema"
? maicinemaArticle
: activeSection === "founder"
? founderArticle
: article
}
onChange={(e)=>{
if(activeSection === "television"){
setTelevisionArticle(e.target.value)
}else if(activeSection === "events"){
setEventsArticle(e.target.value)
}else if(activeSection === "maicinema"){
setMaicinemaArticle(e.target.value)
}else if(activeSection === "founder"){
setFounderArticle(e.target.value)
}else{
setArticle(e.target.value)
}
}}
/>

)}

{activeSection === "team" && editingMember !== null && (

<div>


<h3>Edit Team Member</h3>

<img
src={team[editingMember].image || founder}
style={styles.editImage}
/>

<button
style={styles.deleteBtn}
onClick={()=>{
const updated=[...team]
updated[editingMember].image=null
setTeam(updated)
}}
>
Delete Photo
</button>

<input
style={styles.input}
value={team[editingMember].name}
onChange={(e)=>{
const updated=[...team]
updated[editingMember].name=e.target.value
setTeam(updated)
}}
placeholder="Name"
/>

<input
style={styles.input}
value={team[editingMember].role}
onChange={(e)=>{
const updated=[...team]
updated[editingMember].role=e.target.value
setTeam(updated)
}}
placeholder="Role"
/>

<input
type="file"
onChange={(e)=>{
if(!e.target.files[0]) return
const img = URL.createObjectURL(e.target.files[0])

const updated=[...team]
updated[editingMember].image=img
setTeam(updated)
}}
/>

</div>

)}

{activeSection === "teamAdd" && (

<div>

<h3>Add Team Member</h3>

<div
style={{
width:"120px",
height:"120px",
border:"1px dashed #666",
display:"flex",
alignItems:"center",
justifyContent:"center",
marginBottom:"10px"
}}
>
Image
</div>

<input
type="file"
/>

<input
style={styles.input}
placeholder="Name"
/>

<input
style={styles.input}
placeholder="Role"
/>

<div style={styles.formButtons}>

<button
style={styles.saveBtn}
onClick={()=>setFormOpen(false)}
>
Go Live
</button>

<button
style={styles.cancelBtn}
onClick={()=>setFormOpen(false)}
>
Cancel
</button>

</div>

</div>

)}

{activeSection === "article" && (

<div>

<h3>Header Image</h3>

<input
type="file"
onChange={(e)=>{
if(!e.target.files[0]) return
const img = URL.createObjectURL(e.target.files[0])
setNewArticleHeader(img)
}}
/>

{newArticleHeader && (
<img src={newArticleHeader} style={styles.editImage}/>
)}

{activeSection === "teamAdd" && (

<div>

<h3>Add Team Member</h3>

<div
style={{
width:"120px",
height:"120px",
border:"1px dashed #666",
display:"flex",
alignItems:"center",
justifyContent:"center",
marginBottom:"10px"
}}
>
Image
</div>

<input type="file" />

<input
style={styles.input}
placeholder="Name"
/>

<input
style={styles.input}
placeholder="Role"
/>

<div style={styles.formButtons}>

<button
style={styles.saveBtn}
onClick={()=>setFormOpen(false)}
>
Go Live
</button>

<button
style={styles.cancelBtn}
onClick={()=>setFormOpen(false)}
>
Cancel
</button>

</div>

</div>

)}

<h3>Article</h3>

<textarea
style={{width:"100%",height:"300px"}}
value={newArticleText}
onChange={(e)=>setNewArticleText(e.target.value)}
placeholder="Write article here..."
/>

<h3>Gallery Images</h3>

<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>

<input type="file" />
<input type="file" />
<input type="file" />
<input type="file" />
<input type="file" />

</div>

<div style={styles.formButtons}>

<button
style={styles.saveBtn}
onClick={publishArticle}
>
Go Live
</button>

<button
style={styles.cancelBtn}
onClick={()=>setFormOpen(false)}
>
Cancel
</button>

</div>

</div>

)}

{activeSection !== "founder" && activeSection !== "team" && activeSection !== "teamAdd" && activeSection !== "article" && (
<div>
<h3>Gallery Images</h3>

{(
activeSection === "television"
? televisionImages
: activeSection === "events"
? eventsImages
: activeSection === "maicinema"
? maicinemaImages
: images
).map((img,index)=>(
<div key={index} style={styles.imageRow}>

<img src={img} style={styles.editImage}/>

<button
style={styles.deleteBtn}
onClick={()=>{
if(activeSection === "television"){
setTelevisionImages(televisionImages.filter((_,i)=>i!==index))
}else if(activeSection === "events"){
setEventsImages(eventsImages.filter((_,i)=>i!==index))
}else if(activeSection === "maicinema"){
setMaicinemaImages(maicinemaImages.filter((_,i)=>i!==index))
}else{
deleteImage(index)
}
}}
>
Delete
</button>

</div>
))}

<input type="file" onChange={addImage}/>

</div>
)}

<div style={styles.formButtons}>

<button
style={styles.saveBtn}
onClick={()=>setFormOpen(false)}
>
Save
</button>

<button
style={styles.cancelBtn}
onClick={()=>setFormOpen(false)}
>
Cancel
</button>

</div>

</div>

</div>

)}

  </div>
</div>

)

}

const styles={

page:{
background:"#000",
minHeight:"100vh"
},

container:{
background:"#000",
color:"white",
minHeight:"100vh",
padding:"140px 40px 60px"
},

section:{padding:"80px"},

text:{
color:"#ccc",
lineHeight:"1.7",
maxWidth:"900px"
},

mainImage:{
width:"100%",
maxWidth:"800px",
borderRadius:"10px",
marginBottom:"30px"
},

founderCard:{
display:"flex",
gap:"40px",
alignItems:"center",
marginTop:"30px"
},

founderImage:{
width:"250px",
borderRadius:"10px"
},

teamGrid:{
display:"grid",
gridTemplateColumns:"repeat(5,1fr)",
gap:"30px",
marginTop:"40px"
},

teamCard:{textAlign:"center"},

teamImage:{
width:"120px",
height:"120px",
borderRadius:"8px",
objectFit:"cover"
},

role:{
color:"#aaa",
fontSize:"14px"
},

adminButtons:{
marginTop:"20px",
display:"flex",
gap:"10px"
},

adminBtn:{
background:"#111",
color:"white",
border:"1px solid #444",
padding:"8px 14px",
cursor:"pointer",
borderRadius:"4px"
},

modal:{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.9)",
display:"flex",
alignItems:"center",
justifyContent:"center",
overflowY:"auto"
},

form:{
background:"#111",
padding:"40px",
width:"700px",
maxHeight:"90vh",
overflowY:"auto"
},

textarea:{
width:"100%",
height:"200px",
marginBottom:"20px"
},

formButtons:{
display:"flex",
gap:"20px"
},

saveBtn:{
background:"green",
color:"white",
border:"none",
padding:"10px 20px"
},

cancelBtn:{
background:"gray",
color:"white",
border:"none",
padding:"10px 20px"
},

imageRow:{
display:"flex",
alignItems:"center",
gap:"20px",
marginBottom:"10px"
},

editImage:{
width:"120px",
borderRadius:"6px"
},

deleteBtn:{
background:"red",
color:"white",
border:"none",
padding:"6px 12px",
cursor:"pointer"
},

input:{
width:"100%",
padding:"10px",
marginBottom:"10px",
background:"#222",
border:"1px solid #555",
color:"white"
}

};

export default Studios;