import { useEffect, useRef, useState } from "react";

import io from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;

const socket = io(url);

export const useWebSocket = ({
  onParticipantsUpdate,
  onCameraUpdate,
  onVariantUpdate,
  onAnnotationsUpdate,
}) => {
  const [isConnected, setIsConnected] = useState();

  useEffect(() => {
    if (isConnected) return;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
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

    socket.on("camera-updated", (transform) => {
      if (onCameraUpdate) {
        onCameraUpdate(transform);
      }
    });

    socket.on("variant-updated", (variant) => {
      if (onVariantUpdate) {
        onVariantUpdate(variant);
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

  const updateCamera = (transform) => {
    socket.emit("camera-transform", transform);
  };

  const updateVariant = (variantId) => {
    socket.emit("variant-change", variantId);
  };

  return {
    joinUser,
    updateCamera,
    updateVariant,
  };
};
