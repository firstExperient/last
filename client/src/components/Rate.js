import react,{useEffect,useState} from 'react'
import ReactStars from "react-rating-stars-component";
import { url } from "../App"
import "../style/App.css";


export default function Rate({ postId, logged }) {
    const [rate,setRate] = useState(null)
    const [isRated,setIsRated] = useState(false)
    const getRate = async () => {
        let res = await fetch(url + '/posts/' + postId + '/rate',{
            method:"GET",
            credentials:"include"
        })
        res= await res.json()
        setRate(res.rate)
        setIsRated(res.rated)
    }

    const updateRate = async (rate)=>{
        await fetch(url + '/posts/' + postId + '/rate', {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rate: rate })
        });
        getRate()
    }
    useEffect(()=>{
        getRate();
    },[])

    return <div className='rate' dir='ltr'>
        {
            rate && <ReactStars
                count={5}
                size={24}
                activeColor="#ffd700"
                isHalf={true}
                value={Math.round(rate * 2) / 2}
                a11y={true}
                edit={false}
            />
        }
        {!isRated &&  logged && <ReactStars count={5} onChange={updateRate}
            size={24} activeColor="#ffd700" isHalf={true} />}
        
    </div>

}