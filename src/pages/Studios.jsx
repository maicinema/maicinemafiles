import introVideo from "../assets/videos/studioIntro.mp4";
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

function Studios(){

const team=[

{ name:"Daniel Brooks", role:"Lead Developer"},
{ name:"Sophia Martinez", role:"Marketing Director"},
{ name:"Michael Tan", role:"Production Manager"},
{ name:"Aisha Bello", role:"Social Media Manager"},
{ name:"David Kim", role:"Public Relations Lead"}

]

return(

<div style={styles.page}>

{/* VIDEO BANNER */}

<div style={styles.banner}>

<video autoPlay loop muted playsInline style={styles.bannerVideo}>
<source src={introVideo} type="video/mp4"/>
</video>

<div style={styles.bannerOverlay}>
<h1 style={styles.bannerTitle}>
PrinceMaozi Global Studios
</h1>
</div>

</div>


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
</p>

<p style={styles.text}>
Using professional cameras, lighting equipment,
and advanced audio recording technology,
the studio ensures that every event is captured
with clarity and artistic presentation.
Each project is approached with attention to
detail, ensuring that the final production
preserves the atmosphere, energy,
and significance of the event.
</p>

<p style={styles.text}>
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
</p>

<p style={styles.text}>
Founded in 2026, MaiCinema was designed to bridge
the gap between independent filmmakers and global
viewers. The platform allows creators to distribute
their films digitally while maintaining creative
ownership and gaining exposure to international audiences.
</p>

<p style={styles.text}>
By focusing on short films and emerging filmmakers,
MaiCinema encourages experimentation, originality,
and storytelling that reflects diverse cultures
and perspectives. The platform represents a new
digital stage for filmmakers who want their work
to reach viewers across the world.
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

</section>


{/* FOUNDER */}

<section style={styles.section}>

<h2>Founder</h2>

<div style={styles.founderCard}>

<img src={founder} style={styles.founderImage}/>

<p style={styles.text}>
PrinceMaozi (Alachekam Chisom Collins) is a fast-growing
and award-winning filmmaker, director, actor,
and television personality. He studied Media
Technologies at Astana IT University where
he developed a strong foundation in digital
media production and storytelling.
<br/><br/>
Driven by a passion for visual storytelling,
PrinceMaozi founded PrinceMaozi Global Studios
to create a platform for cinematic innovation,
independent film production, and digital
distribution. Through the studio he continues
to develop film projects, television programs,
and streaming platforms that empower creative
voices and connect filmmakers with global audiences.
</p>

</div>

</section>


{/* TEAM */}

<section style={styles.section}>

<h2>Team Leads</h2>

<div style={styles.teamGrid}>

{team.map((member,index)=>(
<div key={index} style={styles.teamCard}>

<img src={founder} style={styles.teamImage}/>

<h4>{member.name}</h4>

<p style={styles.role}>{member.role}</p>

</div>
))}

</div>

</section>

</div>

)

}

const styles={

page:{background:"#000",color:"white"},

banner:{
height:"420px",
position:"relative",
overflow:"hidden",
display:"flex",
alignItems:"center"
},

bannerVideo:{
position:"absolute",
top:0,
left:0,
width:"100%",
height:"100%",
objectFit:"cover"
},

bannerOverlay:{
position:"relative",
paddingLeft:"80px"
},

bannerTitle:{
fontSize:"48px"
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

gallery:{
display:"grid",
gridTemplateColumns:"repeat(5,1fr)",
gap:"20px",
marginTop:"30px"
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
}

}

export default Studios