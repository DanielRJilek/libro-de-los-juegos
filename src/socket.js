import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Incoming Socket.IO event names — keep aligned with
 * libro-de-los-juegos-server/socket/events.js
 */
export const SOCKET_EVENTS = {
  NOTIFICATION: 'notification',
  TABLE_UPDATE: 'table-update',
  MESSAGE_NEW: 'message:new',
};

/** `table-update` payload discriminator (`payload.kind`) */
export const TABLE_UPDATE_KIND = {
  GAME_START: 'game-start',
  STATE: 'state',
  PLAYER_JOINED: 'player-joined',
  GAME_ENDED: 'game-ended',
};

/** Notification `payload.type` values from the server */
export const NOTIFICATION_TYPE = {
  FRIEND_REQUEST: 'friend_request',
  GAME_INVITE: 'game_invite',
  FRIEND_ACCEPTED: 'friend_accepted',
  SYSTEM: 'system',
};

/** Outgoing client → server event names */
export const CLIENT_SOCKET_EVENTS = {
  JOIN_TABLE: 'join-table',
  JOIN_USER: 'join-user',
};

/** socket.io-client manager events (listeners on `socket`) */
export const SOCKET_IO_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
};

export const socket = io(API_URL, {
  autoConnect: false,
});

export function emitJoinTable(tableID, userID) {
  socket.emit(CLIENT_SOCKET_EVENTS.JOIN_TABLE, tableID, userID);
}

export function emitJoinUser(userID) {
  socket.emit(CLIENT_SOCKET_EVENTS.JOIN_USER, userID);
}
