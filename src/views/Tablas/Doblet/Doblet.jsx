import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
// import Dice from "../Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";

function Doblet() {
    const [board,setBoard] = useState([[2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2]]);
    const navigate = useNavigate();
    const params = useParams();
    const instance = params.instance
    const auth = useContext(AuthContext);
    const ws = new WebSocket('ws://https://libro-de-los-juegos-server.onrender.com:8080');
    ws.onopen = () => {
        console.log("Connected to server");
    }
    ws.onmessage = (event) => {
        console.log(event.data)
    }

    const quit = () => {
        ws.close = () => {
            console.log("connection closed")
            navigate('./games/doblet')
        }
    }

    const roll = async() => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/table/${instance}/play`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            setBoard(result.board);
        } 
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getGame = async () => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/table/${instance}`, {
            method:'GET',
            headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            const result = await response.json();
            setBoard(result.board);
        } 
        catch (error) {
        
        }
        }
        getGame();
    }, [])

    // class Player {constructor() {}}
    // const addPlayer = async() => {}

    return (
        <div className="game-page page" id=''>
            <Header></Header>
            <div id='main'>
                <Board board={board}></Board>
                <button onClick={roll}>Roll!</button>
                <button onClick={quit}>Quit</button>
            </div>
        </div>
    )
}

export default Doblet