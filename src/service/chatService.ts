import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;
let isInitialized = false;
let currentRoomId: string | null = null;

const messageCallbacks: ((message: any) => void)[] = [];


export const initializeChatSocket = (token?: string, userId?: string) => {

  
  if (isInitialized) return;
    socket = io('http://localhost:4000/chat', {
    withCredentials: true,
    auth: { token, userId },
  });

  socket.on('connect', () => {
    console.log('Conectado al chat');
    if (currentRoomId) {
      joinRoom(currentRoomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Desconectado del chat');
  });

  socket.on('chatMessage', (message: any) => {
    messageCallbacks.forEach((cb) => cb(message));
  });

  isInitialized = true;
};

export const joinRoom = (roomId: string) => {
  const tokenFromStorage = localStorage.getItem('token') || '';
  const userId = localStorage.getItem('userId') || '';
  if (!socket) initializeChatSocket(tokenFromStorage, userId);
  currentRoomId = roomId;
  if (socket && socket.connected) {
    console.log("Uniéndose a la sala:", roomId);
    socket.emit('join_room', roomId);
  }
};

export const sendMessage = (roomId: string, message: any) => {
    console.log('Enviando mensaje:', message);
  if (socket && socket.connected) {
    console.log(`Enviando mensaje al chat en la sala ${roomId}:`, message);
    socket.emit("send_message", { room: roomId, message });
  }
};

export const onMessage = (callback: (message: any) => void) => {
  if (socket) {
    socket.on("receive_message", callback);
    // Opcional: para historial
    socket.on("message_history", (messages) => {
      messages.forEach(callback);
    });
  }
  // Devuelve función para desuscribirse
  return () => {
    if (socket) {
      socket.off("receive_message", callback);
    }
  };
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isInitialized = false;
    currentRoomId = null;
  }
};