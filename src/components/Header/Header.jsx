import './Header.css'
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router';
import useAuthContext from '../../hooks/useAuthContext';
import AuthProvider from '../../context/AuthContext';
import LogIn from '../LogIn/LogIn';

function Header() {
    const {user} = useAuthContext;
    const navigate = useNavigate();
    const login = () => {
        navigate('/login');
    }
    return (
        <div id='header'>
            <Logo></Logo>
            {user ? <button className='profile-button'></button> : <button onClick={login}>Log In</button>}
        </div>
    );
}

export default Header