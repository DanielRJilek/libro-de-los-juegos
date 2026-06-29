import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import "./ServerBootScreen.css";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_ATTEMPTS = 3;
const HEALTH_TIMEOUT_MS = 90000;

export const ServerStatusContext = createContext();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingHealth() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: "GET",
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error("Health check failed");
        }
        return response.json();
    } finally {
        clearTimeout(timer);
    }
}

function ServerBootGate({ children, status, attempt, retry }) {
    if (status === "ready") {
        return children;
    }

    return (
        <div className="server-boot-screen">
            <div className="server-boot-card">
                <ClipLoader color="var(--accent-cyan)" size={48} />
                {status === "checking" && <p>Connecting to server…</p>}
                {status === "waking" && (
                    <>
                        <p>Server is starting up…</p>
                        <p className="server-boot-hint">
                            Free hosting can take up to a minute after idle time.
                        </p>
                        <p className="server-boot-attempt">Attempt {attempt} of {MAX_ATTEMPTS}…</p>
                    </>
                )}
                {status === "offline" && (
                    <>
                        <p>Couldn&apos;t reach the server.</p>
                        <button type="button" className="server-boot-retry" onClick={retry}>
                            Try again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export function ServerStatusProvider({ children }) {
    const [status, setStatus] = useState("checking");
    const [attempt, setAttempt] = useState(1);

    const wakeServer = useCallback(async () => {
        setStatus("checking");
        setAttempt(1);

        for (let i = 1; i <= MAX_ATTEMPTS; i++) {
            setAttempt(i);
            if (i > 1) {
                setStatus("waking");
            }
            try {
                await pingHealth();
                setStatus("ready");
                return;
            } catch {
                if (i < MAX_ATTEMPTS) {
                    await sleep(5000 * i);
                }
            }
        }
        setStatus("offline");
    }, []);

    useEffect(() => {
        wakeServer();
    }, [wakeServer]);

    return (
        <ServerStatusContext value={{ status, attempt, retry: wakeServer }}>
            <ServerBootGate status={status} attempt={attempt} retry={wakeServer}>
                {children}
            </ServerBootGate>
        </ServerStatusContext>
    );
}

export function useServerStatus() {
    return useContext(ServerStatusContext);
}
