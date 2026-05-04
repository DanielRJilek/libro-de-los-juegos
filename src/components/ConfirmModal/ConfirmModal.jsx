import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./ConfirmModal.css";

/**
 * Native <dialog> confirm prompt. Uses showModal() for top-layer + ::backdrop.
 */
function ConfirmModal({
    open,
    onClose,
    title,
    message,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    pendingConfirmLabel = "Please wait…",
    variant = "default",
}) {
    const dialogRef = useRef(null);
    const titleId = useId();
    const [pending, setPending] = useState(false);

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

    useEffect(() => {
        if (!open) setPending(false);
    }, [open]);

    const handleCancel = useCallback(
        (e) => {
            if (pending) e.preventDefault();
        },
        [pending]
    );

    const handleConfirm = useCallback(async () => {
        if (!onConfirm || pending) return;
        setPending(true);
        try {
            await onConfirm();
        } finally {
            setPending(false);
        }
    }, [onConfirm, pending]);

    return (
        <dialog
            ref={dialogRef}
            className="confirm-modal"
            aria-labelledby={titleId}
            onClose={onClose}
            onCancel={handleCancel}
        >
            <h2 id={titleId} className="confirm-modal-title">
                {title}
            </h2>
            {message != null && message !== "" && (
                <div className="confirm-modal-text">{message}</div>
            )}
            <div className="confirm-modal-actions">
                <form method="dialog">
                    <button
                        type="submit"
                        className="confirm-modal-button confirm-modal-button-cancel"
                        disabled={pending}
                    >
                        {cancelLabel}
                    </button>
                </form>
                <button
                    type="button"
                    className={
                        variant === "danger"
                            ? "confirm-modal-button confirm-modal-button-danger"
                            : "confirm-modal-button confirm-modal-button-primary"
                    }
                    onClick={handleConfirm}
                    disabled={pending}
                >
                    {pending ? pendingConfirmLabel : confirmLabel}
                </button>
            </div>
        </dialog>
    );
}

export default ConfirmModal;
