import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './LobbyPage.css'
import LobbyPanel from "../../components/LobbyPanel/LobbyPanel";

const API_URL = import.meta.env.VITE_API_URL;

function LobbyPage() {
    const params = useParams();
    const title = params.title.toLowerCase().replace(/ /g, '-');
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);
    const [gameUnderConstruction, setGameUnderConstruction] = useState(false);
    
    const [showRules, setShowRules] = useState(false);

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

    useEffect(() => {
        getGame();
    }, [title])
    
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
        <div className="lobby-page">
            {loading ? (
                <ClipLoader className="lobby-loader" />
            ) : (
                <div className="lobby-shell animate-fade-in-up">
                    <aside className="lobby-showcase animate-fade-in-up">
                        <div className="lobby-cover-frame">
                            <img
                                className="lobby-cover-image"
                                src={'https://libro-de-los-juegos-server.onrender.com/static' + game?.image}
                                alt=""
                            />
                        </div>
                        <div className="lobby-showcase-body">
                            <p className="lobby-eyebrow">Table game</p>
                            <h1 id="game-title" className="lobby-game-title capitalize">
                                {game?.title.replace(/-/g, ' ')}
                            </h1>
                            {game?.desc && (
                                <p id="game-desc" className="lobby-game-desc">{game.desc}</p>
                            )}
                        </div>
                    </aside>

                    <div className="lobby-sidebar animate-fade-in-up animate-delay-1">
                        {gameUnderConstruction ? (
                            <div className="lobby-construction animate-fade-in-up">
                                <h2>This game is currently under construction.</h2>
                                <p>Check back later!</p>
                            </div>
                        ) : (
                            <LobbyPanel user={user} auth={auth} title={title} />
                        )}
                        <section className="lobby-rules-panel animate-fade-in-up animate-delay-2">
                            <div className="lobby-rules-header">
                                <h2 className="lobby-rules-heading">Rules</h2>
                                <button
                                    type="button"
                                    className="lobby-rules-toggle"
                                    aria-expanded={showRules}
                                    onClick={() => setShowRules((open) => !open)}
                                >
                                    {showRules ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div
                                id="game-rules"
                                className={`lobby-rules-text${showRules ? " lobby-rules-text--open" : ""}`}
                            >
                                {game?.rules}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LobbyPage
