import "./TablesBoard.css"
import { useEffect, useState, useRef } from "react";
import Piece from "../Piece/Piece";
import { displayToPoint, boardToPieces, pointToDisplay } from "../../utils/pieceUtils";

const API_URL = import.meta.env.VITE_API_URL;
const BOARD_W = 0.93;
const BOARD_H = 0.90;
const ROW_GAP_RATIO = 0.70;   
const COL_GAP_RATIO = 0.08;   
const COL_SPLIT = 6; 
const PIECE_W = 0.7;
const PIECE_H = 0.7;

function toGridCol(col) {
    return col < COL_SPLIT ? col + 1 : col + 2;
}

function cellPosition(col, row, { w, h, colGap, rowGap }, pieceW, pieceH) {
    const cellX = col * w + (col >= COL_SPLIT ? colGap : 0);
    const cellY = row * h + row * rowGap;
    return {
        x: cellX + (w - pieceW) / 2,
        y: cellY + (h - pieceH) / 2 + h * 0.04,
    };
}

function TablesBoard({userPlayerNumber, xSize, ySize, session, lastMove}) {
    const flipVertical = userPlayerNumber === 2;
    const boardRef = useRef(null);
    const [cellSize, setCellSize] = useState({ w: 0, h: 0, colGap: 0, rowGap: 0 });
    const [pieceList, setPieceList] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const stackInCell = {};
    const pieceW = cellSize.w * PIECE_W;
    const pieceH = cellSize.h * PIECE_H;

    useEffect(() => {
        setPieceList(boardToPieces(session.gameState?.board));
    }, []);

    useEffect(() => {
        const el = boardRef.current;
        if (!el) return;
        const update = () => {
            const playableW = el.clientWidth * BOARD_W;
            const playableH = el.clientHeight * BOARD_H;
            const colGap = playableW * COL_GAP_RATIO;
            const rowGap = playableH * ROW_GAP_RATIO;
            const w = (playableW - colGap) / xSize;
            const h = (playableH - rowGap) / ySize;
            setCellSize({ w, h, colGap, rowGap });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [xSize, ySize]);
    
    useEffect(() => {
        if (lastMove) {
            movePiece(lastMove);
        }
    }, [lastMove]);

    const movePiece = (move) => {
        setPieceList((prev) => {
            const stack = prev.filter(
                (p) => p.point === move.fromCol && p.player === move.playerNumber
            );
            const moving = stack[stack.length - 1];
            if (!moving) return prev;
            if (move.toCol == null) {
                return prev.filter((p) => p.id !== moving.id); // bear off
            }
            const { col, row } = pointToDisplay(move.toCol);
             return prev.map((p) =>
                p.id === moving.id ? { ...p, point: move.toCol, col, row } : p
            );
        });
        setSelectedPiece(null);
        setSelectedCell(null);
    };

    const handlePieceClick = (piece) => {
        if (selectedPiece?.id === piece.id) {
            setSelectedPiece(null);
            return;
        }
        if (selectedPiece) {
            handleCellClick(piece.col, piece.row);
            return;
        }
        if (piece.player !== userPlayerNumber) {
            return;
        }
        setSelectedPiece(piece);
    };

    const handleCellClick = (col, row) => {
        setSelectedCell({ col, row });
        if (selectedPiece) {
            const fromCol = displayToPoint(selectedPiece.col, selectedPiece.row);
            const toCol = displayToPoint(col, row);
            const diceValue = toCol - fromCol;
            if (session.dice?.some((d) => !d.used && d.value === diceValue)) {
                session.submitMove({ fromCol: fromCol, toCol: toCol, diceValue: diceValue });
            }
        }
    }

    const cells = [];
    for (let row = 0; row < ySize; row++) {
        for (let col = 0; col < xSize; col++) {
            const point = displayToPoint(col, row);
            const isSelected = selectedPiece === point;
            // const isValidTarget = validToPoints.includes(point);
            
            const gridCol = toGridCol(col);
            cells.push(
                <div
                    key={`${col}-${row}`}
                    className={`board-cell${isSelected ? " board-cell--selected" : ""}`}
                    style={{ gridArea: `${row + 1} / ${gridCol} / ${row + 2} / ${gridCol + 1}` }}
                    onClick={() => handleCellClick(col, row)}
                >
                </div>
            );
        }
    }

    const pieces = pieceList?.map((piece) => {
        const pointCount = pieceList.filter((p) => p.point === piece.point).length;
        const cellKey = `${piece.col}-${piece.row}`;
        const stackIndex = stackInCell[cellKey] ?? 0;
        stackInCell[cellKey] = stackIndex + 1;
        const { x, y } = cellPosition(piece.col, piece.row, cellSize, pieceW, pieceH);
        return (
            <>
            <Piece
                key={piece.id}
                playerNumber={piece.player}
                selected={selectedPiece?.id === piece.id}
                onClick={() => handlePieceClick(piece)}
                style={{
                    width: pieceW,
                    height: pieceH,
                    transform: `translate(${x}px, ${y}px)`,
                }}
                point={piece.point}
            />
            {pointCount > 1 && (
                <div className={flipVertical ? "board-cell-count rotate-180" : "board-cell-count"}
                style={{
                    transform: flipVertical
                      ? `translate(${x + pieceW / 2}px, ${y + pieceH / 2}px) translate(-50%, -50%) rotate(180deg)`
                      : `translate(${x + pieceW / 2}px, ${y + pieceH / 2}px) translate(-50%, -50%)`,
                  }}
                  >
                    x{pointCount}
                </div>
            )}
            </>
        )
    });

    return (
        <div className={flipVertical ? "tables-board-holder rotate-180" : "tables-board-holder"}>
            <img ref={boardRef} className="tables-game-board" src={`${API_URL}/static/images/board.png`}></img>
            <div className="tables-board-cells"
                style={{
                    gridTemplateColumns: `repeat(${COL_SPLIT}, 1fr) ${COL_GAP_RATIO * 100}% repeat(${xSize - COL_SPLIT}, 1fr)`,
                    gridTemplateRows: `repeat(${ySize}, 1fr)`,
                    rowGap: `${ROW_GAP_RATIO * 100}%`,
                }}
            >{cells}</div>
            <div className="tables-board-pieces">{pieces}</div>
        </div>
    )
}
export default TablesBoard
