import React, { useState } from "react";
import { url } from "../App";
import { useQuill } from "react-quilljs";
//or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme
import Quill from "quill";
import ImageUploader from "quill-image-uploader";
  Quill.register("modules/imageUploader", ImageUploader);
const imageUploader =  {
  upload: file => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);

      fetch(
        url + "/comment-images",
        {
          credentials: "include",
          method: "POST",
          body: formData
        }
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          resolve(url + "/comment-images/" +result.data.url);
        })
        .catch(error => {
          reject("Upload failed");
          console.error("Error:", error);
        });
    });
  }
}


export default ({postId,fresh}) => {
  const { quill, quillRef } = useQuill({
    Quill:Quill,
    modules: {
      imageUploader:imageUploader
    },
    theme: 'snow'
  });
  const sendComment = async () => {
    let res = await fetch(url + "/posts/" + postId +"/comments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: quill.root.innerHTML }),
    });
    fresh()
    quill.root.innerHTML=""
    return res
  };
  
  return (
    <div className="quill"  dir="rtl" style={{ width: 500, height: 300 }}>
      <label>הוסף תגובה</label>
      <div  ref={quillRef} />
      <button onClick={sendComment}>סיימתי</button>
    </div>
  );
};