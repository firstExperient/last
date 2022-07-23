import react from 'react'
import SearchNav from './SearchNav'
import {useEffect,useState} from 'react'
import PostHeader from './PostHeader';
import { url } from '../App';

export default function SearchPage(){
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [age, setAge] = useState("");
    const [time, setTime] = useState("");
    const [materials, setMaterials] = useState("");
    const getPosts = async(e)=>{
      let words="?search="+search
      if(age)words+="&age="+age
      if(time)words+="&time="+time
      if(materials)words+="&materials="+materials
      const response = await fetch(url + "/posts/search" + words,{method:"get" })
      setPosts(await response.json())
      //console.log(await response.json())
    }
     useEffect(()=>{getPosts()},[age,time,materials,search]);
    return (
    <><input onChange={({target})=>setSearch(target.value)} type="text"/><div id="searchPage" dir='rtl'><SearchNav set={{setAge,setTime,setMaterials}}/><div className='feed' id="search-feed">{posts.map(post => (
        <PostHeader key={post.postId} post={post}> </PostHeader>
      ))}</div></div></>)
}