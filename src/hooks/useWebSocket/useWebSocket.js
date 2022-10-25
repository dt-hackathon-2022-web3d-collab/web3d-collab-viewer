import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useWebSocket = ({ url }) => {
  const socket = io(url);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [url]);

  const joinUser = ({ name, roomId }) => {
    socket.emit(
      "join",
      {
        sessionId: roomId,
        name,
      },
      (response) => {
        console.log("==> joined", response);
      }
    );
  };

  return {
    joinUser,
  };
};
