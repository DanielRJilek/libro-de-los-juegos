// to do: make modular lobby

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import Header from "../../../components/Header/Header";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import './Lobby.css'
import { ClipLoader } from "react-spinners";

function DobletLobby() {
    const params = useParams();
    const title = params.title;
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [game,setGame] = useState("");
    useEffect(() => {
        const getGame = async () => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/${title}`, {
            method:'GET',
            headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            const result = await response.json();
            setGame(result);
            setLoading(false);
        } 
        catch (error) {
        
        }
        }
        getGame();
    }, [])

    const [addingPlayer, setAddingPlayer] = useState(false);
    const toggleAddingPlayer = () => {
        addingPlayer ? setAddingPlayer(false) : setAddingPlayer(true)
    }

    const createGame = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/${title}/table`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            setLobby(result.id);
            // setPlayers(result.players);
            setPlayers([user]);
        } 
        catch (error) {
            console.log(error)
        }
    }


    const addPlayer = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/${title}/table/${lobby}/players`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const response2 = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/${title}/table/${lobby}/`, {
                method:'GET',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response2.json();
            setPlayers(result.players);
            
        } 
        catch (error) {
            console.log(error)
        }
    }

    const [players, setPlayers] = useState([]);
    useEffect(() => {
        const getPlayers = async () => {
            try {
                const userID = user.userID;
                const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/${title}/table/${lobby}/`, {
                    method: 'GET',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                setPlayers(result.players);
            } 
            catch (error) {
            
            }
        }
        getPlayers();
        
    }, [lobby])

    const play = () => {
        if (players.length ==2) {
            navigate(`/games/${title}/table/` + lobby);
        }
    }

    return (
        <div className="lobby-page page">
            <Header></Header>
            {!loading ? <div id='main'>
                <div className='lobby-top'>
                                <img src={'https://libro-de-los-juegos-server.onrender.com/static' + game?.image}></img>
                                <div className="lobby-top-right">
                                    <h1 id="game-title">{game?.title}</h1>
                                    <div id="game-desc">{game?.desc}</div>
                                </div>
                            </div> 
                <div className='lobby-bottom'>
                    {lobby? <div className="lobby">
                                <h2>Players</h2>
                                <ul>
                                    {players?.length > 0 ? players.map((player) => {
                                        return <li className='friend-list-item' key={player.id}>{player.id}</li>
                                    }) : <li className='empty-li'>No PLayers?</li  >}
                                </ul>
                                <div className="button-holder">
                                    <button onClick={toggleAddingPlayer} className='drop-down'>Invite Player</button>
                                    {addingPlayer
                                        &&  <form className='flex-row' onSubmit={addPlayer}>
                                                <label for="username"></label>
                                                <input type="text" id="username" name="username"></input>
                                                <button className='go-button'>Go</button>
                                            </form>}
                                    
                                    <button onClick={play}>Play!</button>
                                </div>
                                
                            </div> : <button onClick={createGame}>Create Lobby</button>}
                </div>
            </div>
            : <ClipLoader/>}
        </div>
    )
}

export default DobletLobby