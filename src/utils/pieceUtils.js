const POINTS_PER_ROW = 12;
const LAST_POINT = 23; // POINTS_PER_ROW * 2 - 1

const pointToDisplay = (point) => {
    if (point < POINTS_PER_ROW) {
        return { col: point, row: 1 };
    }
    return { col: LAST_POINT - point, row: 0 };
};

const displayToPoint = (col, row) => {
    if (row === 1) return col;
    return LAST_POINT - col;
};

const boardToPieces = (board) => {
    if (!Array.isArray(board)) return [];
    const pieces = [];
    const is1D = board[0] != null && ('p1' in board[0] || 'p2' in board[0]);
    if (is1D) {
        for (let point = 0; point < board.length; point++) {
            const cell = board[point];
            const { col, row } = pointToDisplay(point);
            if (!cell) continue;
            for (let k = 0; k < (cell.p1 ?? 0); k++) {
                pieces.push({
                    id: `p1-${point}-${k}`,
                    player: 1,
                    point: point,
                    col: col,
                    row: row,
                });
            }
            for (let k = 0; k < (cell.p2 ?? 0); k++) {
                pieces.push({
                    id: `p2-${point}-${k}`,
                    player: 2,
                    point: point,
                    col: col,
                    row: row,
                });
            }
        }
    } 
    else {
        for (let col = 0; col < board.length; col++) {
            for (let row = 0; row < board[col].length; row++) {
                const cell = board[col][row];
                if (!cell) continue;
                for (let k = 0; k < (cell.p1 ?? 0); k++) {
                    pieces.push({
                        id: `p1-${col}-${row}-${k}`,
                        player: 1,
                        col,
                        row,
                    });
                }
                for (let k = 0; k < (cell.p2 ?? 0); k++) {
                    pieces.push({
                        id: `p2-${col}-${row}-${k}`,
                        player: 2,
                        col,
                        row,
                    });
                }
            }
        }
    }
    return pieces;
}

const movePiece = (prev, move) => {
    const idx = prev.findIndex(
        (p) => p.player === move.playerNumber && p.col === move.fromCol && p.row === move.fromRow
    );
    if (idx === -1) {
        console.log("piece not found");
        return prev;
    }
    if (move.toCol == null || move.toRow == null) {
        return prev.filter((_, i) => i !== idx);
    }
    const { col, row } = pointToDisplay(move.toCol);
    return prev.map((p, i) =>
        i === idx ? { ...p, col: move.toCol, row: move.toRow } : p
    );
}

export { boardToPieces, movePiece, displayToPoint, pointToDisplay };