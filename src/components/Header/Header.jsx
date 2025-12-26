import './Header.css'
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

function Header() {
    const user = useContext(AuthContext);
    const navigate = useNavigate();
    const login = () => {
        navigate('/login');
    }
    const logout = async() => {
        
    }
    return (
        <div id='header'>
            <Logo></Logo>
            {user.token ? <button onClick={logout}></button> : <button onClick={login}>Log In</button>}
        </div>
    );
}

export default Header