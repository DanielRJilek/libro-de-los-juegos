import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../context/UserContext";
import { socket, emitJoinTable, SOCKET_EVENTS, SOCKET_IO_EVENTS, TABLE_UPDATE_KIND } from "../socket";
import { getGameConfig } from "../games";

const API_URL = import.meta.env.VITE_API_URL;

export function useTablesGameSession() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const params = useParams();
    const title = params.title;
    const config = getGameConfig(title);
    const tableID = params.instance;
    const [activeDiceIndex, setActiveDiceIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState(null);
    const [dice, setDice] = useState([{value: 1, used: false}, {value: 1, used: false}]);
    const [userPlayerNumber, setUserPlayerNumber] = useState(null);
    const [otherPlayerNumber, setOtherPlayerNumber] = useState(null);
    const [quitModalOpen, setQuitModalOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMove, setLastMove] = useState(null);
    const [gameInfo, setGameInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const resolvedWinner = gameState?.winner ?? null;
    const isGameOver = Boolean(resolvedWinner);
    const didCurrentUserWin = resolvedWinner?._id == user.userID;
    const selfUser = gameState?.players?.find(p => p.playerNumber === userPlayerNumber) ?? null;
    const otherUser = gameState?.players?.find(p => p.playerNumber !== userPlayerNumber) ?? null;
    const canRoll = !resolvedWinner && gameState?.currentPlayerNumber === userPlayerNumber 
                    && !isAnimating && gameState?.turnStage === 'roll';
    const isMyTurn = gameState?.currentPlayerNumber === userPlayerNumber;
    const hasUnusedDice = gameState?.dice?.some((d) => !d.used);
    const canMove = !resolvedWinner && isMyTurn && !isAnimating && hasUnusedDice && gameState?.turnStage === 'move';
    const requestQuit = () => setQuitModalOpen(true);
    const cancelQuit = () => setQuitModalOpen(false);

    const validMove = (sourcePoint, targetPoint) => {
        const fromCol = sourcePoint.col;
        const toCol = targetPoint.col;
        const diceValue = toCol - fromCol;
        return diceValue >= 1 && diceValue <= 6 && !dice.some((d) => d.used && d.value === diceValue) 
            && gameState?.turnStage === 'move';
    }

    const submitMove = async ({ fromCol, toCol, fromRow, toRow, diceValue }) => {
        console.log(fromCol, toCol, fromRow, toRow, diceValue);
        try {
            const response = await fetch(
                `${API_URL}/games/${title}/table/${tableID}/play`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fromCol,
                        fromRow,
                        toCol,
                        toRow,
                        diceValue,
                        playerNumber: userPlayerNumber,
                    }),
                }
            );
            if (!response.ok) throw new Error("Invalid move");
            } catch (err) {
                setErrorMessage(null);
                setErrorMessage(err.message);
            }
    };

    const roll = async() => {
        try {
            const response = await fetch(`${API_URL}/games/${title}/table/${tableID}/roll`, {
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
            setErrorMessage(null);
            setErrorMessage(error.message);
        }
    }

    const leaveGameOverScreen = () => {
        socket.disconnect();
        navigate(`../games/${title}`);
    }

    const quit = async() => {
        const response = await fetch(`${API_URL}/games/${title}/table/${tableID}/quit`, {
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
        navigate(`../games/${title}`) 
    }

    const fetchGameInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/games/${title}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            const result = await response.json();
            setGameInfo(result);
        } catch (error) {
            setErrorMessage(null);
            setErrorMessage(error.message);
        }
    };

    const getGame = async () => {
        try {
            const response = await fetch(`${API_URL}/games/${title}/table/${tableID}`, {
            method:'GET',
            headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            const result = await response.json();
            if (result.started == false) {
                navigate(`../games/${title}/table/${tableID}`);
            }
            if (result?.board && result?.currentPlayerNumber) {
                setGameState(result)
                setDice(result.dice);
                setLoading(false)
            }
        } 
        catch (error) {
            setErrorMessage(null);
            setErrorMessage(error.message);
        }
    }

    const determineUserPlayer = () => {
        if (!gameState?.players) return;
        for (let player of gameState.players) {
            if (player._id === user.userID) {
                setUserPlayerNumber(player.playerNumber);
                setOtherPlayerNumber(player.playerNumber === 1 ? 2 : 1);
                break;
            }
        }
    };

    useEffect(() => {
        if (!tableID || !user.userID) return undefined;

        async function onStateUpdate(value) {
            if (value.move) {
                const dieIndex = gameState?.dice?.findIndex(
                    (d) => d.value === value.move.diceValue && !d.used
                );
                setActiveDiceIndex(dieIndex >= 0 ? dieIndex : null);
                setIsAnimating(true);

                await new Promise(resolve => setTimeout(resolve, 300));
                setActiveDiceIndex(null);
                setIsAnimating(false);
                setGameState((prev) => ({
                    ...prev,
                    ...(value.gameState ?? {}),
                    board: value.board ?? value.gameState?.board,
                    dice: value.dice ?? value.gameState?.dice,
                    currentPlayerNumber: value.currentPlayerNumber ?? value.gameState?.currentPlayerNumber,
                    turnStage: value.turnStage ?? value.gameState?.turnStage,
                    winner: value.winner ?? value.gameState?.winner,
                }));
                setDice(value.dice);
                setLastMove(value.move);
                // if (value.winner) setWinner(value.winner);
            }

            if (value.dice) {
                setDice(value.dice);
                setGameState((prev) => ({
                    ...prev,
                    dice: value.dice,
                    turnStage: value.turnStage ?? value.gameState?.turnStage ?? prev?.turnStage,
                    currentPlayerNumber: value.currentPlayerNumber ?? value.gameState?.currentPlayerNumber ?? prev?.currentPlayerNumber,
                }));
            }
        }

        function onTableUpdate(payload) {
            const { kind } = payload ?? {};
            if (kind === TABLE_UPDATE_KIND.STATE) {
                onStateUpdate(payload);
            } else if (kind === TABLE_UPDATE_KIND.GAME_ENDED) {
                console.log("winner", payload.winner);
                // setWinner(payload.winner);
                setGameState((prev) => ({ ...prev, ...payload.gameState, 
                    winner: payload.winner }));
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

    useEffect(() => {
        fetchGameInfo();
        getGame();
    }, [])

    useEffect(() => {
        determineUserPlayer();
    }, [gameState, user.userID])

    const session = {
        gameState,
        gameTitle: gameInfo?.title ?? title,
        dice,
        gameInfo,
        otherUser,
        selfUser,
        activeDiceIndex,
        isGameOver,
        resolvedWinner,
        didCurrentUserWin,
        canRoll,
        canMove,
        loading,
        quitModalOpen,
        userPlayerNumber,
        otherPlayerNumber,
        lastMove,
        requestQuit,
        cancelQuit,
        validMove,
        submitMove,
        quit,
        roll,
        leaveGameOverScreen,
        config,
        errorMessage,
    }

    return session;
}

export default useTablesGameSession;
