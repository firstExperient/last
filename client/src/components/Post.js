import react, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../App'
import CreateComment from './CreateComment'
import Rate from './Rate'

export default function Post({ logged,manager }) {
    const navigate = useNavigate()
    const params = useParams()
    const [post, setPost] = useState({ post: "", date: "", title: "", labels: [] })
    const [comments, setComments] = useState([])
    const getPost = async () => {
        let answer = await fetch(url + "/posts/" + params.postId, { method: "GET" })
        answer = await answer.json();
        console.log(answer)
        answer.labels = JSON.parse(answer.labels)
        setPost(answer)
    }
    const getComments = async () => {
        let answer = await fetch(url + "/posts/" + params.postId + "/comments", { method: "GET" })
        answer = await answer.json();
        setComments(answer)
        console.log(answer)
    }
    const deletePost=async()=>{
        debugger
        await fetch(url+"/posts/"+params.postId,{
            method:"delete",
            credentials:"include"
        })
        navigate("/")
    }
    const deleteComment=async(id)=>{
        await fetch(url+"/posts/"+params.postId + "/comments/"+id,{
            method:"delete",
            credentials:"include"
        })
        getComments()
    }
    useEffect(() => { getPost(); getComments() }, [])
    console.log(manager + "      manager")
    return (
        <div className="post">
            <div className='postBody'>
                <div className='fUD'>
                    <span id="pDate">{manager && <button onClick={deletePost}>❌</button>}  {new Date(post.date).toLocaleString()}</span>
                    
                    <span id="pUser">{post.user}   </span>
                </div>
                <h1>{post.title}</h1>
                {post.labels.map(l => { return <span key={l} className='label'>{l}</span> })}
                <div dangerouslySetInnerHTML={{ __html: post.post }} />
            </div>
            <div className='comments'>
                <h3>תגובות</h3>
                {
                    comments.map((comment) => {
                        return <div key={comment.date} className='comment'>
                           {manager && <button onClick={()=>deleteComment(comment.id)}>❌</button>}
                            <h3>{comment.user}</h3>
                            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                            <h5>{new Date(comment.date).toLocaleString()}</h5>
                        </div>
                    })
                }
                {logged && <CreateComment postId={params.postId} fresh={getComments} />}
                <Rate logged={logged} postId={params.postId} />
            </div>
        </div>)
}