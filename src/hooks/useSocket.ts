import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function useSocket(onMessage: (msg: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('receiveMessage', onMessage);

    return () => {
      socket.off('receiveMessage', onMessage);
      socket.disconnect();
    };
  }, [onMessage]);

  const sendMessage = (msg: any) => {
    socketRef.current?.emit('sendMessage', msg);
  };

  return { sendMessage };
}
