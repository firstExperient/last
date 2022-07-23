import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom'
import "../style/App.css";
function PostHeader(props) {
  const { post } = props
  //   const [post, setPost] = useState([]);

  //   useEffect(() => {
  //     fetch(``)
  //       .then(response => response.json())
  //       .then(response => {
  //         setPost(response);
  //       });
  //   }, []);
  //   function toPost(e) {
  //     props.post(post);
  //   }
  return (
    <div className="postH" dir="ltr">
      <Link to={"/posts/" + post.id}>
        <img className="imgH" src={post.img}></img>
        <h2>{post.title}</h2>
        <h5>{post.user}</h5>
        {
          post.rate && <ReactStars
          count={5}
          size={24}
          activeColor="#ffd700"
          isHalf={true}
          value={Math.round(post.rate*2)/2}
          a11y={true}
          edit={false}
        />
        }
        <span>{new Date(post.date).toLocaleString()}</span>
      </Link>
    </div>
  );
}
export default PostHeader;
