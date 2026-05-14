import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL;
// events:
// 'join-table'
// 'player-joined'
// 'game-update'
// 'game-start'
// 'connect'
// 'disconnect'
// 'game-ended
// 'leave-table'

export const socket = io(API_URL, {
  autoConnect: false
});