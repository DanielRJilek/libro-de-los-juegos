import Header from "../../../components/Header/Header"
import Board from "../Board/Board";

function Doblet() {
    const rollDice = () => {
        const dice = [];
        for (i=0;i<3;i++) {
            dice.push(Math.random() * (6-1) + 1);
        }
        return dice;
    }

    return (
        <div className="game-page page" id=''>
            <Header></Header>
            <div id='main'>
                <Board></Board>
            </div>
        </div>
    )
}

export default Doblet