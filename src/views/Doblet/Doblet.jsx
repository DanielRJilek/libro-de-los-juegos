import '../Game/Game.css'
import "./Doblet.css"
import Header from "../../components/Header/Header"
import Board from "../../components/Board/Board";
import Dice from "../../components/Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../context/UserContext";
import { socket } from "../../socket";
import { ClipLoader } from "react-spinners";
import UserItem from '../../components/UserItem/UserItem';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL;

function Doblet() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [gameState, setGameState] = useState();
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [winner, setWinner] = useState();
    const [dice, setDice] = useState([1,1,1]);
    const [userPlayer, setUserPlayer] = useState(null);
    const [otherPlayer, setOtherPlayer] = useState(null);
    const [quitModalOpen, setQuitModalOpen] = useState(false);
    const navigate = useNavigate();
    const params = useParams(); 
    const tableID = params.instance;

    useEffect(() => {
        getGame();
    }, [])

    useEffect(() => {
        determineUserPlayer();
    }, [gameState, user.userID])

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

    const movePiece = (piece, newPosition) => {}

    const determineUserPlayer = () => {
        console.log(gameState?.players);
        if (gameState?.players) {
            for (let player of gameState?.players) {
                if (player._id == user.userID) {
                    setUserPlayer(player.playerNumber);
                    setOtherPlayer(player.playerNumber == 1 ? 2 : 1);
                        break;
                    }
                }
            }
    } 

    const quit = () => {
        socket.disconnect();
        setQuitModalOpen(false);
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
                            {otherPlayer && <UserItem key={otherPlayer-1} user={gameState.players[otherPlayer-1]}></UserItem>}
                            {userPlayer && <UserItem key={userPlayer-1} user={gameState.players[userPlayer-1]}></UserItem>}
                        </div>
                        <Board board={gameState?.board} xSize={6} ySize={4} maxPieces={2} userPlayer={userPlayer} children={
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
                            <button onClick={() => setQuitModalOpen(true)}>Quit</button>
                        </div>
                    </div>
                </div>
                <ConfirmModal
                    open={quitModalOpen}
                    onClose={() => setQuitModalOpen(false)}
                    title="Quit the game?"
                    message="The game will count as a loss."
                    onConfirm={quit}
                    confirmLabel="Quit game"
                    pendingConfirmLabel="Quitting…"
                    cancelLabel="Cancel"
                    variant="danger"
                />
            </>
        )
    }
}

export default Doblet