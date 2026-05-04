import '../Game.css'
import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
import Dice from "../Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../../context/UserContext";
import { socket } from "../../../socket";
import { ClipLoader } from "react-spinners";
import "./Doblet.css"
import UserItem from '../../../components/UserItem/UserItem';

const API_URL = import.meta.env.VITE_API_URL;

function Doblet() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [gameState, setGameState] = useState();
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [winner, setWinner] = useState();
    const [dice, setDice] = useState([1,1,1]);
    const [userPlayer, setUserPlayer] = useState();
    const [otherPlayer, setOtherPlayer] = useState();
    const navigate = useNavigate();
    const params = useParams();
    const tableID = params.instance;

    const determineUserPlayer = () => {
        if (gameState?.players[0]._id && gameState?.players[0]._id == user.userID) {
                setUserPlayer(1);
                setOtherPlayer(2);
        } else {
            setUserPlayer(2);
            setOtherPlayer(1);
        }
    }

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
            setGameState(value.gameState);
            
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
        } 
        catch (error) {
            console.log(error)
        }
    }

    const gameOver = () => {
    }

    const showRoll = () => {
    }

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
                    setGameState(result)
                    setLoading(false)
                }
                
            } 
            catch (error) {
            
            }
        }

    useEffect(() => {
        getGame();
        determineUserPlayer();
    }, [])

    if (loading) {
        return <ClipLoader></ClipLoader>
    }
    else {
        return (
                loading? <ClipLoader></ClipLoader> :
                <>
                    <div className="game-screen">
                        <div className="game-side">
                            
                        </div>
                        <div className="game-center">
                            <div className="player-holder">
                                <UserItem key={otherPlayer-1} user={gameState.players[otherPlayer-1]}></UserItem>
                                <UserItem key={userPlayer-1} user={gameState.players[userPlayer-1]}></UserItem>
                            </div>
                            <Board board={gameState?.board} userPlayer={userPlayer} otherPlayer={otherPlayer} children={
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
                                {!winner && <h2>Current Player: {gameState?.currentPlayer.username}</h2>}
                                {winner && <h2>{winner.username} wins!</h2>}
                            </div>
                            <div className="button-holder">
                                {!winner && gameState?.currentPlayer._id == user.userID && <button onClick={roll}>Roll!</button>}
                                <button onClick={quit}>Quit</button>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                </>
        )
    }
}

export default Doblet