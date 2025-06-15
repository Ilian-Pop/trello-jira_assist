import { useState } from "react"
import { setExit } from "../functions/checkLoginFunction"
function Chat(props){
    const [value, setValue] = useState('');
    function changeText(e){
        if(value==="Вихід"){
            setExit(props.setLogin)
        }
    }
    return<div className="osnova">
        <p>{'Вітаю '+localStorage.getItem('lastName')+' '+localStorage.getItem('name')+' '+localStorage.getItem('middleName')+'!'}</p>
        <div className="inputer">
            <input value={value} onChange={(e)=>setValue(e.target.value)} placeholder="ПОВІДОМЛЕННЯ"/>
            <button onClick={()=>changeText()}>{'>'}</button>
        </div>
    </div>
}
export default Chat