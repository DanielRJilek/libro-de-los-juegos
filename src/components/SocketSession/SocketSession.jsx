import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { socket, emitJoinUser, SOCKET_EVENTS, SOCKET_IO_EVENTS, NOTIFICATION_TYPE } from '../../socket';
import Invite from '../Invite/Invite';

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

    function metaToInvite(type, meta) {
      if (type === NOTIFICATION_TYPE.FRIEND_REQUEST) {
        return { _id: meta.fromUserId, username: meta.fromUsername };
      }
      if (type === NOTIFICATION_TYPE.GAME_INVITE) {
        return {
          table: { _id: meta.tableId, title: meta.title },
          sender: { username: meta.senderUsername },
        };
      }
      return meta;
    }

    function onNotification(payload) {
      const { type, title, body, meta = {} } = payload ?? {};
      const text = [title, body].filter(Boolean).join(' — ');
      if (!text) return;
      const isActionable =
        type === NOTIFICATION_TYPE.FRIEND_REQUEST ||
        type === NOTIFICATION_TYPE.GAME_INVITE;
      if (!isActionable) {
        toast.info(text);
        return;
      }
      const invite = metaToInvite(type, meta);
      const toastId = toast.info(
        <Invite
          invite={invite}
          type={type}
          onDone={() => toast.dismiss(toastId)}
        />,
        { autoClose: false }
      );
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
