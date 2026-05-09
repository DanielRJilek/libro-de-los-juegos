import "./Home.css";
import Header from "../../components/Header/Header";

const Home = ({ children, backdrop = "featured" }) => {
    return (
        <div className={`page home-page home-page--${backdrop}`} id="home-page">
            <Header></Header>
            <div id="main">{children}</div>
        </div>
    );
};

export default Home;
