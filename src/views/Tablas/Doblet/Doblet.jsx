import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
// import Dice from "../Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import './Doblet.css'
import { UserContext } from "../../../context/UserContext";

function Doblet() {
    const [board,setBoard] = useState([[2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2]]);
    const navigate = useNavigate();
    const params = useParams();
    const tableID = params.instance
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const ws = new WebSocket('wss://libro-de-los-juegos-server.onrender.com/ws');
    ws.send('join-table', tableID, user.userID)
    ws.onopen = () => {
        console.log("Connected to server");
    }
    ws.onmessage = (event) => {
        console.log(event.data)
    }

    const quit = () => {
        ws.close = () => {
            console.log("connection closed")
            navigate('../games/doblet')
        }
        ws.close();
    }

    const roll = async() => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/table/${tableID}/play`, {
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
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/table/${tableID}`, {
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
                <div className="game-screen">
                    <div className="game-side">
                        <div className="game-text">
                            <h2>Current Player:</h2>
                        </div>
                        <div className="button-holder">
                            <button onClick={roll}>Roll!</button>
                            <button onClick={quit}>Quit</button>
                        </div>
                    </div>
                    <div className="game-center">
                        <div className="player-holder"></div>
                        <Board board={board}></Board>
                        <div className="player-holder"></div>
                    </div>
                    <div className="game-side"></div>
                </div>
                
                
                
            </div>
        </div>
    )
}

export default Doblet