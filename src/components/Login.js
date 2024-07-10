import React, { useState } from "react";
import "./Login.css";
const Login=()=>{
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [confPassword, setConfPassword] = useState('')
    const [user, setUser] = useState([]);

    
    const submitHandler=(event)=>{
        event.preventDefault();
        const user = {email,password};
        
        
        if(email==0 || password==0 || confPassword==0){
            alert('Please enter all credentials')
        }else if(password !== confPassword){
            alert('password and Confirm Password must be same')
        }
        else{
            fetch('https://react-http-a0270-default-rtdb.firebaseio.com/LoginData.json',{
                method : 'POST',
                body : JSON.stringify(user),
                headers:{
                    'Content-Type' : 'application/json'
                }
            })
            .then((response)=>response.json())
            .then((data)=>{
                setUser((prevUser)=>[...prevUser,user])
            })
            .catch((error)=>{
                console.log(error);
            })

            console.log('Login Successfully');
            setEmail('');
            setpassword('');
            setConfPassword('');
        }
    }
    return(
        <>
        <form onSubmit={submitHandler}>
            <h1>Sign Up</h1>
            <label htmlFor="email">Email:</label>
            <input type="text"
             id="email" 
             value={email} 
             placeholder="Email"
             onChange={((e)=>setEmail(e.target.value))} />

            <label htmlFor="password">Password</label>
            <input type="password"
             id="password" 
             value={password} 
             placeholder="Password"
             onChange={((e)=>setpassword(e.target.value))}/>

            <label htmlFor="password">Confirm Password</label>
            <input type="passwrod"
             id="confPassword" 
             value={confPassword} 
             placeholder="Confirm Password"
             onChange={((e)=>setConfPassword(e.target.value))}/>

            <button type="submit">Sign Up</button>
        </form>
        </>
    )
}
export default Login;