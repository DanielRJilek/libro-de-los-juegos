import './Header.css'
import Logo from '../Logo/Logo';
import Auth from '../Auth/Auth';

function Header() {
    return (
        <div id='header'>
            <Logo></Logo>
            <Auth></Auth>
        </div>
    );
}

export default Header