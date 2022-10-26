import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { usePersistentContext } from "../usePersistentContext/usePersistentContext";

const url = import.meta.env.VITE_SOCKET_URL;

const socket = io(url);

export const useWebSocket = ({ onParticipantsUpdate, onAnnotationsUpdate }) => {
  const [isConnected, setIsConnected] = useState();

  const [user, setUser] = usePersistentContext("user");

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      setUser(null);
    });

    socket.on("ping", () => {
      console.log("ping");
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.on("users", () => {
      if (onParticipantsUpdate) {
        onParticipantsUpdate();
      }
    });

    socket.on("annotations", () => {
      if (onAnnotationsUpdate) {
        onAnnotationsUpdate();
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  const joinUser = ({ name, roomId }) =>
    new Promise((resolve) => {
      socket.emit(
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
