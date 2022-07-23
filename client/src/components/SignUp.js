import { useState } from "react";
import { Link } from "react-router-dom";
import { url } from "../App.js";
import { useNavigate } from "react-router-dom";
export default function SignUp({ setLogged ,setManager}) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const checkValid = (user, password, mail) => {
    if (!user.match(/^[a-zA-Z א-ת]{3,}$/)) {
      setError("user name not valid");
      return false;
    }
    if (!password.match(/^[0-9a-zA-Zא-ת]{4,}$/)) {
      setError("password not valid");
      return false;
    }
    return true;
  };
  const sign = async () => {
    if (checkValid(user, password, mail)) {
      const data = {
        name: user,
        password: password,
        mail: mail,
      };
      const res = await fetch(url + "/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status == 200) {
        setLogged(true);
        setManager(false)
        navigate("/");
      } else {
        setError(await res.text());
      }
    }
  };
  return (
    <div>
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
        <input
          type="mail"
          placeholder="מייל"
          value={mail}
          onChange={({ target }) => setMail(target.value)}
        />
        <span className="error">{error}</span>
        <button onClick={sign}>אישור</button>
      </form>
      <Link to="/log-in">log in</Link>
    </div>
  );
}


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { url } from "../App.js";
// import { Button, Form, Input } from 'antd';
// import { useNavigate } from "react-router-dom";
// export default function SignUp({ setLogged }) {
//   const [user, setUser] = useState("");
//   const [password, setPassword] = useState("");
//   const [mail, setMail] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const checkValid = (user, password, mail) => {
//     if (!user.match(/^[a-zA-Z א-ת]{3,}$/)) {
//       setError("user name not valid");
//       return false;
//     }
//     if (!password.match(/^[0-9a-zA-Zא-ת]{4,}$/)) {
//       setError("password not valid");
//       return false;
//     }
//     return true;
//   };
//   const sign = async () => {
//     if (checkValid(user, password, mail)) {
//       const data = {
//         name: user,
//         password: password,
//         mail: mail,
//       };
//       const res = await fetch(url + "/users", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (res.status == 200) {
//         setLogged(true);
//         navigate("/");
//       } else {
//         setError(await res.text());
//       }
//     }
//   };
//   return (
//     <div>
//       <Form onSubmit={(e) => e.preventDefault()}>
//         <Input
//           type="text"
//           placeholder="שם משתמש"
//           value={user}
//           onChange={({ target }) => setUser(target.value)}
//         />
//         <br/>
//         <Input
//           type="password"
//           placeholder="סיסמא"
//           value={password}
//           onChange={({ target }) => setPassword(target.value)}
//         />
//         <br/>
//         <Input
//           type="mail"
//           placeholder="מייל"
//           value={mail}
//           onChange={({ target }) => setMail(target.value)}
//         />
//         <br/>
//         <span className="error">{error}</span>
//         <br/>
//         <Button onClick={sign}>אישור</Button>
//       </Form>
//       <Link to="/log-in">log in</Link>
//     </div>
//   );
// }
