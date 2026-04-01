import './Game.css'
import Header from "../../components/Header/Header";

function Game({children}) {
    return (
        <div className="game-page page">
            <Header></Header>
            <div id='main'>
                {children}
            </div>
            
        </div>
    )
}

export default Game