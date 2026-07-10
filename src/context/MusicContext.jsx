import { createContext, useState, useRef, useEffect } from "react";

export const MusicContext = createContext();
const playlist = [
    {
        title: "Cantiga 18",
        src: encodeURI("/audio/Cantigas de Santa María/01 - Cantiga 18. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 29",
        src: encodeURI("/audio/Cantigas de Santa María/02 - Cantiga 29. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 41",
        src: encodeURI("/audio/Cantigas de Santa María/03 - Cantiga 41_119. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 76",
        src: encodeURI("/audio/Cantigas de Santa María/04 - Cantiga 76. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 99",
        src: encodeURI("/audio/Cantigas de Santa María/05 - Cantiga 99. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 105",
        src: encodeURI("/audio/Cantigas de Santa María/06 - Cantiga 105. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 132",
        src: encodeURI("/audio/Cantigas de Santa María/07 - Cantiga 132. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 139",
        src: encodeURI("/audio/Cantigas de Santa María/08 - Cantiga 139_183. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 159",
        src: encodeURI("/audio/Cantigas de Santa María/09 - Cantiga 159. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 166",
        src: encodeURI("/audio/Cantigas de Santa María/10 - Cantiga 166. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 167",
        src: encodeURI("/audio/Cantigas de Santa María/11 - Cantiga 167. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 173",
        src: encodeURI("/audio/Cantigas de Santa María/12 - Cantiga 173. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 189",
        src: encodeURI("/audio/Cantigas de Santa María/13 - Cantiga 189. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 192",
        src: encodeURI("/audio/Cantigas de Santa María/14 - Cantiga 192. Cantigas de Santa María.mp3"),
    },
    {
        title: "Cantiga 193",
        src: encodeURI("/audio/Cantigas de Santa María/15 - Cantiga 193. Cantigas de Santa María.mp3"),
    },
]

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const currentSong = playlist[index];

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const playNext = () => {
        setIndex((i) => (i + 1) % playlist.length);
    }

    const playPrevious = () => {
        setIndex((i) => (i - 1 + playlist.length) % playlist.length);
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => {}); // swallow AbortError from rapid src swaps
        } else {
            audio.pause();
        }
    }, [isPlaying, index]);

    useEffect(() => {
        const startOnFirstInteraction = () => {
            audioRef.current?.play().catch(() => {});
            setIsPlaying(true);
        };
        // { once: true } auto-removes the listener after it fires once
        window.addEventListener("pointerdown", startOnFirstInteraction, { once: true });
        return () => window.removeEventListener("pointerdown", startOnFirstInteraction);
    }, []);

    return (
        <MusicContext value={{ currentSong, isPlaying, togglePlay, playNext, playPrevious }}>
            {children}
            <audio 
                ref={audioRef} 
                src={currentSong.src} 
                onEnded={playNext}
                onError={() => console.error("Error playing audio")}
            ></audio>
        </MusicContext>
    )
}