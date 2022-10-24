import { useEffect } from "react";

export const useWebSocket = ({ url, onOpen, onMessage, onClose, onError }) => {
  useEffect(() => {
    const websocket = new WebSocket(url);

    if (onOpen) {
      websocket.addEventListener("open", (event) => {
        onOpen(event, websocket);
      });
    }

    if (onMessage) {
      websocket.addEventListener("message", (event) => {
        onMessage(event, websocket);
      });
    }

    if (onClose) {
      websocket.addEventListener("close", (event) => {
        onClose(event, websocket);
      });
    }

    if (onError) {
      websocket.addEventListener("error", (event) => {
        onError(event, websocket);
      });
    }

    return () => {
      websocket.close();
    };
  }, [url, onOpen, onMessage, onClose, onError]);
};
