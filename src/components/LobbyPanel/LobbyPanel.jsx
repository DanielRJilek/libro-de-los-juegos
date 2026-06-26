import './LobbyPanel.css'
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { IoTrashOutline, IoPersonAddOutline, IoPlay } from 'react-icons/io5';
import UserItem from '../UserItem/UserItem';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import { socket, emitJoinTable, SOCKET_EVENTS, SOCKET_IO_EVENTS, TABLE_UPDATE_KIND } from "../../socket";

const MAX_PLAYERS = 2;
const API_URL = import.meta.env.VITE_API_URL;

function LobbyPanel({user, auth, title}) {
    const params = useParams();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lobby, setLobby] = useState(null);
    const [addingPlayer, setAddingPlayer] = useState(false);
    const playerCount = lobby?.players?.length ?? 0;
    const inviteCount = lobby?.invites?.length ?? 0;
    const tableReady = playerCount === MAX_PLAYERS;
    const isOwner = lobby?.owner?._id == user.userID;
    let instance = params.instance;
    const seats = Array.from({ length: MAX_PLAYERS }, (_, index) => lobby?.players?.[index] ?? null);
    const tableStatus = !lobby
        ? null
        : tableReady
            ? isOwner
                ? "Both players seated — you may begin."
                : "Both players seated — waiting for the host to start."
            : inviteCount > 0
                ? `Waiting for a player to accept (${playerCount}/${MAX_PLAYERS} seated).`
                : `Waiting for an opponent (${playerCount}/${MAX_PLAYERS} seated).`;

    const toggleAddingPlayer = () => {
        addingPlayer ? setAddingPlayer(false) : setAddingPlayer(true)
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
                navigate(`/games/${title}/table/` + lobby._id + '/play');
            }
            catch (error) {
                setError(error.message);
            }
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

    useEffect(() => {
        function onTableUpdate(payload) {
            const { kind } = payload ?? {};
            if (kind === TABLE_UPDATE_KIND.GAME_START) {
                navigate(`/games/${title}/table/${instance}/play`);
            } else if (kind === TABLE_UPDATE_KIND.PLAYER_JOINED) {
                getTable();
            }
        }
        function onConnect() {
            emitJoinTable(instance, user.userID);
        }
        setLoading(true);
        setLobby(null);
        if (instance) {
            getTable();
            socket.on(SOCKET_EVENTS.TABLE_UPDATE, onTableUpdate);
            socket.on(SOCKET_IO_EVENTS.CONNECT, onConnect);
            if (socket.connected) {
                emitJoinTable(instance, user.userID);
            } else {
                socket.connect();
            }
            return () => {
                socket.off(SOCKET_IO_EVENTS.CONNECT, onConnect);
                socket.off(SOCKET_EVENTS.TABLE_UPDATE, onTableUpdate);
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

    return (
        <section className="lobby-table-panel">
            {!lobby ? (
                <div className="lobby-empty-state">
                    <p className="lobby-panel-label">Your table</p>
                    <h2 className="lobby-panel-title">No lobby open</h2>
                    <p className="lobby-panel-copy">
                        Create a table, then invite a friend to join before you play.
                    </p>
                    <button type="button" className="lobby-primary-btn" onClick={createGame}>
                        Create Lobby
                    </button>
                </div>
            ) : (
                <>
                    <header className="lobby-table-header">
                        <div className="lobby-table-heading">
                            <p className="lobby-panel-label">Your table</p>
                            <h2 className="lobby-panel-title">Players</h2>
                            <p className="lobby-table-status">{tableStatus}</p>
                        </div>
                        <div className="lobby-table-meta">
                            <span className={`lobby-status-pill${tableReady ? " lobby-status-pill--ready" : ""}`}>
                                {playerCount}/{MAX_PLAYERS}
                            </span>
                            {isOwner && (
                                <button
                                    type="button"
                                    className="lobby-icon-btn"
                                    onClick={() => setDeleteModalOpen(true)}
                                    aria-label="Delete lobby"
                                >
                                    <IoTrashOutline />
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="lobby-seats" aria-label="Table seats">
                        {seats.map((player, index) => (
                            <div
                                key={player?._id ?? `seat-${index}`}
                                className={`lobby-seat${player ? " lobby-seat--filled" : " lobby-seat--empty"}`}
                            >
                                <span className="lobby-seat-label">Seat {index + 1}</span>
                                {player ? (
                                    <div className="lobby-seat-player">
                                        <UserItem user={player} />
                                        {player._id === lobby.owner?._id && (
                                            <span className="lobby-host-badge">Host</span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="lobby-seat-empty">Waiting for a player…</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {inviteCount > 0 && (
                        <div className="lobby-pending">
                            <h3 className="lobby-pending-title">Pending invites</h3>
                            <div className="lobby-roster">
                                {lobby.invites.map((invite) => (
                                    <UserItem
                                        className="invite-list-item"
                                        key={invite._id}
                                        user={invite}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <footer className="lobby-actions">
                        {addingPlayer && (
                            <form className="lobby-invite-form" onSubmit={invitePlayer}>
                                <label className="visually-hidden" htmlFor="lobby-invite-username">
                                    Friend username
                                </label>
                                <input
                                    type="text"
                                    id="lobby-invite-username"
                                    name="username"
                                    placeholder="Friend's username"
                                    autoComplete="off"
                                />
                                <button type="submit" className="lobby-invite-submit">Send</button>
                            </form>
                        )}

                        {playerCount < MAX_PLAYERS && (
                            <button
                                type="button"
                                className="lobby-secondary-btn"
                                onClick={toggleAddingPlayer}
                            >
                                <IoPersonAddOutline aria-hidden="true" />
                                {addingPlayer ? "Cancel invite" : "Invite player"}
                            </button>
                        )}

                        {isOwner && tableReady && (
                            <button type="button" className="lobby-primary-btn lobby-play-btn" onClick={play}>
                                <IoPlay aria-hidden="true" />
                                Begin game
                            </button>
                        )}
                    </footer>
                </>
            )}
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
        </section>
    )
}

export default LobbyPanel;