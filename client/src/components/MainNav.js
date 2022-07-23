import react, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import {url} from '../App'

export default function MainNav({logged,setLogged,setManager}){
    
   const logOut =async()=>{
    let res = await fetch(url+ '/users/log-out', {
        method:"PUT",
        credentials: "include",
    })
    if(res.status == 200){
        setLogged(false)
        setManager(false)
    }else{
      alert("error in connection to server")
    }
   }

    return <div id='mainNav' className='nav'>
        <div>
        <span>name</span>
        {logged?<button onClick={logOut} >log out</button>:
         <Link to="/sign-up"><button id="signUpBtn">sign up</button></Link>}
         {logged && <Link to="/create-post"><button id="createPostBtn">פוסט חדש</button></Link>}
         <Link to="/search"> <button id="searchBtn">חיפוש</button></Link>
         </div>
    </div>
}