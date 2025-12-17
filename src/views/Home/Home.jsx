import './Home.css'
import Title from '../../components/Title/Title';
import Logo from '../../components/Logo/Logo';
import LogIn from '../../components/LogIn/LogIn';
import imgPath from '../../assets/images/Alhambra_view.png'

function Home() {
    return (
        <div className="page" id='home-page' style={{backgroundImage: `${imgPath}`}}>
            <Title></Title>
            <LogIn></LogIn>
        </div>
    );
}

export default Home