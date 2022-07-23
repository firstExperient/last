import React, { useState, useEffect } from "react";
import PostHeader from "./PostHeader";
import "./App.css";
import {url} from "../App";

function Favorites() {
  const [posts, setPosts] = useState([]);
  const getPosts = async()=>{
    const response = await fetch(url + "/posts/favorites",{method:"get",credentials: "include", })
    setPosts(await response.json())
  }
  useEffect(()=>{getPosts()},[]);
  return (
    <div className="feed" id="favorites-page">
      {posts.map(post => (
        <PostHeader key={post.postId} post={post}> </PostHeader>
      ))}
    </div>
  );
}
export default Favorites;