const API_URL = import.meta.env.VITE_API_URL;
import 'react-toastify/dist/ReactToastify.css';
import "./MusicPage.css";

function MusicPage() {
    return (
        <div className="music-page">
            <div className="music-header">
                <h1 className="games-title">About the Music</h1>
            </div>
            <div className="music-content"></div>
            
        </div>
    )
}

export default MusicPage