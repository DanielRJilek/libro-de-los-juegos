import './Header.css'
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router';

function Header() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/login');
    }
    return (
        <div id='header'>
            <Logo></Logo>
            <button onClick={login}>Log In</button>
        </div>
    );
}

export default Header