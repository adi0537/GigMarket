import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const isProd = import.meta.env.PROD;
    const defaultUrl = isProd ? 'https://gigmarket-api.onrender.com' : 'http://localhost:5001';
    const serverUrl = import.meta.env.VITE_SOCKET_URL || defaultUrl;
    
    socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinUserRoom = (userId) => {
  if (socket && userId) {
    socket.emit('join', userId);
  }
};

export const joinGigChat = (gigId) => {
  if (socket && gigId) {
    socket.emit('join_gig_chat', gigId);
  }
};

export const leaveGigChat = (gigId) => {
  if (socket && gigId) {
    socket.emit('leave_gig_chat', gigId);
  }
};
