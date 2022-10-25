import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import Toolbar from "../components/Toolbar";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";
import { useParams } from "react-router-dom";

const url = import.meta.env.VITE_SOCKET_URL;

const Room = () => {
  const { roomId } = useParams();

  const { joinUser } = useWebSocket({
    url,
  });

  const onSubmitName = (name) => joinUser({ name, roomId });

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
      <NameModal onSubmit={onSubmitName} />
      <div className="w-3/4 mx-auto bg-yellow text-center">
        <Participants />
      </div>
      <div className="absolute bottom-0 left-0">
        <Toolbar />
      </div>
    </div>
  );
};

export default Room;
