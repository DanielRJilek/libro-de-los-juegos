import "./Board.css"
import { ClipLoader } from "react-spinners";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Square from "../../components/Square/Square";

const API_URL = import.meta.env.VITE_API_URL;

function Board({board, userPlayer, children, maxPieces, xSize, ySize}) {
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const flipVertical = userPlayer == 1;
    
    useEffect(() => {
        setLoading(false);
    }, [])

    // User should always be at the bottom
    const squares = [];
    for (let y=0;y<ySize;y++) {
        for (let x=0;x<xSize;x++) {
            squares.push(<Square key={`${x}-${y}`} x={x} y={y} pieces={board[x][y]} maxPieces={maxPieces}></Square>);
        }
    }   
    const halfSize = Math.ceil(squares.length / 2);

    return(
        loading ? <ClipLoader></ClipLoader> :
        <div className={flipVertical ? "board-holder rotate-180" : "board-holder"}>
            <img className="game-board" src={`${API_URL}/static/images/board.png`}></img>
            <div className="board-grid">
                <div className="board-grid-quarter">{squares.slice(0,halfSize)}</div>
                <div className="board-grid-quarter"></div>
                <div className="board-grid-quarter"></div>
                <div className="board-midline-filler">
                    <div className="dice-holder">
                        {children}
                    </div>
                </div>
                <div className="board-grid-quarter">{squares.slice(halfSize)}</div>
                <div className="board-grid-quarter"></div>
            </div>
        </div>
    )
}

export default Board