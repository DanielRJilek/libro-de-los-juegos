import { useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { socket, emitJoinUser, SOCKET_EVENTS, SOCKET_IO_EVENTS } from '../../socket';

function isSignedIn(userID) {
  return Boolean(userID && userID !== '');
}

/**
 * Keeps Socket.IO aligned with the logged-in user: connects when signed in,
 * joins the per-user room for notifications, and disconnects on sign-out.
 * Reconnects after external disconnect (e.g. game views calling disconnect)
 * while the user is still signed in.
 */
export default function SocketSession() {
  const { userID, fetchPrivateData } = useContext(UserContext);
  const userIDRef = useRef(userID);
  userIDRef.current = userID;
  const fetchPrivateDataRef = useRef(fetchPrivateData);
  fetchPrivateDataRef.current = fetchPrivateData;

  useEffect(() => {
    if (!isSignedIn(userID)) {
      if (socket.connected) {
        socket.disconnect();
      }
      return undefined;
    }

    function onConnect() {
      const id = userIDRef.current;
      if (isSignedIn(id)) {
        emitJoinUser(id);
      }
    }

    function onDisconnect() {
      if (isSignedIn(userIDRef.current)) {
        socket.connect();
      }
    }

    function onNotification(payload) {
      const { title, body } = payload ?? {};
      const text = [title, body].filter(Boolean).join(' — ');
      if (text) {
        toast.info(text);
      }
      void fetchPrivateDataRef.current?.();
    }

    socket.on(SOCKET_IO_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENTS.NOTIFICATION, onNotification);

    if (socket.connected) {
      emitJoinUser(userID);
    } else {
      socket.connect();
    }

    return () => {
      socket.off(SOCKET_IO_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENTS.NOTIFICATION, onNotification);
    };
  }, [userID]);

  return null;
}
