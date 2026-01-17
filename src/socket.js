import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL;
// socket.emit('join-room', tableID, user.userID);
//     socket.on('game-update', newBoard => {
//         setBoard(newBoard);
//     })
export const socket = io(API_URL, {
  autoConnect: false
});