import { useParams } from "react-router-dom";

function WatchFilm(){

const { title } = useParams()

return(

<div style={styles.container}>

<h1>{title}</h1>

<video
controls
width="900"
src="/src/assets/videos/demoFilm.mp4"
/>

</div>

)

}

const styles={

container:{
background:"#000",
color:"white",
minHeight:"100vh",
paddingTop:"120px",
textAlign:"center"
}

}

export default WatchFilm