import { useState } from "react";

function ImageGallery({ images }) {

const [currentIndex, setCurrentIndex] = useState(null);

const openImage = (index) => {
setCurrentIndex(index);
};

const closeViewer = () => {
setCurrentIndex(null);
};

const nextImage = (e) => {
e.stopPropagation();
setCurrentIndex((prev) => {
const next = prev + 1;
return next >= images.length ? 0 : next;
});
};

const prevImage = (e) => {
e.stopPropagation();
setCurrentIndex((prev) => {
const next = prev - 1;
return next < 0 ? images.length - 1 : next;
});
};

return (

<div>

{/* THUMBNAIL GRID */}

<div style={styles.grid}>

{images.map((img,index)=>(
<img
key={index}
src={img}
style={styles.thumb}
onClick={()=>openImage(index)}
/>
))}

</div>

{/* VIEWER */}

{currentIndex !== null && (

<div style={styles.viewer} onClick={closeViewer}>

<div style={styles.viewerContent} onClick={(e)=>e.stopPropagation()}>

<button style={styles.left} onClick={prevImage}>
❮
</button>

<img
src={images[currentIndex]}
style={styles.full}
/>

<button style={styles.right} onClick={nextImage}>
❯
</button>

<button style={styles.close} onClick={closeViewer}>
✕
</button>

</div>

</div>

)}

</div>

);

}

const styles = {

grid:{
display:"grid",
gridTemplateColumns:"repeat(5,1fr)",
gap:"12px",
marginTop:"25px"
},

thumb:{
width:"100%",
height:"110px",
objectFit:"cover",
borderRadius:"6px",
cursor:"pointer"
},

viewer:{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.95)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999
},

viewerContent:{
position:"relative",
display:"flex",
alignItems:"center",
justifyContent:"center"
},

full:{
maxWidth:"85vw",
maxHeight:"85vh",
borderRadius:"8px"
},

left:{
position:"absolute",
left:"-80px",
fontSize:"50px",
color:"white",
background:"none",
border:"none",
cursor:"pointer"
},

right:{
position:"absolute",
right:"-80px",
fontSize:"50px",
color:"white",
background:"none",
border:"none",
cursor:"pointer"
},

close:{
position:"absolute",
top:"-60px",
right:"0",
fontSize:"30px",
color:"white",
background:"none",
border:"none",
cursor:"pointer"
}

};

export default ImageGallery;