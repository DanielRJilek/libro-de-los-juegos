import { useEffect, useId, useRef } from "react";
import "./RulesModal.css";

function RulesModal({open, onClose, title, rules}) {
    const dialogRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (open) {
            if (!d.open) {
                try {
                    d.showModal();
                } catch {
                    /* already open (e.g. Strict Mode) */
                }
            }
        } else if (d.open) {
            d.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className="rules-modal"
            aria-labelledby={titleId}
            onClose={onClose}
        >
            <h2 id={titleId} className="rules-modal-title capitalize">
                {title}
            </h2>
            {rules != null && rules !== "" && (
                <div className="rules-modal-text">{rules}</div>
            )}
            <div className="rules-modal-actions">
                <form method="dialog">
                    <button type="submit" className="rules-modal-button">
                        Close
                    </button>
                </form>
            </div>
        </dialog>
    );
}

export default RulesModal;
