import './TablesGame.css'
import Header from "../../components/Header/Header";
import { ClipLoader } from "react-spinners";
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import TablesGameScreen from '../../components/TablesGameScreen/TablesGameScreen';
import useTablesGameSession from '../../hooks/useTablesGameSession';

function TablesGame({children}) {
    const session = useTablesGameSession();

    return (
        session.loading? <ClipLoader></ClipLoader> :
        <div className="game-page page">
            <Header></Header>
            <div id='main'>
                <TablesGameScreen session={session}/>
                <ConfirmModal
                    open={session.quitModalOpen}
                    onClose={session.cancelQuit}
                    title="Quit the game?"
                    message="The game will count as a loss."
                    onConfirm={session.quit}
                    confirmLabel="Quit game"
                    pendingConfirmLabel="Quitting…"
                    cancelLabel="Cancel"
                    variant="danger"
                />
            </div>
        </div>
    )
}

export default TablesGame