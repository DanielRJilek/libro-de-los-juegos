import './Header.css'
import Logo from '../Logo/Logo';

function Header() {
    return (
        <div id='header'>
            <Logo></Logo>
            <button>Log In</button>
        </div>
    );
}

export default Header