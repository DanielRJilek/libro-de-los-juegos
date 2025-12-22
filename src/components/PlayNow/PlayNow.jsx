import './PlayNow.css'
import {useNavigate} from 'react-router'

function PlayNow() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/MainMenu');
    }
    return (
        <div id='play-now'>
            <button onClick={login}>Play Now</button>
            <button>About</button>
        </div>
    );
}

export default PlayNow