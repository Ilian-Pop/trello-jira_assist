import React, { useState } from "react";
import { setCheckLogin1 } from "../functions/checkLoginFunction";
function Login(props){
    const [name, setName]= useState(localStorage.getItem('name'));
    const [lastName, setLastName]= useState(localStorage.getItem('lastName'));
    const [middleName, setMiddleName]= useState(localStorage.getItem('middleName'));
    const [trello, setTrello]= useState(localStorage.getItem('trello'));
    const [jira, setJira]= useState(localStorage.getItem('jira'));
    
    return <div className="loginPanel">
        <input value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="ІМ'Я"/>
        <input value={lastName} onChange={(e)=>{setLastName(e.target.value)}} placeholder="ПРІЗВИЩЕ"/>
        <input value={middleName} onChange={(e)=>{setMiddleName(e.target.value)}} placeholder="ПО-БАТЬКОВІ"/>
        <input value={trello} onChange={(e)=>{setTrello(e.target.value)}} placeholder="TRELLO"/>
        <input value={jira} onChange={(e)=>{setJira(e.target.value)}} placeholder="JIRA"/>
        <button onClick={()=>setCheckLogin1(name, lastName, middleName, trello, jira, props.setLogin)}>ВХІД</button>
    </div>
}
export default Login