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
        <div id='play-now'>
            <button onClick={login}>Play Now</button>
            <button onClick={about}>About</button>
        </div>
    );
}

export default WelcomeButtons