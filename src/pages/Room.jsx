import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import Viewer from "../components/Viewer.jsx";
import { useParams } from "react-router-dom";
import AddAnnotation from "../components/AddAnnotation.jsx";
import { useState } from "react";
import Annotations from "../components/Annotations.jsx";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const url = import.meta.env.VITE_SOCKET_URL;

const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useState(null);

  const { joinUser } = useWebSocket({
    url,
  });

  const onSubmitName = async (name) => {
    const user = await joinUser({ name, roomId });
    console.log("Joined =>", user);
    setUser(user);
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
      <NameModal onSubmit={onSubmitName} />
      <div className="w-3/4 mx-auto bg-yellow text-center">
        <Participants />
      </div>
      <div className="absolute left-0 top-1/4 z-[2]">
        <Annotations />
      </div>
      <div className="absolute bottom-2 left-2">
        <Toolbar />
      </div>
      <div className="h-3/4 w-full flex justify-center items-center">
        {!!user && <Viewer />}
      </div>
      <div className="absolute bottom-2 right-2">
        <AddAnnotation userId={user?.id} />
        <ShareRoom />
      </div>
    </div>
  );
};

export default Room;
