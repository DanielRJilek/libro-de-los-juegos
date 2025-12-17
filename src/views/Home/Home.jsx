import './Home.css'
import Title from '../../components/Title/Title';
import LogIn from '../../components/LogIn/LogIn';

function Home() {
    return (
        <div className="page" id='home-page'>
            <Title></Title>
            <LogIn></LogIn>
        </div>
    );
}

export default Home