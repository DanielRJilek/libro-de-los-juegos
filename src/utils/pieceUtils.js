const DISPLAY_COLS = 12;
const BAR_COL = Math.floor(DISPLAY_COLS / 2);

const serverToDisplay = (serverCol, serverRow, board, colOffset = 0) => {
    if (serverCol == 0) return { col: 0, row: 0 };
    serverCol += colOffset;
    serverCol -= 1;
    if (serverCol < DISPLAY_COLS) {
        return { col: serverCol, row: 1 };
    }
    return { col: DISPLAY_COLS * 2 - 1 - serverCol, row: 0 };
};

const displayToServer = (displayCol, displayRow, board, colOffset = 0) => {
    displayCol -= colOffset;
    displayCol += 1;
    if (displayRow === 1) {
        return { col: displayCol, row: 0 };
    }
    return { col: DISPLAY_COLS * 2  - displayCol + 1, row: 0 };
    
};

const boardToPieces = (board, colOffset = 0) => {
    if (!Array.isArray(board)) return [];
    const pieces = [];
    for (let i = 0; i < board[0].p1?.length; i++) {
        pieces.push({
            id: `p1-0-${i}`,
            player: 1,
            point: 0,
            col: -1,
            row: 1,
        });
    }
    for (let i = 0; i < board[0].p2?.length; i++) {
        pieces.push({
            id: `p2-0-${i}`,
            player: 2,
            point: 0,
            col: -1,
            row: 0,
        });
    }
    for (let point = 1; point < board.length; point++) {
        const cell = board[point];
        const { col, row } = serverToDisplay(point, 0, board, colOffset);
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
    return pieces;
}

const movePiece = (prev, move, board, colOffset = 0) => {
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
    const { col, row } = serverToDisplay(move.toCol, move.toRow, board, colOffset);
    return prev.map((p, i) =>
        i === idx ? { ...p, col, row } : p
    );
}

export { boardToPieces, movePiece, serverToDisplay, displayToServer };