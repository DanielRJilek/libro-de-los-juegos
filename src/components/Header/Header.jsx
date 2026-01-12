import './Header.css'
import Logo from '../Logo/Logo';
import Auth from '../Auth/Auth';
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router';

function Header() {
    const navigate = useNavigate();
    return (
        <div id='header'>
            <Logo></Logo>
            <div id='header-menu'>
                <span className='header-games' onClick={() => {navigate('/games')}}>Games</span>
                <IconContext.Provider value={{className:'audio-icon'}}>
                    <HiMiniSpeakerWave></HiMiniSpeakerWave>
                </IconContext.Provider>
                <Auth></Auth>
            </div>
            
        </div>
    );
}

export default Header