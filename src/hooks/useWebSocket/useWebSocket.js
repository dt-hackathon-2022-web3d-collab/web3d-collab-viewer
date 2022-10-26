import { useEffect, useRef, useState } from "react";

import io from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;


const socket = io(url);

export const useWebSocket = ({ onParticipantsUpdate }) => {
  const [isConnected, setIsConnected] = useState();
  
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    socket.current.on("users", () => {
      if (onParticipantsUpdate) {
        onParticipantsUpdate();
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  const joinUser = ({ name, roomId }) =>
    new Promise((resolve) => {
      socket.current.emit(
        "join",
        {
          sessionId: roomId,
          name,
        },
        resolve
      );
    });

  return {
    joinUser,
  };
};
