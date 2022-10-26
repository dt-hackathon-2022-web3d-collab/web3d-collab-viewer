import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export const useWebSocket = ({ url, onParticipantsUpdate }) => {
  const socket = useRef(io(url));
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.current.on("connect", () => {
      setIsConnected(true);
    });

    socket.current.on("users", () => {
      if (onParticipantsUpdate) {
        onParticipantsUpdate();
      }
    });

    return () => {
      socket.current.off("connect");
      socket.current.off("disconnect");
    };
  }, [url]);

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
