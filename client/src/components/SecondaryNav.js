import react from 'react';
import { Link } from 'react-router-dom'
import "../style/App.css"


export default function SecondaryNav({ logged }) {
    return <div id='secondaryNav'>
        <ul id="s-nav-list">
            {logged && <li className='s-nav-item'><Link to="/favorites">מועדפים   </Link></li>}
            <li className='s-nav-item'><Link to="/whats-new">פוסטים חדשים   </Link></li>
            <li className='s-nav-item'><Link to="/most-popular">פוסטים פופולאריים   </Link></li>
        </ul>
    </div>
}