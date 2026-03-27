import { useState } from "react";
import { supabase } from "../lib/supabase";

function ResetPassword(){

const [password,setPassword] = useState("");
const [message,setMessage] = useState("");

async function handleReset(e){
e.preventDefault();

const { error } = await supabase.auth.updateUser({
  password
});

if(error){
  setMessage(error.message);
} else {
  setMessage("Password updated successfully. You can login now.");
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

<h2>Reset Password</h2>

<form onSubmit={handleReset}>

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{
display:"block",
marginBottom:"12px",
padding:"10px",
width:"100%"
}}
/>

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
Update Password
</button>

</form>

<p style={{marginTop:"10px"}}>{message}</p>

</div>

</div>
);

}

export default ResetPassword;