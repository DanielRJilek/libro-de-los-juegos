import UserItem from '../UserItem/UserItem';
import TablesBoard from '../TablesBoard/TablesBoard';
import Dice from '../Dice/Dice';
import RulesModal from '../RulesModal/RulesModal';
import { useState, useEffect } from 'react';
import { displayToServer } from '../../utils/pieceUtils';
import './TablesGameScreen.css';

function TablesGameScreen({ session }) {
    const currentPlayer = session.gameState?.players?.find(
        (player) => player.playerNumber === session.gameState?.currentPlayerNumber
    );
    const isMyTurn = session.gameState?.currentPlayerNumber === session.userPlayerNumber;
    const turnStage = session.gameState?.turnStage;
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedDice, setSelectedDice] = useState(null);
    const [errorMessage, setErrorMessage] = useState(session.errorMessage);
    const board = session.gameState?.board;
    const is2D = Array.isArray(board?.[0]);
    const xSize = 12;
    const ySize = is2D ? board[0].length * 2 : 2;

    const phaseHint = !session.isGameOver && isMyTurn
        ? turnStage === 'roll'
            ? 'Roll the dice to begin your turn.'
            : 'Select a piece, then tap a destination.'
        : !session.isGameOver
            ? `Waiting for ${currentPlayer?.username ?? 'opponent'}…`
            : null;

    useEffect(() => {
        if (session.errorMessage) {
            setErrorMessage(session.errorMessage);
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        } else {
            setErrorMessage(null);
        }
    }, [session.errorMessage]);

    const handleDiceClick = (dice) => {
        if (!selectedPiece || !selectedCell) return;
        console.log("selected piece", selectedPiece);
        const {col: fromCol, row: fromRow} = displayToServer(selectedPiece.col, selectedPiece.row, board);
        const {col: toCol, row: toRow} = displayToServer(selectedCell.col, selectedCell.row, board);
        if (session.dice?.some((d) => !d.used && d.value === dice.value)) {
            console.log("submitting move", fromCol, toCol, fromRow, toRow, dice.value);
            session.submitMove({ fromCol: fromCol, toCol: toCol, 
                fromRow: fromRow, toRow: toRow, diceValue: dice.value });
        }
    }

    const dice = session.dice.map((die) => 
        <div key={die.id}>
            <Dice value={die.value} active={session.activeDiceIndex} onClick={() => handleDiceClick(die)} />
        </div>
    );

    return (
        <div className="tables-game-screen animate-fade-in-up">
            <h1 className="tables-game-title capitalize">
                {session.gameTitle.replace(/-/g, ' ')}
            </h1>
            <header className="tables-game-status animate-fade-in-up animate-delay-1">
                <div className="tables-game-status-text">
                    {!session.isGameOver && (
                        <>
                            <p className="tables-game-eyebrow">Current turn</p>
                            <h2 className="tables-game-turn-name">{currentPlayer?.username}</h2>
                        </>
                    )}
                    {session.isGameOver && (
                        <>
                            <p className="tables-game-eyebrow">Game over</p>
                            <h2 className="tables-game-turn-name">{session.resolvedWinner?.username} wins!</h2>
                        </>
                    )}
                </div>
                <div className="tables-game-status-meta">
                    {!session.isGameOver && (
                        <span className={`tables-game-turn-pill${isMyTurn ? ' tables-game-turn-pill--yours' : ''}`}>
                            {isMyTurn ? 'Your turn' : 'Waiting'}
                        </span>
                    )}
                    <button
                        className="tables-game-rules-button"
                        type="button"
                        onClick={() => setRulesModalOpen(true)}
                        aria-label="Show rules"
                    >
                        Rules
                    </button>
                </div>
            </header>

            <div className="tables-game-arena animate-fade-in-up animate-delay-1">
                <aside className="tables-game-players" aria-label="Players">
                    <div className="tables-game-player-card">
                        <span className="tables-game-player-label">Opponent</span>
                        {session.otherUser && (
                            <UserItem key={`p-${session.otherPlayerNumber}`} user={session.otherUser}>
                                <div
                                    className={`tables-game-piece-symbol ${
                                        session.otherPlayerNumber === 1 ? 'white' : 'black'
                                    }`}
                                />
                            </UserItem>
                        )}
                    </div>
                    <div className="tables-game-player-card tables-game-player-card--self">
                        <span className="tables-game-player-label">You</span>
                        {session.selfUser && (
                            <UserItem key={`p-${session.userPlayerNumber}`} user={session.selfUser}>
                                <div
                                    className={`tables-game-piece-symbol ${
                                        session.userPlayerNumber === 1 ? 'white' : 'black'
                                    }`}
                                />
                            </UserItem>
                        )}
                    </div>
                </aside>

                <div className="tables-game-board-column">
                    <div className="tables-game-board-stage">
                        <TablesBoard
                            xSize={xSize}
                            ySize={ySize}
                            userPlayerNumber={session.userPlayerNumber}
                            session={session}
                            lastMove={session.lastMove}
                            isGameOver={session.isGameOver}
                            selectedPiece={selectedPiece}
                            setSelectedPiece={setSelectedPiece}
                            selectedCell={selectedCell}
                            setSelectedCell={setSelectedCell}
                        />
                        {session.isGameOver && (
                            <div className="tables-game-over-overlay animate-fade-in-up">
                                <h2>Game Over</h2>
                                <p>
                                    {session.didCurrentUserWin
                                        ? 'You won!'
                                        : `${session.resolvedWinner?.username} won.`}
                                </p>
                                <button type="button" onClick={session.leaveGameOverScreen}>
                                    Leave Table
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="tables-game-controls" aria-label="Game controls">
                    <p className="tables-game-controls-label">Dice</p>
                    <div className="tables-game-dice-tray">
                        {dice}
                    </div>

                    {phaseHint && <p className="tables-game-phase-hint">{phaseHint}</p>}
                    {errorMessage && <p className="tables-game-error-message">{errorMessage}</p>}

                    <div className="tables-game-actions">
                        {session.canRoll && (
                            <button
                                type="button"
                                className="tables-game-roll-button"
                                onClick={session.roll}
                                disabled={session.isGameOver}
                            >
                                Roll!
                            </button>
                        )}
                        {session.selfUser?.phase == 2 && session.canMove && selectedPiece && (
                            <button
                                type="button"
                                onClick={() => session.submitMove({ fromCol: selectedPiece.col, 
                                    toCol: null, diceValue: null })}
                                disabled={session.isGameOver}
                            >
                                Bear Off
                            </button>
                        )}
                        {!session.isGameOver && (
                            <button
                                type="button"
                                className="tables-game-quit-button"
                                onClick={session.requestQuit}
                                disabled={session.isGameOver}
                            >
                                Quit
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            <RulesModal
                open={rulesModalOpen}
                onClose={() => setRulesModalOpen(false)}
                title={session.gameInfo?.title}
                rules={session.gameInfo?.rules}
            />
        </div>
    );
}

export default TablesGameScreen;
