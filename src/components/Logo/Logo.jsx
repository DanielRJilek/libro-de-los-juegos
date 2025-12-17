import './Logo.css'
import imgPath from '../../assets/images/Logo.png'

function Logo() {
    return (
        <img id='logo' src={imgPath} alt="Logo"/> 
    );
}

export default Logo