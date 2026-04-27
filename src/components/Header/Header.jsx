import './Header.css'
import Logo from '../Logo/Logo';
import Auth from '../Auth/Auth';
import { useNavigate } from 'react-router';
import MusicDrop from '../MusicDrop/MusicDrop';

function Header() {
    const navigate = useNavigate();

    return (
        <div id='header'>
            <Logo></Logo>
            <div id='header-menu'>
                <span className='header-games' onClick={() => {navigate('/games')}}>Games</span>
                <MusicDrop></MusicDrop>
                <Auth></Auth>
            </div>    
        </div>
    );
}

export default Header