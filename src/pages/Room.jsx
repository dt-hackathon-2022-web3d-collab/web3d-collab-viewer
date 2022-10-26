import { createContext, useCallback } from "react";

import Annotations from "../components/Annotations/Annotations.jsx";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import VariantList from "../components/Variants/VariantList.jsx";
import Viewer from "../components/Viewer.jsx";
import { useGetUsersInSession } from "../queries/users/users-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const url = import.meta.env.VITE_SOCKET_URL;

export const Context = createContext({ mode: "view" });

const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useState();
  const [didJoin, setDidJoin] = useState(false);
  const [cameraTransform, setCameraTransform] = useState({});
  const [selectedVariant, setSelectedVariant] = useState();
  const isFollowing = user?.name == "follow";

  const { data, refetch } = useGetUsersInSession(roomId);

  const participants = data?.rows ?? [];

  const onParticipantsUpdate = () => {
    refetch();
  };

  const onCameraUpdate = (cameraUpdate) => {
 
    setCameraTransform(cameraUpdate.transform);
  }


  const onVariantUpdate = ({variant}) => {
    setSelectedVariant(variant)
  }

const { joinUser, updateCamera, updateVariant } = useWebSocket({
    url,
    onParticipantsUpdate,
    onCameraUpdate,
    onVariantUpdate,
  });

  const onSubmitName = async (name) => {
    const user = await joinUser({ name, roomId });
    console.log("Joined =>", user);
    setUser(user);
  };

  const onOrbitChanged = (transform) => {
    updateCamera(transform)
  }

  const onVariantChanged = (variant) => {
    updateVariant(variant);
  }

  const [mode, setMode] = useState("view");

  const onModeChanged = useCallback(
    (mode) => {
      console.log(mode);
      setMode(mode);
    },
    [setMode]
  );

  return (
    <Context.Provider value={{ mode }}>
      <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute">
        <NameModal onSubmit={onSubmitName} />
        <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 z-0">
          <Viewer onOrbitChanged={onOrbitChanged} cameraTransform={cameraTransform} isFollowing={isFollowing} />
        </div>
        <div className="w-full text-center absolute top-0 left-0">
          <Participants participants={participants} />
        </div>
        <div className="absolute right-2 top-1/4 bottom-1/4 z-10 overflow-hidden">
          <Annotations userId={user?.id} participants={participants} />
        </div>
        <div className="absolute left-2 top-1/4 bottom-1/4 z-10 overflow-hidden">
          <VariantList onChange={onVariantChanged} selectedVariant={selectedVariant} isFollowing={isFollowing} />
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <Toolbar onModeChanged={onModeChanged} />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <ShareRoom />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Room;
