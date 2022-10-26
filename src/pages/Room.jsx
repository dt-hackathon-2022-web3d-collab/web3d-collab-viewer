import { useEffect, useState } from "react";

import Annotations from "../components/Annotations/Annotations.jsx";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import Viewer from "../components/Viewer.jsx";
import { useGetUsersInSession } from "../queries/users/users-query";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const url = import.meta.env.VITE_SOCKET_URL;

const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useState(null);
  const [didJoin, setDidJoin] = useState(false);
  const [cameraTransform, setCameraTransform] = useState({});
  const [testInterval, setTestInterval] = useState();



  // useEffect(() => {
  //   console.log(cameraTransform.rotation.y);
  // }, [cameraTransform])

  const { data, refetch } = useGetUsersInSession(roomId);

  const participants = data?.rows ?? [];

  const onParticipantsUpdate = () => {
    refetch();
  };

  const onCameraUpdate = (cameraUpdate) => {
    console.log(cameraUpdate);
    setCameraTransform(cameraUpdate.transform);
  }

  const { joinUser, updateCamera } = useWebSocket({
    url,
    onParticipantsUpdate,
    onCameraUpdate,
  });

  const onSubmitName = async (name) => {
    const user = await joinUser({ name, roomId });
    console.log("Joined =>", user);
    setUser(user);
  };

  const onOrbitChanged = (transform) => {
    updateCamera(transform)
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500">
      <NameModal onSubmit={onSubmitName} />
      <div className="w-3/4 mx-auto bg-yellow text-center">
        <Participants participants={participants} />
      </div>
      <div className="absolute right-2 top-1/4 bottom-1/4 z-[2] overflow-hidden">
        <Annotations userId={user?.id} participants={participants} />
      </div>
      <div className="absolute bottom-2 left-2">
        <Toolbar />
      </div>
      <div className="h-3/4 w-full flex justify-center items-center">
        {!!user && <Viewer onOrbitChanged={onOrbitChanged} cameraTransform={cameraTransform} isFollowing={user.id != "5f9d41c2-9451-4263-af84-a980591d15b1"} />}
      </div>
      <div className="absolute bottom-2 right-2">
        <ShareRoom />
      </div>
    </div>
  );
};

export default Room;
