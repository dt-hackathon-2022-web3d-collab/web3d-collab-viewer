import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import Toolbar from "../components/Toolbar";
import { useGetOrdered } from "../queries/owen-wilson/owen-wilson-query";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const Room = () => {
  const { isLoading, data } = useGetOrdered(6);

  console.log(data);

  const socket = useWebSocket({
    url,
  });

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
      <NameModal />
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
