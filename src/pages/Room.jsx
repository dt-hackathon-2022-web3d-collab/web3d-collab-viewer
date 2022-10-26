import { createContext, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import Viewer from "../components/Viewer.jsx";
import Annotations from "../components/Annotations/Annotations.jsx";
import VariantList from "../components/Variants/VariantList.jsx";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";
import {
  queryIds as usersQueryIds,
  useGetUsersInSession,
} from "../queries/users/users-query";
import { queryIds as annotationsQueryIds } from "../queries/annotations/annotations-query.js";

const url = import.meta.env.VITE_SOCKET_URL;

export const Context = createContext({ mode: "view" });

const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useState("user");

  const queryClient = useQueryClient();
  const { data } = useGetUsersInSession(roomId);

  const participants = data?.rows ?? [];

  const onParticipantsUpdate = () => {
    queryClient.invalidateQueries(usersQueryIds.useGetUsersInSession(roomId));
  };

  const onAnnotationsUpdate = () => {
    queryClient.invalidateQueries(
      annotationsQueryIds.useGetAllAnnotations(roomId)
    );
  };

  const { joinUser } = useWebSocket({
    url,
    onParticipantsUpdate,
    onAnnotationsUpdate,
  });

  const onSubmitName = async (name) => {
    const user = await joinUser({ name, roomId });

    setUser(user);
    queryClient.invalidateQueries(usersQueryIds.useGetUsersInSession(roomId));
  };

  const [mode, setMode] = useState("view");

  const onModeChanged = useCallback(
    (mode) => {
      console.log(mode);
      setMode(mode);
    },
    [setMode]
  );

  return (
    <Context.Provider value={{ mode, user }}>
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
