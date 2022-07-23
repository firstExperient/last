import React from 'react';
import { url } from '../App';

import { useQuill } from 'react-quilljs';
//or const { useQuill } = require('react-quilljs');

import 'quill/dist/quill.snow.css'; // Add css for snow theme
import PostHeader from './PostHeader';
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

export default () => {
  const { quill, quillRef } = useQuill();

  console.log(quill);    // undefined > Quill Object
  console.log(quillRef); // { current: undefined } > { current: Quill Editor Reference }
  const sendPost=()=>{
    fetch(url+'/posts', {method:"POST", body:{post:quill.root.innerHTML}});
  }
  return (
    <div style={{ width: 500, height: 300 }}>
      <div ref={quillRef} />
      <button onClick={sendPost}>סיימתי</button>
    </div>
  );
};