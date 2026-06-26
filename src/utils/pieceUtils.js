const DISPLAY_COLS = 12;

const is1DBoard = (board) =>
    board?.[0] != null && ('p1' in board[0] || 'p2' in board[0]);

const serverToDisplay = (serverCol, serverRow, board, colOffset = 0) => {
    serverCol += colOffset;
    serverCol -= 1;
    const ySize = board?.[0]?.length ?? 2;

    if (is1DBoard(board)) {
        if (serverCol < DISPLAY_COLS) {
            return { col: serverCol, row: 1 };
        }
        return { col: DISPLAY_COLS * 2 - 1 - serverCol, row: 0 };
    }
    if (board?.length === DISPLAY_COLS) {
        return { col: serverCol, row: serverRow };
    }
    if (serverCol < DISPLAY_COLS) {
        return { col: serverCol, row: ySize - serverRow + 1};
    }
    return { col: serverCol - DISPLAY_COLS, row: serverRow };
};

const displayToServer = (displayCol, displayRow, board, colOffset = 0) => {
    const ySize = board?.[0]?.length ?? 2;
    displayCol -= colOffset;
    displayCol += 1;
    if (is1DBoard(board)) {
        if (displayRow === 1) {
            return { col: displayCol, row: 0 };
        }
        return { col: DISPLAY_COLS * 2  - displayCol + 1, row: 0 };
    }
    if (board?.length === DISPLAY_COLS) {
        return { col: displayCol, row: displayRow };
    }
    if (displayRow === ySize - 1) {
        return { col: displayCol, row: 0 };
    }
    if (displayRow === 0) {
        return { col: displayCol + DISPLAY_COLS, row: 0 };
    }
    return { col: displayCol, row: ySize + 1 - displayRow};
};

const boardToPieces = (board, colOffset = 0) => {
    if (!Array.isArray(board)) return [];
    const pieces = [];
    if (is1DBoard(board)) {
        for (let point = 1; point < board.length + 1; point++) {
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
    } 
    else {
        let point = 1;
        for (let col = 1; col < board.length + 1; col++) {
            for (let row = 0; row < board[col].length; row++) {
                const cell = board[col][row];
                if (!cell) continue;
                const { col: dCol, row: dRow } = serverToDisplay(col, row, board, colOffset);
                for (let k = 0; k < (cell.p1 ?? 0); k++) {
                    pieces.push({
                        id: `p1-${col}-${row}-${k}`,
                        player: 1,
                        col: dCol,
                        row: dRow,
                        point: point,
                    });
                }
                for (let k = 0; k < (cell.p2 ?? 0); k++) {
                    pieces.push({
                        id: `p2-${col}-${row}-${k}`,
                        player: 2,
                        col: dCol,
                        row: dRow,
                        point: point,
                    });
                }
                point++;
            }
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