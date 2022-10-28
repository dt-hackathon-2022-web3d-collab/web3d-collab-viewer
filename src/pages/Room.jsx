import {
  queryIds as annotationsQueryIds,
  useGetAllAnnotations,
} from "../queries/annotations/annotations-query.js";
import { colourClassArray, tailWindColorsHex } from "../constants/colours";
import { createContext, useCallback, useMemo, useRef, useState } from "react";
import {
  useGetUsersInSession,
  queryIds as usersQueryIds,
} from "../queries/users/users-query";

import Annotations from "../components/Annotations/Annotations.jsx";
import AnnotationsModal from "../components/Annotations/AnnotationsModal";
import { CopySimple } from "phosphor-react";
import NameModal from "../components/NameModal.jsx";
import Participants from "../components/Participants";
import ShareRoom from "../components/ShareRoom";
import Toolbar from "../components/Toolbar";
import VariantList from "../components/Variants/VariantList.jsx";
import Viewer from "../components/Viewer.jsx";
import modes from "../constants/modes.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "../hooks/useWebSocket/useWebSocket";

const url = import.meta.env.VITE_SOCKET_URL;

export const Context = createContext({ mode: modes.view });

const Room = () => {
  const { roomId } = useParams();
  const [user, _setUser] = useState();
  const [cameraTransform, setCameraTransform] = useState({});
  const [selectedVariant, setSelectedVariant] = useState();
  const [selectedParticipant, _setSelectedParticipant] = useState();
  const [laser, setLaser] = useState(null);
  const [isAnnotationsOpen, setIsAnnotationsOpen] = useState();
  const [newAnnotation, setNewAnnotation] = useState();
  const [selectedAnnotation, setSelectedAnnotation] = useState();
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

  const [annotationsByVariant, _setAnnotationsByVariant] = useState();
  const annotationsByVariantRef = useRef([]);
  const setAnnotationsByVariant = (data) => {
    annotationsByVariantRef.current = data;
    _setAnnotationsByVariant(data);
  };

  const queryClient = useQueryClient();
  const { data } = useGetUsersInSession(roomId);

  const annotationsQuery = useGetAllAnnotations(roomId);
  const annotations = annotationsQuery.data?.rows ?? [];

  const participants = data?.rows ?? [];

  useEffect(() => {
    const ann = annotations.filter(
      (annotation) => annotation.variantId === selectedVariant
    );
    setAnnotationsByVariant(ann);
  }, [annotations, selectedVariant]);

  const userColorHex = useMemo(() => {
    const userIndex = participants.findIndex(
      (participant) => participant.id === user?.id
    );
    return tailWindColorsHex[
      colourClassArray[userIndex % colourClassArray.length]?.substring(3)
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
    setSelectedAnnotation();
  };

  const onLaserChanged = (laserPointed) => {
    updateLaser(laserPointed);
  };

  const [mode, setMode] = useState(modes.view);

  const onModeChanged = useCallback(
    (newMode) => {
      setMode(newMode);
    },
    [mode]
  );

  const onCancelNewAnnotation = () => {
    setNewAnnotation();
    setIsAnnotationsOpen(false);
  };

  const onAnnotationPoint = (point) => {
    setNewAnnotation({
      position: point,
    });
    setIsAnnotationsOpen(true);
  };

  const handleAnnotationClicked = (position) => {
    const selected = annotationsByVariantRef.current.filter((annotation) => {
      console.log(annotation);
      let pos;
      try {
        pos = JSON.parse(annotation.position);
      } catch (e) {}

      console.log({ ann: annotation.position, position });
      return (
        pos.x === position.x && pos.y === position.y && pos.z === position.z
      );
    });

    if (selected.length > 0) setSelectedAnnotation(selected[0].id);
  };

  return (
    <Context.Provider value={{ mode, user }}>
      <div className="absolute w-full h-full bg-gradient-radial from-neutral-100 via-neutral-250 to-neutral-400">
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
          <canvas
            id="number"
            width="64"
            height="64"
            className="invisible"
          ></canvas>
          <Viewer
            onLaserChanged={onLaserChanged}
            onOrbitChanged={onOrbitChanged}
            cameraTransform={cameraTransform}
            laser={laser}
            isFollowing={!!selectedParticipant}
            onNewAnnotation={onAnnotationPoint}
            onCanceledAnnotation={onCancelNewAnnotation}
            newAnnotation={newAnnotation}
            isAnnotationsEnabled={mode === modes.annotate}
            annotations={annotationsByVariant}
            userColorHex={userColorHex}
            isPointing={mode === modes.point}
            onClickAnnotation={handleAnnotationClicked}
          />
        </div>
        <div className="w-full text-center absolute top-3 left-0">
          <Participants
            participants={participants}
            onSelectParticipant={onSelectParticipant}
            selectedParticipant={selectedParticipant}
          />
        </div>
        <div>
          <div className="absolute right-2 top-1/4 bottom-1/4 z-10 overflow-hidden pointer-events-none">
            <Annotations
              annotations={annotationsByVariant}
              isAnotating={isAnnotationsOpen}
              newAnnotation={newAnnotation}
              onSubmitAnnotation={onCancelNewAnnotation}
              selectedVariant={selectedVariant}
              annotationId={selectedAnnotation}
              userId={user?.id}
              participants={participants}
            />
          </div>
        </div>
        <div className="absolute left-2 top-1/4 bottom-1/4 z-10 w-1/3 pointer-events-none">
          <VariantList
            onChange={onVariantChanged}
            selectedVariant={selectedVariant}
            isFollowing={!!selectedParticipant}
          />
        </div>
        <div className="absolute bottom-3 left-3 z-10">
          <Toolbar mode={mode} onModeChanged={onModeChanged} />
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <ShareRoom />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Room;
