import { useParams } from "react-router-dom";
import { useState } from "react";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import Viewer from "../components/Viewer.jsx";
import Annotations from "../components/Annotations/Annotations.jsx";
import VariantList from "../components/Variants/VariantList.jsx";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";
import { useGetUsersInSession } from "../queries/users/users-query";

const url = import.meta.env.VITE_SOCKET_URL;

const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useState(null);

  const { data, refetch } = useGetUsersInSession(roomId);

  const participants = data?.rows ?? [];

  const onParticipantsUpdate = () => {
    refetch();
  };

  const { joinUser } = useWebSocket({
    url,
    onParticipantsUpdate,
  });

  const onSubmitName = async (name) => {
    const user = await joinUser({ name, roomId });
    console.log("Joined =>", user);
    setUser(user);
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute">
      <NameModal onSubmit={onSubmitName} />

      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 z-0">
        <Viewer />
      </div>
      <div className="w-full text-center absolute top-0 left-0">
        <Participants participants={participants} />
      </div>
      <div className="absolute right-2 top-1/4 bottom-1/4 z-10 overflow-hidden">
        <Annotations userId={user?.id} participants={participants} />
      </div>
      <div className="absolute left-2 top-1/4 bottom-1/4 z-10 overflow-hidden">
        <VariantList />
      </div>
      <div className="absolute bottom-2 left-2 z-10">
        <Toolbar />
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <ShareRoom />
      </div>
    </div>
  );
};

export default Room;
