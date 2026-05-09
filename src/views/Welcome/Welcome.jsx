import './Welcome.css';
import { useNavigate } from 'react-router';
function Welcome() {
    
    const navigate = useNavigate();
    return (
        <div id='welcome'>
            <div id='play-now' className='animate-fade-in-up'>
                <button onClick={() => navigate('/games')}>Play Now</button>
                <button onClick={() => navigate('/about')}>About</button>
            </div>
        </div>
    )
}

export default Welcome