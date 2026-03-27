import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { logAdminAction } from "./utils/adminLogger";

function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [message,setMessage] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [loading,setLoading] = useState(false);
const [resetMode,setResetMode] = useState(false);

const navigate = useNavigate();

/* LOGIN */
async function handleLogin(e){
e.preventDefault();

setLoading(true);

const { error } = await supabase.auth.signInWithPassword({
email,
password
});

if (error) {
  setMessage(error.message);
} else {
  setMessage("Login successful");
  await logAdminAction("Admin logged in");
  navigate("/admin");
}

setLoading(false);
}

/* FORGOT PASSWORD */
async function handleResetPassword(){
if(!email){
  setMessage("Enter your email first");
  return;
}

setLoading(true);

const { error } = await supabase.auth.resetPasswordForEmail(email,{
  redirectTo: "https://maicinemafiles.pages.dev/reset-password"
});

if(error){
  setMessage(error.message);
}else{
  setMessage("✅ Password reset email sent");
}

setLoading(false);
}

return(

<div style={styles.page}>

<div style={styles.box}>

<h2 style={{marginBottom:"20px"}}>
{resetMode ? "Reset Password" : "Admin Login"}
</h2>

<form onSubmit={handleLogin}>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={styles.input}
/>

{/* PASSWORD ONLY IN LOGIN MODE */}
{!resetMode && (
<div style={{position:"relative"}}>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={styles.input}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
style={styles.eye}
>
👁
</span>

</div>
)}

{/* LOGIN BUTTON */}
{!resetMode && (
<button type="submit" style={styles.button} disabled={loading}>
{loading ? "Logging in..." : "Login"}
</button>
)}

{/* RESET BUTTON */}
{resetMode && (
<button
type="button"
style={styles.button}
onClick={handleResetPassword}
disabled={loading}
>
{loading ? "Sending..." : "Send Reset Email"}
</button>
)}

</form>

{/* TOGGLE */}
<p
style={styles.link}
onClick={()=>setResetMode(!resetMode)}
>
{resetMode ? "Back to Login" : "Forgot Password?"}
</p>

<p style={{marginTop:"10px"}}>{message}</p>

</div>

</div>

);

}

const styles = {

page:{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#000",
color:"white"
},

box:{
width:"320px",
padding:"40px",
background:"#111",
borderRadius:"8px"
},

input:{
display:"block",
marginBottom:"12px",
padding:"10px",
width:"100%"
},

button:{
width:"100%",
padding:"10px",
background:"#e50914",
color:"white",
border:"none",
cursor:"pointer"
},

eye:{
position:"absolute",
right:"10px",
top:"10px",
cursor:"pointer"
},

link:{
marginTop:"10px",
fontSize:"14px",
color:"#ccc",
cursor:"pointer",
textAlign:"center"
}

};

export default Login;