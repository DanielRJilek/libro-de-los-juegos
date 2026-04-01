import '../Tablas.css'
import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
import Dice from "../Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../../context/UserContext";
import { socket } from "../../../socket";

const API_URL = import.meta.env.VITE_API_URL;

function Doblet() {
    const [board,setBoard] = useState([[2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2]]);
    const [currentPlayer, setCurrentPlayer] = useState({id: "", username: ""});
    const navigate = useNavigate();
    const params = useParams();
    const tableID = params.instance;
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [winner, setWinner] = useState();
    const [dice, setDice] = useState([1,1,1]);

    useEffect(() => {
        if (!user.userID) return;
        if (socket.connected) {
            socket.emit('join-table', tableID, user.userID);
        }
    }, [user.userID]);

    useEffect(() => {
        async function onGameUpdate(value) {
            setDice(value.dice);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setBoard(value.board);
            setCurrentPlayer(value.currentPlayer);
            if (value.winner) {
                setWinner(value.winner);
            }
        }
        function onConnect() {
            socket.emit('join-table', tableID, user.userID);
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game-update', onGameUpdate);
        if (!socket.connected) {
            socket.connect();
        } else {
            socket.emit('join-table', tableID, user.userID);
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game-update', onGameUpdate)
        };
        }, []);

    const quit = () => {
        socket.disconnect();
        navigate('../games/doblet')
    }

    const roll = async() => {
        try {
            const response = await fetch(`${API_URL}/games/doblet/table/${tableID}/play`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            setDice(result.dice);
            if (result.winner) {
                setBoard(result.board);
                setWinner(result.winner);
            }
            else if (result?.board && result?.currentPlayer?.username) {
                setBoard(result.board);
                setCurrentPlayer(result.currentPlayer);
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    const gameOver = () => {
    }

    const showRoll = () => {
    }

    useEffect(() => {
        const getGame = async () => {
            try {
                const response = await fetch(`${API_URL}/games/doblet/table/${tableID}`, {
                method:'GET',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                if (result.started == false) {
                    navigate('../games/doblet/table/' + tableID);
                }
                if (result?.board && result?.currentPlayer?.username) {
                    setBoard(result.board);
                    setCurrentPlayer(result.currentPlayer);
                }
                
            } 
            catch (error) {
            
            }
        }
        getGame();
    }, [])

    return (
        <div className="game-page page" id=''>
            <Header></Header>
            <div id='main'>
                <div className="game-screen">
                    <div className="game-side">
                        
                    </div>
                    <div className="game-center">
                        <div className="player-holder"></div>
                        <Board board={board} children={
                            <>
                                <Dice value={dice[0]}></Dice>
                                <Dice value={dice[1]}></Dice>
                                <Dice value={dice[2]}></Dice>
                            </>
                        }>
                        </Board>
                        
                        <div className="player-holder"></div>
                    </div>
                    <div className="game-side">
                        <div className="game-text">
                            {!winner && <h2>Current Player: {currentPlayer.username}</h2>}
                            {winner && <h2>{winner.username} wins!</h2>}
                        </div>
                        <div className="button-holder">
                            {!winner && currentPlayer._id == user.userID && <button onClick={roll}>Roll!</button>}
                            <button onClick={quit}>Quit</button>
                        </div>
                    </div>
                </div>
                
                
                
            </div>
        </div>
    )
}

export default Doblet