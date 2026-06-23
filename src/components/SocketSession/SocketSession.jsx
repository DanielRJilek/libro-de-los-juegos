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
 * Reconnects after external disconnect 
 * while the user is still signed in.
 */
export default function SocketSession() {
  const user = useContext(UserContext);

  useEffect(() => {
    if (!isSignedIn(user.userID)) {
      if (socket.connected) {
        socket.disconnect();
      } 
      return undefined;
    } else {
      socket.connect();
    }

    function onConnect() {
      const id = user.userID;
      if (isSignedIn(id)) {
        emitJoinUser(id);
      }
    }

    function onDisconnect() {
      if (isSignedIn(user.userID)) {
        socket.connect();
      }
    }

    function onNotification(payload) {
      const { title, body } = payload ?? {};
      const text = [title, body].filter(Boolean).join(' — ');
      if (text) {
        toast.info(text);
      }
      user.fetchPrivateData();
    }

    socket.on(SOCKET_IO_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENTS.NOTIFICATION, onNotification);

    if (socket.connected) {
      emitJoinUser(user.userID);
    } else {
      socket.connect();
    }

    return () => {
      socket.off(SOCKET_IO_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_IO_EVENTS.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENTS.NOTIFICATION, onNotification);
    };
  }, [user.userID]);

  return null;
}
