import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
// import Dice from "../Dice/Dice";
import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

function Doblet() {
    const [board,setBoard] = useState([[2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2]]);
    const auth = useContext(AuthContext);
    const roll = async() => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/${instance}/play`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const {result} = await response.json();
        } 
        catch (error) {
            console.log(error)
        }
    }

    // class Player {constructor() {}}
    // const addPlayer = async() => {}

    return (
        <div className="game-page page" id=''>
            <Header></Header>
            <div id='main'>
                <Board board={board}></Board>
                <button onClick={roll}>Roll!</button>
            </div>
        </div>
    )
}

export default Doblet