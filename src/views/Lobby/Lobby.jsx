import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { socket } from "../../socket";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Lobby.css'
import UserItem from "../../components/UserItem/UserItem";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { IoTrashOutline } from "react-icons/io5";

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
    const [gameUnderConstruction, setGameUnderConstruction] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    let instance = params.instance;

    useEffect(() => {
        function onGameStart() {
            navigate(`/games/${title}/table/${instance}/play`);
        }
        function onConnect() {
            socket.emit('join-table', instance, user.userID);
        }
        setLoading(true);
        setLobby(null);
        getGame();
        if (instance) {
            getTable();
            socket.on('game-start', onGameStart);
            socket.on('connect', onConnect);
            socket.on('player-joined', getTable);
            if (socket.connected) {
                socket.emit('join-table', instance, user.userID);
            } else {
                socket.connect();
            }
            return () => {
                socket.off('connect', onConnect);
                socket.off('game-start', onGameStart);
                socket.off('player-joined', getTable);
            };
        }
    }, [instance, title])

    useEffect(() => {
        if (error) {
            toast.error(error, {});
            const timer = setTimeout(() => {
                setError(null);
            }, 2000);
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
            if (result.finished == "false") {
                setGameUnderConstruction(true);
            }
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
                setError("Failed to fetch lobby. Redirecting to game page.");
                setLoading(false);
                navigate(`/games/${title}`);
                return;
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
            user.fetchPrivateData();
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
            user.fetchPrivateData();
            navigate(`/games/${title}`);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setDeleteModalOpen(false);
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
                body: JSON.stringify({username, instance: lobby._id}),
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
                const response = await fetch(`${API_URL}/games/${title}/table/${lobby._id}/start`, {
                    method: 'POST',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                if (!response.ok) {
                    setError("Failed to start game.");
                    return;
                }
                user.fetchPrivateData();
                socket.emit('start-game', lobby._id);
                navigate(`/games/${title}/table/` + lobby._id + '/play');
            }
            catch (error) {
                setError(error.message);
            }
        }
    }

    return (
        <div id="lobby" className="lobby-page">
            {!loading ? <>
            
                <div className='lobby-top animate-fade-in-up'>
                    <div className="lobby-hero-art">
                        <img src={'https://libro-de-los-juegos-server.onrender.com/static' + game?.image} alt="" />
                    </div>
                    <div className="lobby-info-column">
                        <h1 id="game-title" className="capitalize">{game?.title}</h1>
                        <div id="game-desc" className="game-desc-text">{game?.desc}</div>
                    </div>
                </div> 
                {!gameUnderConstruction ? <div className='lobby-bottom animate-fade-in-up animate-delay-1'>
                    {lobby? <div className="lobby animate-fade-in-up animate-delay-2"> 
                        <div className="lobby-header">
                            <span className="lobby-header-spacer" aria-hidden="true" />
                            <h2>Players: {lobby?.players?.length}</h2>
                            <div className="lobby-header-actions">
                                {lobby?.owner?._id == user.userID && (
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModalOpen(true)}
                                        aria-label="Delete lobby"
                                    >
                                        <IoTrashOutline />
                                    </button>
                                )}
                            </div>
                        </div>
                            <ul>
                                {lobby.players.map((player) => {
                                    return (<UserItem  key={player._id} user={player}>
                                    </UserItem>)
                                })}
                            </ul>
                            <ul>
                                {lobby?.invites?.length > 0 ? lobby.invites.map((invite) => {
                                    return <UserItem className='invite-list-item' key={invite._id} user={invite}></UserItem>
                                }) : <li className='empty-li'></li>}
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
                                    
                                    {lobby?.players?.length == 2 && <button onClick={play}>Play</button>}
                                    </>}
                            </div> 
                        </div> : <div className="lobby-empty"><button type="button" onClick={createGame}>Create Lobby</button></div>}
                </div> : <h2 className="lobby-construction-msg">This game is currently under construction. Check back later!</h2>}
            </>
            : <ClipLoader className="loader"/>}
            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete this lobby?"
                message="Everyone will be removed from the table. This cannot be undone."
                onConfirm={deleteLobby}
                confirmLabel="Delete lobby"
                pendingConfirmLabel="Deleting…"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    )
}

export default Lobby