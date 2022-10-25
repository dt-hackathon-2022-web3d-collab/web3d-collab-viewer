import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export const useWebSocket = ({ url }) => {
  const socket = useRef(io(url));
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.current.on("connect", () => {
      setIsConnected(true);
    });

    return () => {
      socket.current.off("connect");
      socket.current.off("disconnect");
    };
  }, [url]);

  const joinUser = ({ name, roomId }) => {
    socket.current.emit(
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
