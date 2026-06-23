import UserItem from '../UserItem/UserItem';
import TablesBoard from '../TablesBoard/TablesBoard';
import Dice from '../Dice/Dice';
import RulesModal from '../RulesModal/RulesModal';
import { useState } from 'react';
import './TablesGameScreen.css';

function TablesGameScreen({ session }) {
    const currentPlayer = session.gameState?.players?.find(
        (player) => player.playerNumber === session.gameState?.currentPlayerNumber
    );
    const isMyTurn = session.gameState?.currentPlayerNumber === session.userPlayerNumber;
    const turnStage = session.gameState?.turnStage;
    const [rulesModalOpen, setRulesModalOpen] = useState(false);

    const phaseHint = !session.isGameOver && isMyTurn
        ? turnStage === 'roll'
            ? 'Roll the dice to begin your turn.'
            : 'Select a piece, then tap a destination.'
        : !session.isGameOver
            ? `Waiting for ${currentPlayer?.username ?? 'opponent'}…`
            : null;

    return (
        <div className="tables-game-screen animate-fade-in-up">
            <h1 className="tables-game-title capitalize">{session.gameTitle}</h1>
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
                                        session.otherPlayerNumber === 1 ? 'black' : 'white'
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
                                        session.userPlayerNumber === 1 ? 'black' : 'white'
                                    }`}
                                />
                            </UserItem>
                        )}
                    </div>
                </aside>

                <div className="tables-game-board-column">
                    <div className="tables-game-board-stage">
                        <TablesBoard
                            xSize={12}
                            ySize={2}
                            userPlayerNumber={session.userPlayerNumber}
                            session={session}
                            lastMove={session.lastMove}
                            isGameOver={session.isGameOver}
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
                        <Dice value={session.dice[0].value} active={session.activeDiceIndex === 0} />
                        <Dice value={session.dice[1].value} active={session.activeDiceIndex === 1} />
                    </div>

                    {phaseHint && <p className="tables-game-phase-hint">{phaseHint}</p>}

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
