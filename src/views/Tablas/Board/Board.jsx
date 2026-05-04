import "./Board.css"
import Man from "../Man/Man"
import { ClipLoader } from "react-spinners";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import Square from "../Square/Square";

function Board({board, userPlayer, otherPlayer, children}) {
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(false);
    }, [])

    // User should always be at the bottom
    const squares = [];
    let i =0
    // let userPlayer, otherPlayer;
    // if (gameState?.players[0]._id && gameState?.players[0]._id == user.userID) {
    //     userPlayer = 1;
    //     otherPlayer = 2;
    // } else {
    //     userPlayer = 2;
    //     otherPlayer = 1;
    // }
    // Top (other) player
    // if (currentPlayer.id && currentPlayer.id != user.userID) {
    for (let y=0;y<2;y++) {
        let row = [];
        for (let x=0;x<6;x++) {
            row.push(<Square key={i} x={x} y={y} count={board[x][y]} player={otherPlayer}></Square>);
            i++;
        }
        squares.push(row);
    }
    // Bottom (user) player
    for (let y=2;y<4;y++) {
        let row = [];
        for (let x=0;x<6;x++) {
            row.push(<Square key={i} x={x} y={y} count={board[x][y]} player={userPlayer}></Square>);
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
                <div className="board-grid-quarter"></div>
                <div className="board-grid-quarter"></div>
                <div className="board-midline-filler">
                    <div className="dice-holder">
                        {children}
                    </div>
                </div>
                <div className="board-grid-quarter">{squares.slice(2,4)}</div>
                <div className="board-grid-quarter"></div>
                
            </div>
            
        </div>
        
    )
}

export default Board