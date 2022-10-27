import { colourClassArray, tailWindColorsHex } from "../constants/colours";
import { createContext, useCallback, useMemo, useRef, useState } from "react";
import {
  queryIds as usersQueryIds,
  useGetUsersInSession,
} from "../queries/users/users-query";

import Annotations from "../components/Annotations/Annotations.jsx";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import VariantList from "../components/Variants/VariantList.jsx";
import Viewer from "../components/Viewer.jsx";
import modes from "../constants/modes.js";
import { queryIds as annotationsQueryIds } from "../queries/annotations/annotations-query.js";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";
import { useEffect } from "react";

const url = import.meta.env.VITE_SOCKET_URL;

export const Context = createContext({ mode: modes.view });

const Room = () => {
  const { roomId } = useParams();
  const [user, _setUser] = useState();
  const [cameraTransform, setCameraTransform] = useState({});
  const [selectedVariant, setSelectedVariant] = useState();
  const [selectedParticipant, _setSelectedParticipant] = useState();
  const [isPointing, setIsPointing] = useState(false);
  const [laser, setLaser] = useState(null);

  const selectedParticipantRef = useRef(selectedParticipant);
  const setSelectedParticipant = (data) => {
    selectedParticipantRef.current = data;
    _setSelectedParticipant(data);
  };

  const currentUserRef = useRef(user);
  const setUser = (data) => {
    currentUserRef.current = data;
    _setUser(data);
  };

  const queryClient = useQueryClient();
  const { data } = useGetUsersInSession(roomId);

  const participants = data?.rows ?? [];

  const userColorHex = useMemo(() => {
    const userIndex = participants.findIndex(
      (participant) => participant.id === user?.id
    );
    console.log(colourClassArray[userIndex % colourClassArray.length]);
    // ✨
    return tailWindColorsHex[
      colourClassArray[userIndex % colourClassArray.length]
    ];
  }, [user]);

  const onParticipantsUpdate = () => {
    queryClient.invalidateQueries(usersQueryIds.useGetUsersInSession(roomId));
  };

  const onAnnotationsUpdate = () => {
    queryClient.invalidateQueries(
      annotationsQueryIds.useGetAllAnnotations(roomId)
    );
  };

  const onSelectParticipant = (participant) => {
    if (participant.id === user?.id) return;
    setSelectedParticipant(participant);
  };

  const onLaserUpdate = (laserPointed) => {
    if (laserPointed.userId === user?.id) return;
    setLaser(laserPointed.pointer);
  };

  const onCameraUpdate = (cameraUpdate) => {
    if (cameraUpdate.userId === selectedParticipantRef.current?.id)
      setCameraTransform(cameraUpdate.transform);
  };

  const onVariantUpdate = (variantUpdated) => {
    if (variantUpdated.userId === selectedParticipantRef.current?.id)
      setSelectedVariant(variantUpdated.variant);
  };

  const { joinUser, updateCamera, updateVariant, updateLaser } = useWebSocket({
    url,
    onParticipantsUpdate,
    onCameraUpdate,
    onVariantUpdate,
    onAnnotationsUpdate,
    onLaserUpdate,
  });

  const onSubmitName = async (name) => {
    const newUser = await joinUser({ name, roomId });

    setUser(newUser);
    await queryClient.invalidateQueries(
      usersQueryIds.useGetUsersInSession(roomId)
    );
  };

  const onOrbitChanged = (transform) => {
    updateCamera(transform);
    setCameraTransform(transform);
  };

  const onVariantChanged = (variant) => {
    updateVariant(variant);
    setSelectedVariant(variant);
  };

  const onLaserChanged = (laserPointed) => {
    updateLaser(laserPointed);
  };

  const [mode, setMode] = useState(modes.view);

  const onModeChanged = useCallback(
    (newMode) => {
      if (newMode === modes.point && mode !== modes.point) {
        setIsPointing(true);
      } else if (mode === modes.point && newMode !== mode.point) {
        setIsPointing(false);
      }
      setMode(newMode);
    },
    [mode, setMode, setIsPointing]
  );

  return (
    <Context.Provider value={{ mode, user }}>
      <div className="absolute w-full h-full bg-gradient-radial from-neutral-400 via-neutral-250 to-neutral-100">
        <NameModal onSubmit={onSubmitName} />
        <div
          className="w-full h-full flex justify-center items-center absolute top-0 left-0 z-0"
          onClick={() => setSelectedParticipant()}
        >
          <div className="annotation invisible">
            <p>
              <strong>Cube</strong>
            </p>
            <p>
              In geometry, a cube is a three-dimensional solid object bounded by
              six square faces, facets or sides, with three meeting at each
              vertex.
            </p>
          </div>
          <canvas id="number" width="64" height="64"></canvas>
          <Viewer
            onLaserChanged={onLaserChanged}
            onOrbitChanged={onOrbitChanged}
            cameraTransform={cameraTransform}
            laser={laser}
            isFollowing={!!selectedParticipant}
            onAnnotation={(point) => console.log(`Annotating at ${point}`)}
            isAnnotationsEnabled={mode === modes.annotate}
            userColorHex={userColorHex}
            isPointing={isPointing}
          />
        </div>
        <div className="w-full text-center absolute top-0 left-0">
          <Participants
            participants={participants}
            onSelectParticipant={onSelectParticipant}
            selectedParticipant={selectedParticipant}
          />
        </div>
        <div className="absolute right-2 top-1/4 bottom-1/4 z-10">
          <Annotations
            userId={user?.id}
            participants={participants}
            selectedVariant={selectedVariant}
          />
        </div>
        <div className="absolute left-2 top-1/4 bottom-1/4 z-10 w-1/3">
          <VariantList
            onChange={onVariantChanged}
            selectedVariant={selectedVariant}
            isFollowing={!!selectedParticipant}
          />
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <Toolbar mode={mode} onModeChanged={onModeChanged} />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <ShareRoom />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Room;
