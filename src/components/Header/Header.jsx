import './Header.css'
import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';
import { useNavigate } from 'react-router';
import MusicDrop from '../MusicDrop/MusicDrop';

function Header() {
    const navigate = useNavigate();

    return (
        <div id='header'>
            <Logo></Logo>
            <div id='header-menu'>
                <nav>
                    <span onClick={() => {navigate('/')}}>Home</span>
                    <span onClick={() => {navigate('/about')}}>About</span>
                    <span onClick={() => {navigate('/games')}}>Games</span>
                </nav>
                <MusicDrop></MusicDrop>
                <UserMenu></UserMenu>
            </div>    
        </div>
    );
}

export default Header