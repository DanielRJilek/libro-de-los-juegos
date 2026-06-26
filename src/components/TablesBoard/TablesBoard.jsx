import "./TablesBoard.css"
import { useEffect, useState, useRef } from "react";
import Piece from "../Piece/Piece";
import { boardToPieces, displayToServer, serverToDisplay } from "../../utils/pieceUtils";

const API_URL = import.meta.env.VITE_API_URL;
const BOARD_W = 0.93;
const BOARD_H = 0.90;
const COL_GAP_RATIO = 0.08;   
const COL_SPLIT = 6;
const PIECE_SIZE = 40;
const ROW_GAP_RATIO = 0.40;

function toGridCol(col) {
    return col < COL_SPLIT ? col + 1 : col + 2;
}

function cellPosition(col, row, { w, h, colGap, rowGap }, pieceW, pieceH, ySize) {
    const cellX = col * w + (col >= COL_SPLIT ? colGap : 0);
    const cellY = row * h + (row >= ySize/2 ? rowGap : 0);

    const baseY = row < ySize/2
        ? cellY + 8
        : cellY + h - pieceH - 8;

    return {
        x: cellX + (w - pieceW) / 2,
        y: baseY,
    };
}

function TablesBoard({userPlayerNumber, xSize, ySize, session, lastMove,
    selectedPiece, setSelectedPiece, selectedCell, setSelectedCell, selectedDice, setSelectedDice}) {
    const flipVertical = userPlayerNumber === 2;
    const boardRef = useRef(null);
    const [cellSize, setCellSize] = useState({ w: 0, h: 0, colGap: 0, rowGap: 0 });
    const [pieceList, setPieceList] = useState([]);
    const stackInCell = {};
    
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
            const { col, row } = serverToDisplay(
                move.toCol, move.toRow, session.gameState?.board
            );
             return prev.map((p) =>
                p.id === moving.id ? { ...p, point: move.toCol, col, row } : p
            );
        });
        setSelectedPiece(null);
        setSelectedCell(null);
    };

    const handlePieceClick = (piece) => {
        console.log("piece", piece);
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
        console.log("cell", col, row);
        setSelectedCell({ col, row });  
    }

    const cells = [];
    for (let row = 0; row < ySize; row++) {
        for (let col = 0; col < xSize; col++) {
            const {col: point, row: dRow} = displayToServer(col, row, session.gameState?.board);
            const isSelected = selectedPiece === point;
            // const isValidTarget = validToPoints.includes(point);
            const gridCol = toGridCol(col);
            const gridRow = row < ySize/2 ? row + 1 : row + ySize/2 + 1;
            cells.push(
                <div
                    key={`${col}-${row}`}
                    className={`board-cell${isSelected ? " board-cell--selected" : ""}`}
                    style={{ gridArea: `${gridRow} / ${gridCol} / ${gridRow + 1} / ${gridCol + 1}` }}
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
        const { x, y } = cellPosition(piece.col, piece.row, cellSize, PIECE_SIZE, PIECE_SIZE, ySize);
        return (
            <>
            <Piece
                key={piece.id}
                playerNumber={piece.player}
                selected={selectedPiece?.id === piece.id}
                onClick={() => handlePieceClick(piece)}
                style={{
                    width: PIECE_SIZE,
                    height: PIECE_SIZE,
                    transform: `translate(${x}px, ${y}px)`,
                }}
                point={piece.point}
            />
            {pointCount > 1 && (
                <div className={flipVertical ? "board-cell-count rotate-180" : "board-cell-count"}
                style={{
                    transform: flipVertical
                      ? `translate(${x + PIECE_SIZE / 2}px, ${y + PIECE_SIZE / 2}px) translate(-50%, -50%) rotate(180deg)`
                      : `translate(${x + PIECE_SIZE / 2}px, ${y + PIECE_SIZE / 2}px) translate(-50%, -50%)`,
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
                    gridTemplateRows: `repeat(${ySize/2}, 1fr) ${ROW_GAP_RATIO * 100}% repeat(${ySize/2}, 1fr)`,
                }}
            >{cells}</div>
            <div className="tables-board-pieces">{pieces}</div>
        </div>
    )
}
export default TablesBoard
