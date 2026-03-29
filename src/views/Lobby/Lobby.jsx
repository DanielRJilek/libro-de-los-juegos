import { useContext, useState, useEffect, use } from "react";
import { UserContext } from "../../context/UserContext";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import './Lobby.css'
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

function Lobby() {
    const params = useParams();
    const title = params.title;
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [game,setGame] = useState("");
    const [error, setError] = useState(null);
    const [addingPlayer, setAddingPlayer] = useState(false);
    let instance = params.instance;
    

    useEffect(() => {
        setLoading(true);
        setLobby(null);
        if (instance) {
            getTable();
        }
        getGame();
    }, [instance, title])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    const toggleAddingPlayer = () => {
        addingPlayer ? setAddingPlayer(false) : setAddingPlayer(true)
    }

    const getGame = async () => {
        try {
            const response = await fetch(`${API_URL}/games/${title}`, {
            method:'GET',
            headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            const result = await response.json();
            setGame(result);
            setLoading(false);
        } 
        catch (error) {
            console.log(error)
        }
    }

    const getTable = async () => {
        if (!instance) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/games/${title}/table/${instance}/`, {
                method:'GET',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            setLobby(result);
        }
        catch (error) {
            console.log(error)
            setError(error.message);
        }
    }

    const createGame = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/games/${title}/table`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            
            navigate(`${API_URL}/games/${title}/table/${result._id}`)
            instance = result._id;
            await getTable();
            setLoading(false);
        } 
        catch (error) {
            setError(error.message);
            console.log(error)
        }
    }

    const deleteLobby = async () => {
        try {
            const response = await fetch(`${API_URL}/games/${title}/table/${instance}/`, {
                method:'DELETE',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                setError("Failed to delete lobby. Try refreshing the page.");
                return;
            }
            setLobby(null);
            navigate(`/games/${title}`);
        }
        catch (error) {
            setError(error.message);
        }
    }

    const invitePlayer = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/invites`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, instance: lobby}),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                return;
            }
            getTable();
            toggleAddingPlayer();
            toast.success("Invite Sent!", {});
        } 
        catch (error) {
            setError(error.message);
        }
    }

    // should add a field in db for number of players per game in case there are games that allow more than 2 players
    // also add single player mode to play against computer
    const play = async () => {
        if (lobby?.players?.length == 2 && lobby?.owner._id == user.userID) {
            try {
                const response = await fetch(`${API_URL}/games/${title}/table/${lobby}/start`, {
                    method: 'POST',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                navigate(`/games/${title}/table/` + lobby + '/play');
            }
            catch (error) {
                setError(error.message);
            }
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
                                <div className="error">
                                    {error && <p>{error}</p>}
                                </div>
                                <ul>
                                    {lobby?.players?.length > 0 ? lobby.players.map((player) => {
                                        return <li className='friend-list-item' key={player.id}>{player.username}</li>
                                    }) : <li className='empty-li'>No PLayers?</li  >}
                                </ul>
                                <ul>
                                    {lobby?.invites?.length > 0 ? lobby.invites.map((invite) => {
                                        return <li className='friend-list-item invite-list-item' key={invite.id}>{invite.username} (invited)</li>
                                    }) : null}
                                </ul>
                                <div className="button-holder">
                                    {addingPlayer
                                        &&  <form className='flex-row' onSubmit={invitePlayer}>
                                                <label for="username"></label>
                                                <input type="text" id="username" name="username"></input>
                                                <button className='go-button'>Go</button>
                                            </form>}
                                    {lobby?.players?.length < 2 &&
                                    <button onClick={toggleAddingPlayer} className='drop-down'>Invite Player</button>}
                                    {lobby?.owner?._id == user.userID && <>
                                        <button onClick={deleteLobby}>Delete Lobby</button>
                                        {lobby?.players?.length == 2 && <button onClick={play}>Play</button>}
                                        </>}
                                </div> 
                            </div> : <button onClick={createGame}>Create Lobby</button>}
                </div>
            </div>
            : <ClipLoader className="loader"/>}
        </div>
    )
}

export default Lobby