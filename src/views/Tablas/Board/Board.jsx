import "./Board.css"
import Man from "../Man/Man"
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Square from "../Square/Square";

function Board({board}) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, [])
    const squares = [];
    let i =0
    for (let y=0;y<2;y++) {
        let row = [];
        for (let x=0;x<6;x++) {
            row.push(<Square key={i} x={x} y={y} count={board[x][y]} player={1}></Square>);
            i++;
        }
        squares.push(row);
    }
    for (let y=2;y<4;y++) {
        let row = [];
        for (let x=0;x<6;x++) {
            row.push(<Square key={i} x={x} y={y} count={board[x][y]} player={2}></Square>);
            i++;
        }
        squares.push(row);
    }

    return(
        loading ? <ClipLoader></ClipLoader> :
        <div className="board-holder">
            <img className="game-board" src="https://libro-de-los-juegos-server.onrender.com/static/images/board.png"></img>
            <div className="board-grid">
                <div className="board-grid-quarter">{squares.slice(0,2)}</div>
                <div className="board-midline-filler"></div>
                <div className="board-grid-quarter">{squares.slice(2,4)}</div>
            </div>            
        </div>
        
    )
}

export default Board