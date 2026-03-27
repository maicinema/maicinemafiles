import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { logAdminAction } from "./utils/adminLogger";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [message,setMessage] = useState("");
const [showPassword,setShowPassword] = useState(false);

/* ✅ NEW (ADDED ONLY) */
const [loading,setLoading] = useState(false);

const navigate = useNavigate();

async function handleLogin(e){

e.preventDefault();

setLoading(true);

const { error } = await supabase.auth.signInWithPassword({
email,
password
});

if (error) {
  console.error(error);
  setMessage(error.message);
} else {
  setMessage("Login successful");
  await logAdminAction("Admin logged in");
  navigate("/admin");
}

setLoading(false);
}

/* ✅ FORGOT PASSWORD (ADDED ONLY) */
async function handleForgotPassword(){

if(!email){
  setMessage("Enter your email first");
  return;
}

setLoading(true);

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: window.location.origin + "/reset-password"
});

if(error){
  setMessage(error.message);
}else{
  setMessage("Password reset email sent. Check your inbox.");
}

setLoading(false);
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

<form onSubmit={handleLogin} autoComplete="on">

<input
type="email"
name="email"
autoComplete="email"
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
name="password"
autoComplete="current-password"
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

{/* ✅ FORGOT PASSWORD BUTTON */}
<p
onClick={handleForgotPassword}
style={{
cursor:"pointer",
fontSize:"13px",
marginBottom:"12px",
color:"#aaa",
textDecoration:"underline"
}}
>
Forgot password?
</p>

<button
type="submit"
disabled={loading}
style={{
width:"100%",
padding:"10px",
background:"#e50914",
color:"white",
border:"none",
cursor:"pointer"
}}
>
{loading ? "Please wait..." : "Login"}
</button>

</form>

<p style={{marginTop:"10px"}}>{message}</p>

</div>

</div>

);

}