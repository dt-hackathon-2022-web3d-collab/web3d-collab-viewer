import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import Viewer from "../components/Viewer.jsx";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const url = import.meta.env.VITE_SOCKET_URL;

const Room = () => {
  const { roomId } = useParams();
  const [didJoin, setDidJoin] = useState(false);

  const { joinUser } = useWebSocket({
    url,
  });

  const onSubmitName = (name) => {
    joinUser({ name, roomId });
    setDidJoin(true);
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
      <NameModal onSubmit={onSubmitName} />
      <div className="w-3/4 mx-auto bg-yellow text-center">
        <Participants />
      </div>
      <div className="absolute bottom-2 left-2">
        <Toolbar />
      </div>
      <div className="h-3/4 w-full flex justify-center items-center">
        {didJoin && <Viewer />}
      </div>
      <div className="absolute bottom-2 right-2">
        <ShareRoom/>
      </div>
    </div>
  );
};

export default Room;
