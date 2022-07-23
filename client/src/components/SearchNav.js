import react from 'react';
//import {Link} from 'react-router-dom'

export default function SearchNav({set}){
    const {setTime,setAge,setMaterials} = set
    return <div id='searchNav'>
        <form onSubmit={(e)=>e.preventDefault()}>
            <label className='search-nav-h'>גיל:</label>
            <RadioSelect name="age" set={setAge} list={["1-2","3-5","6-9","10-14"]}/>
            <label className='search-nav-h'>זמן:</label>
            <RadioSelect name="time" set={setTime} list={["פחות מ20 דקות","שעה","בין שעה לשלוש","יום"]}/>
            <label className='search-nav-h'>חומרים:</label>
            <RadioSelect name="materials" set={setMaterials} list={["ללא חומרים","חומרים ביתיים","חומרים קנויים"]}/>
        </form>
    </div>
}

function RadioSelect({name,list,set}){
   return list.map(e => {return <div key={e}>
    <label className='search-nav-i'>{e}</label><input type="radio" onClick={({target})=>{set(target.value)}} name={name} className="search-nav-r" value={e} /></div>
   });
}