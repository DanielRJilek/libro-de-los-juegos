import './MusicDrop.css'
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { FaForwardStep, FaBackwardStep, FaPause, FaPlay } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

function MusicDrop() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [musicPaused, setMusicPaused] = useState(false);

    const toggleOpen = () => {
        setOpen(!open);
    }

    return (
        <IconContext.Provider value={{className:'audio-icon'}}>
            <div className="icon-holder">
                <HiMiniSpeakerWave onClick={toggleOpen}></HiMiniSpeakerWave>
                {open ? <div className="music-drop animate-fade-in-up animate-delay-1">
                            <div className="music-controls">
                                <FaBackwardStep />
                                {musicPaused ? <FaPlay onClick={() => setMusicPaused(false)} /> : <FaPause onClick={() => setMusicPaused(true)} />}
                                <FaForwardStep />
                            </div>
                            <div className='song-title'>Song Title Here</div>
                            <button onClick={() => navigate("/music")}>About the Music</button>
                        </div> : null}
            </div>
        </IconContext.Provider>
    )
}

export default MusicDrop