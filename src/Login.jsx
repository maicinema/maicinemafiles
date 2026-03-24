import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { logAdminAction } from "./utils/adminLogger";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [message,setMessage] = useState("");
const [showPassword,setShowPassword] = useState(false);

const navigate = useNavigate();

async function handleLogin(e){

e.preventDefault();

const { error } = await supabase.auth.signInWithPassword({
email,
password
});

if(error){

setMessage("Login failed");

}else{

setMessage("Login successful");

await logAdminAction("Admin logged in");

navigate("/admin");

}

}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#000",
color:"white"
}}>

<div style={{
width:"320px",
padding:"40px",
background:"#111",
borderRadius:"8px"
}}>

<h2 style={{marginBottom:"20px"}}>Admin Login</h2>

<form onSubmit={handleLogin}>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={{
display:"block",
marginBottom:"12px",
padding:"10px",
width:"100%"
}}
/>

<div style={{position:"relative"}}>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{
display:"block",
marginBottom:"12px",
padding:"10px",
width:"100%"
}}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
style={{
position:"absolute",
right:"10px",
top:"10px",
cursor:"pointer",
fontSize:"16px"
}}
>
👁
</span>

</div>


<button
type="submit"
style={{
width:"100%",
padding:"10px",
background:"#e50914",
color:"white",
border:"none",
cursor:"pointer"
}}
>
Login
</button>

</form>

<p style={{marginTop:"10px"}}>{message}</p>

</div>

</div>

);

}