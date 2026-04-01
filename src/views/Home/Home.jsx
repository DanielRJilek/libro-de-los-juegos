import './Home.css'
import Title from '../../components/Title/Title';
import Header from '../../components/Header/Header';

const Home = ({children}) => {
    return (
        <div className="page" id='home-page'>
            <Header></Header>
            <div id='main'>
                
                {children} 
            </div>
        </div>
    );
}

export default Home