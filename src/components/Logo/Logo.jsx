import './Logo.css'
import imgPath from '../../assets/images/Logo.png'
import { useNavigate } from 'react-router';

function Logo() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/')
    }
    return (
        <img className='logo' src={imgPath} alt="Logo" onClick={goHome}/> 
    );
}

export default Logo