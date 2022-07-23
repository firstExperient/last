import React, { useEffect, useState } from "react";
import { url } from "../App";
import { useNavigate } from "react-router-dom";
import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme
import { useQuill } from "react-quilljs";
//or const { useQuill } = require('react-quilljs');
import Quill from "quill";
import ImageUploader from "quill-image-uploader";
  Quill.register("modules/imageUploader", ImageUploader);
const imageUploader =  {
  upload: file => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);

      fetch(
        url + "/post-images",
        {
          credentials: "include",
          method: "POST",
          body: formData
        }
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          resolve(url + "/post-images/" +result.data.url);
        })
        .catch(error => {
          reject("Upload failed");
          console.error("Error:", error);
        });
    });
  }
}
export default () => {
  const navigate = useNavigate();
  const { quill, quillRef } = useQuill( {
    Quill:Quill,
    modules: {
      imageUploader:imageUploader
    },
    theme: 'snow'
  });
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [time, setTime] = useState("");
  const [materials, setMaterials] = useState("");
  const [labels, setLabels] = useState([]);
  const sendPost = async () => {
    let res = await fetch(url + "/posts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: quill.root.innerHTML,
        name: name,
        labels: labels,
        age:age,
        time:time,
        materials:materials
      }),
    });
    res = await res.json();
    let { postId } = res;
    console.log(res);
    navigate("/posts/" + postId);
  };
  const addLabel = (e) => {
    if (e.key == "Enter") {
      setLabels([...labels, e.target.value]);
      e.target.value = "";
      console.log(labels)
    }
  };
  return (
    <div dir="rtl" className="postP" style={{ width: 500, height: 300 }}>
      <input
      placeholder="שם הפוסט"
        type="text"
        value={name}
        onChange={({ target }) => setName(target.value)}
      ></input>
      <br/>
      <br/>
      <input placeholder="הוסף תגית" type="text" onKeyDown={addLabel}></input>
      <br/>
      {labels.map((e) => {
        return (
          <span key={e} className="labels">{e}, </span>
        );
      })}
      <div ref={quillRef} />
      <label className='search-nav-h'>גיל:</label>
      <RadioSelect name="age" set={setAge} list={["1-2","3-5","6-9","10-14"]}/>
            <label className='search-nav-h'>זמן:</label>
            <RadioSelect name="time" set={setTime} list={["פחות מ20 דקות","שעה","בין שעה לשלוש","יום"]}/>
            <label className='search-nav-h'>חומרים:</label>
            <RadioSelect name="materials" set={setMaterials} list={["ללא חומרים","חומרים ביתיים","חומרים קנויים"]}/>
      <button className="btn btn-light" onClick={sendPost}>סיימתי</button>
    </div>
  );
};

function RadioSelect({name,list,set}){
  return list.map(e => {return <div key={e}>
   <label className='search-nav-i'>{e}</label><input type="radio" onClick={({target})=>{set(target.value)}} name={name} className="search-nav-r" value={e} /></div>
  });
}
