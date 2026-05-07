import './WelcomeButtons.css'
import {useNavigate} from 'react-router'

function WelcomeButtons() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/games');
    }
    const about = () => {
        navigate('/about');
    }
    return (
        <div id='play-now' className='animate-fade-in-up'>
            <button onClick={login}>Play Now</button>
            <button onClick={about}>About</button>
        </div>
    );
}

export default WelcomeButtons