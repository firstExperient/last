import { useState } from "react";
import { url } from "../App.js";
import { useNavigate } from "react-router-dom";


export default function Login({setLogged,setManager}) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const log = async () => {
    //add vaildation check here
    const data ={
        "name": user,
        "password": password,
      }
    const res = await fetch(url + "/users", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if(res.status == 200){
      setLogged(true)
      debugger
      if((await res.json()).userA ==2)setManager(true)
      else setManager(false)
      navigate("/")
    }else{
      setError(await res.text())
    }
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="שם משתמש"
        value={user}
        onChange={({ target }) => setUser(target.value)}
      />
      <input
        type="password"
        placeholder="סיסמא"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
       <span className="error">{error}</span>
      <button onClick={log}>אישור</button>
    </form>
  );
}
