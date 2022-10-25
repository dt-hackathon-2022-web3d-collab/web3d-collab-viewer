import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useWebSocket = ({ url }) => {
  const socket = io(url);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("==> connected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [url]);

  useEffect(() => {
    if (isConnected) {
      socket.emit(
        "join",
        {
          sessionId: "5f53c5d8-91dd-4216-a56e-c0bda467582a",
          name: "casey",
        },
        (response) => {
          console.log("==> joined", response);
        }
      );
    }
  }, [isConnected]);
};
