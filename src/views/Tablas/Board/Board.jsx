import "./Board.css"
import Man from "../Man/Man"
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Dice from "../Dice/Dice";

function Board() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, [])
    return(
        loading ? <ClipLoader></ClipLoader> :
        <div>
            <img className="game-board" src="https://libro-de-los-juegos-server.onrender.com/static/images/board.png">
                
            </img>
            <Man player={1}></Man>
            <Man player={2}></Man>
            <Dice></Dice>
        </div>
        
    )
}

export default Board