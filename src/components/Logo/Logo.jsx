import './Logo.css'
import imgPath from '../../assets/images/Logo.png'

function Logo() {
    return (
        <img className='logo' src={imgPath} alt="Logo"/> 
    );
}

export default Logo