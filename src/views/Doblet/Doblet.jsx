import '../Game/Game.css'
import "./Doblet.css"
import Board from "../../components/Board/Board";
import Dice from "../../components/Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../context/UserContext";
import { socket, emitJoinTable, SOCKET_EVENTS, SOCKET_IO_EVENTS, TABLE_UPDATE_KIND } from "../../socket";
import { ClipLoader } from "react-spinners";
import UserItem from '../../components/UserItem/UserItem';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL;

let nextPieceId = 0;

const boardToPieces = (board) => {
    if (!Array.isArray(board)) return [];
    const pieces = [];
    for (let col = 0; col < board.length; col++) {
        for (let row = 0; row < board[col].length; row++) {
            const cell = board[col][row];
            if (!cell) continue;
            for (let k = 0; k < (cell.p1 ?? 0); k++) {
                pieces.push({
                    id: `p1-${nextPieceId++}`,
                    player: 1,
                    col,
                    row,
                });
            }
            for (let k = 0; k < (cell.p2 ?? 0); k++) {
                pieces.push({
                    id: `p2-${nextPieceId++}`,
                    player: 2,
                    col,
                    row,
                });
            }
        }
    }
    return pieces;
}

const movePiece = (prev, move) => {
    const idx = prev.findIndex(
        (p) => p.player === move.playerNumber && p.col === move.fromCol && p.row === move.fromRow
    );
    if (idx === -1) {
        console.log("piece not found");
        return prev;
    }
    if (move.toCol == null || move.toRow == null) {
        return prev.filter((_, i) => i !== idx);
    }
    return prev.map((p, i) =>
        i === idx ? { ...p, col: move.toCol, row: move.toRow } : p
    );
}

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
    const [pieces, setPieces] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const params = useParams(); 
    const tableID = params.instance;
    const resolvedWinner = winner ?? gameState?.winner;
    const isGameOver = Boolean(resolvedWinner);
    const didCurrentUserWin = resolvedWinner?._id == user.userID;

    useEffect(() => {
        getGame();
    }, [])

    useEffect(() => {
        determineUserPlayer();
    }, [gameState, user.userID])

    useEffect(() => {
        if (!tableID || !user.userID) return undefined;

        async function onStateUpdate(value) {
            setDice(value.dice);
            setIsAnimating(true);
            await new Promise(resolve => setTimeout(resolve, 3000));

            for (const move of value.turnMoves??[]) {
                setPieces(prev => movePiece(prev, move));
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            setGameState((prev) => {
                const next = value.gameState;
                if (!next || typeof next !== 'object') return prev;
                const merged = { ...(prev ?? {}), ...next };
                if (!Array.isArray(merged.players) && Array.isArray(prev?.players)) {
                    merged.players = prev.players;
                }
                return merged;
            });
            if (value.winner || value?.gameState?.winner) {
                setWinner(value.winner ?? value.gameState.winner);
            }
            setIsAnimating(false);
        }

        function onTableUpdate(payload) {
            const { kind } = payload ?? {};
            if (kind === TABLE_UPDATE_KIND.STATE) {
                onStateUpdate(payload);
            } else if (kind === TABLE_UPDATE_KIND.GAME_ENDED) {
                console.log("winner", payload.winner);
                setWinner(payload.winner);
            }
        }

        function onConnect() {
            emitJoinTable(tableID, user.userID);
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on(SOCKET_IO_EVENTS.CONNECT, onConnect);
        socket.on(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
        socket.on(SOCKET_EVENTS.TABLE_UPDATE, onTableUpdate);
        if (!socket.connected) {
            socket.connect();
        } else {
            emitJoinTable(tableID, user.userID);
        }

        return () => {
            socket.off(SOCKET_IO_EVENTS.CONNECT, onConnect);
            socket.off(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
            socket.off(SOCKET_EVENTS.TABLE_UPDATE, onTableUpdate);
        };
    }, [tableID, user.userID]);

    const determineUserPlayer = () => {
        if (!gameState?.players) return;
        for (let player of gameState.players) {
            if (player._id === user.userID) {
                setUserPlayer(player.playerNumber);
                setOtherPlayer(player.playerNumber === 1 ? 2 : 1);
                break;
            }
        }
    }; 

    const quit = async() => {
        const response = await fetch(`${API_URL}/games/doblet/table/${tableID}/quit`, {
            method:'POST',
            headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
        });
        if (!response.ok) {
            throw new Error("Failed");
        }
        const result = await response.json();
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

    const leaveGameOverScreen = () => {
        socket.disconnect();
        navigate('../games/doblet');
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
                setPieces(boardToPieces(result.board));
                setLoading(false)
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return <ClipLoader></ClipLoader>
    }
    else {
        const players = gameState?.players;
        const otherUser = players && otherPlayer ? players[otherPlayer - 1] : null;
        const selfUser = players && userPlayer ? players[userPlayer - 1] : null;
        const canRoll = !resolvedWinner && gameState?.currentPlayer?._id == user.userID && !isAnimating;

        return (
            loading? <ClipLoader></ClipLoader> :
            <>
                <div className="game-screen animate-fade-in-up">
                    <div className="game-top animate-fade-in-up animate-delay-1">
                        <div className="game-top-text">
                            {!resolvedWinner && <h2>Current Player: {gameState?.currentPlayer?.username}</h2>}
                            {resolvedWinner && <h2>{resolvedWinner.username} wins!</h2>}
                        </div>
                    </div>
                    <div className="game-center animate-fade-in-up animate-delay-1">
                        <div className="player-holder">
                            {otherUser && (
                                <UserItem key={`p-${otherPlayer}`} user={otherUser} />
                            )}
                            {selfUser && (
                                <UserItem key={`p-${userPlayer}`} user={selfUser} />
                            )}
                        </div>
                        <div className="game-board-stage">
                            <Board pieces={pieces} xSize={12} ySize={4} userPlayer={userPlayer}></Board>
                            <div className="dice-holder">
                                <Dice value={dice[0]}></Dice>
                                <Dice value={dice[1]}></Dice>
                                <Dice value={dice[2]}></Dice>
                            </div>
                            {isGameOver && (
                                <div className="game-over-overlay animate-fade-in-up">
                                    <h2>Game Over</h2>
                                    <p>{didCurrentUserWin ? "You won!" : `${resolvedWinner?.username} won.`}</p>
                                    <button type="button" onClick={leaveGameOverScreen}>Leave Table</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="game-bottom animate-fade-in-up animate-delay-2">
                        <div className={`game-button-holder${canRoll ? ' game-button-holder--can-roll' : ''}`}>
                            {canRoll && (
                                <button type="button" className="game-roll-button" onClick={roll}>Roll!</button>
                            )}
                            {!resolvedWinner && (
                                <button type="button" className="game-quit-button" onClick={() => setQuitModalOpen(true)}>Quit</button>
                            )}
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