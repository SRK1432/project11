import React from "react";
import './WelcomePage.css'
import { useNavigate } from "react-router-dom";
const WelcomePage=()=>{
  const navigate = useNavigate();

  const linkHandler=()=>{
    navigate("/profile");
  }
    return(
        <nav className="navbar">
        <div className="left">Welcome to Expense Tracker!!!</div>
        <div className="right"> Your profile is incomplete <a href="#" onClick={linkHandler}>Complete now</a></div>
      </nav>
    )
}
export default WelcomePage;