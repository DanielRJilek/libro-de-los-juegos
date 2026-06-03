import "./Board.css"
import { ClipLoader } from "react-spinners";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import Man from "../Man/Man";

const API_URL = import.meta.env.VITE_API_URL;

function Board({pieces, userPlayer, children, xSize, ySize}) {
    const user = useContext(UserContext);
    const flipVertical = userPlayer == 1;
    const boardRef = useRef(null);
    const [cellSize, setCellSize] = useState({ w: 0, h: 0 });
    const stackInCell = {};

    useEffect(() => {
        const el = boardRef.current;
        if (!el) return;
        const update = () => {
            setCellSize({
                w: el.clientWidth * 0.9/ xSize,
                h: el.clientHeight / ySize,
            });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [xSize, ySize]);

    const cells = [];
    for (let row = 0; row < ySize; row++) {
        for (let col = 0; col < xSize; col++) {
            cells.push(
            <div
                key={`${col}-${row}`}
                className="board-cell"
                style={{ gridArea: `${row + 1} / ${col + 1} / ${row + 2} / ${col + 2}` }}
            />
            );
        }
    }

    const pieceList = pieces?.map((piece) => {
        const cellKey = `${piece.col}-${piece.row}`;
        const stackIndex = stackInCell[cellKey] ?? 0;
        stackInCell[cellKey] = stackIndex + 1;
        const x = piece.col * cellSize.w;
        const y = piece.row * cellSize.h;
        return (
            <div
                key={piece.id}
                className="piece-slot"
                style={{
                    width: cellSize.w,
                    height: cellSize.h * 0.7,
                    transform: `translate(${x}px, ${y}px)`,
                }}
            >
                <Man
                    playerNumber={piece.player}
                    style={{
                        position: "absolute",
                        width: "50%",
                        height: "50%",
                        left: "25%",
                        top: stackIndex === 0 ? "20%" : "30%",
                        zIndex: stackIndex + 1,
                    }}
                />
            </div>
        );
    });    
    // User should always be at the bottom    

    return(
        <div className={flipVertical ? "board-holder rotate-180" : "board-holder"}>
            <img className="game-board" src={`${API_URL}/static/images/board.png`} ref={boardRef}></img>
            <div className="board-pieces">{pieceList}</div>
            
        </div>
        
    )
}
export default Board
