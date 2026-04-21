import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function CreateAccount(){

const navigate = useNavigate();
const location = useLocation();
const isSubscribeFlow = location.state?.type === "subscribe";

const [name,setName] = useState("");
const [age,setAge] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [showPassword,setShowPassword] = useState(false);

const handleSubmit = async (e)=>{

e.preventDefault();

/* PASSWORD STRENGTH CHECK */

const passwordRule =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(!passwordRule.test(password)){

alert(
"Password must contain:\n\n• Minimum 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character"
);

return;

}

/* ✅ SUPABASE SIGNUP */

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      age
    }
  }
});

if (error) {
  alert(error.message);
  return;
}

/* NAVIGATION */
if (isSubscribeFlow) {
  navigate("/subscribe");
} else {
  navigate("/");
}
};

return(

<div style={styles.container}>

<h1>Create Your Account</h1>

<form onSubmit={handleSubmit} style={styles.form}>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
style={styles.input}
required
/>

<input
type="number"
placeholder="Age"
value={age}
onChange={(e)=>setAge(e.target.value)}
style={styles.input}
required
/>

<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={styles.input}
required
/>

<div style={styles.passwordContainer}>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={styles.passwordInput}
required
/>

<button
type="button"
style={styles.eyeButton}
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈" : "👁"}
</button>

</div>

<p style={styles.passwordHint}>
Password must be at least 8 characters and include
uppercase, lowercase, number and special character.
</p>

<button style={styles.button}>
Continue
</button>

</form>

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
},

form:{
width:"320px",
margin:"40px auto",
display:"flex",
flexDirection:"column",
gap:"15px"
},

input:{
padding:"12px",
border:"none"
},

passwordContainer:{
display:"flex",
alignItems:"center"
},

passwordInput:{
padding:"12px",
border:"none",
flex:"1"
},

eyeButton:{
background:"#111",
border:"none",
color:"white",
padding:"0 12px",
cursor:"pointer",
fontSize:"16px"
},

passwordHint:{
fontSize:"12px",
color:"#aaa"
},

button:{
background:"#e50914",
border:"none",
color:"white",
padding:"14px",
cursor:"pointer"
}

};

export default CreateAccount;