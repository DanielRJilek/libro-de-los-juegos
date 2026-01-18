import Header from "../../../components/Header/Header"
import Board from "../Board/Board";
// import Dice from "../Dice/Dice";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import './Doblet.css'
import { UserContext } from "../../../context/UserContext";
const API_URL = import.meta.env.VITE_API_URL;
import { socket } from "../../../socket";

// socket.emit('join-table', tableID);

function Doblet() {
    const [board,setBoard] = useState([[2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2], [2,0,0,2]]);
    const [currentPlayer, setCurrentPlayer] = useState({id: "", username: ""});
    const navigate = useNavigate();
    const params = useParams();
    const tableID = params.instance
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [isConnected, setIsConnected] = useState(socket.connected);

    // const [isConnected, setIsConnected] = useState(socket.connected);
    // const [fooEvents, setFooEvents] = useState([]);
    // useEffect(() => {
    //     function onConnect() {
    //         setIsConnected(true);
    //     }

    //     function onDisconnect() {
    //         setIsConnected(false);
    //     }

    //     function onGameUpdate(result) {
    //         console.log("game-update")
    //         setBoard(result.board);
    //         setCurrentPlayer(result.currentPlayer);
    //     }

    //     socket.on('connect', onConnect);
    //     socket.on('disconnect', onDisconnect);
    //     socket.on('game-update', onGameUpdate);
    //     socket.emit('join-table', tableID, user.userID);
    //     console.log(socket);

    //     return () => {
    //         socket.disconnect();
    //         socket.off('connect', onConnect);
    //         socket.off('disconnect', onDisconnect);
    //         socket.off('game-update', onGameUpdate);
    //     };
    // }, []);
    // socket.connect();
    
    // useEffect(() => {
    //     socket.emit('join-table', tableID, user.userID);
    //     console.log(socket);
    // }, [])

    // useEffect(() => {
    //     socket.on("game-update", (data) => {
    //         alert(data);
    //         console.log(data)
    //     })
    // }, [socket])

    useEffect(() => {
        function onGameUpdate(value) {
            console.log(value);
            // alert(value);
            setBoard(value.board);
            setCurrentPlayer(value.currentPlayer);
        }
        function onConnect() {
            socket.emit('join-table', tableID, user.userID);
            console.log(socket);
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game-update', onGameUpdate);
        socket.connect();

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game-update', onGameUpdate)
        };
        }, []);


    // socket.on('game-update', (result) => {
    //     console.log(result);
    //     if (result?.board && result?.currentPlayer?.username) {
    //         setBoard(result.board);
    //         setCurrentPlayer(result.currentPlayer);
    //     }
    // })    

    const quit = () => {
        socket.disconnect();
        console.log("connection closed")
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
            if (result?.board && result?.currentPlayer?.username) {
                setBoard(result.board);
                setCurrentPlayer(result.currentPlayer);
            }
        } 
        catch (error) {
            console.log(error)
        }
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

    // class Player {constructor() {}}
    // const addPlayer = async() => {}

    // const message = async() => {
    //     try {
    //         const response = await fetch(`${API_URL}/games/doblet/table/${tableID}/message`, {
    //             method:'POST',
    //             headers: {  'Authorization': `Bearer ${auth.accessToken}`,
    //                         "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
    //         });
    //         if (!response.ok) {
    //             throw new Error("Failed");
    //         }
    //     } 
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <div className="game-page page" id=''>
            <Header></Header>
            <div id='main'>
                <div className="game-screen">
                    <div className="game-side">
                        <div className="game-text">
                            <h2>Current Player: {currentPlayer.username}</h2>
                        </div>
                        <div className="button-holder">
                            <button onClick={roll}>Roll!</button>
                            {/* <button onClick={message}>Message</button> */}
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