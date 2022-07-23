import React, { useState, useEffect } from "react";
import PostHeader from "./PostHeader";
import "./App.css";
import {url} from "../App";

function WhatsNew(props) {
  const [posts, setPosts] = useState([]);
  const getPosts = async()=>{
    const response = await fetch(url + "/posts/whats-new",{method:"get" })
    setPosts(await response.json())
  }
  useEffect(()=>{getPosts()},[]);
  return (
    <div className="feed" id="whats-new-page">
      {posts.map(post => (
        <PostHeader key={post.postId} post={post}> </PostHeader>
      ))}
    </div>
  );
}
export default WhatsNew;