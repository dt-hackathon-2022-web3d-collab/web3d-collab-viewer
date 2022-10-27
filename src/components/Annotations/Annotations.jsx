import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, XCircle } from "phosphor-react";
import { useState } from "react";
import { useParams } from "react-router";
import {
  queryIds as annotationQueryIds,
  useCreateAnnotation,
  useGetAllAnnotations,
  useResolveAnnotation,
  useUnresolveAnnotation,
} from "../../queries/annotations/annotations-query";
import { useCreateReply } from "../../queries/replies/replies-query";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationTextInput } from "./AnnotationTextInput";
import { ReplyItem } from "./ReplyItem";
import classNames from "classnames";
import { DrawerToggle } from "../DrawerToggle";

const filters = ["All", "Unresolved", "Resolved"];

const Annotations = ({ userId, participants, selectedVariant }) => {
  const { roomId: sessionId } = useParams();
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const queryClient = useQueryClient();
  const annotationsQuery = useGetAllAnnotations(sessionId);
  const annotations = annotationsQuery.data?.rows ?? [];
  const filteredAnnotations = annotations.filter((annotation) => {
    if (selectedFilterIndex === 0) {
      return true;
    }

    if (selectedFilterIndex === 1) {
      return !annotation.resolved;
    }

    return annotation.resolved;
  });
  const createAnnotation = useCreateAnnotation();
  const createReply = useCreateReply();
  const resolveAnnotation = useResolveAnnotation();
  const unresolveAnnotation = useUnresolveAnnotation();
  const selected = annotations?.find(
    (annotation) => annotation.id === selectedAnnotationId
  );

  const handleSelect = (_event, annotation) => {
    setSelectedAnnotationId(annotation.id);
  };

  const handleDeselect = () => {
    setSelectedAnnotationId(null);
  };

  const handleAnnotation = async (event) => {
    event.preventDefault();

    const button = event.target.submitter;
    const input = event.target.text;
    const message = input.value;

    if (!message) {
      return;
    }

    button.disabled = true;
    input.disabled = true;
    const body = { message, userId, position: 0, variantId: selectedVariant };
    await createAnnotation.mutateAsync({ sessionId, body });
    queryClient.invalidateQueries(
      annotationQueryIds.useGetAllAnnotations(sessionId)
    );
    button.disabled = false;
    input.disabled = false;
    input.value = "";
  };

  const handleReply = async (event) => {
    event.preventDefault();

    const button = event.target.submitter;
    const input = event.target.text;
    const message = input.value;

    if (!message) {
      return;
    }

    button.disabled = true;
    input.disabled = true;
    const body = { message, userId };
    const annotationId = selected.id;
    await createReply.mutateAsync({ sessionId, annotationId, body });
    queryClient.invalidateQueries(
      annotationQueryIds.useGetAllAnnotations(sessionId)
    );
    button.disabled = false;
    input.disabled = false;
    input.value = "";
  };

  const handleToggleResolved = async () => {
    const params = { sessionId, annotationId: selected.id };
    if (selected.resolved) {
      await unresolveAnnotation.mutateAsync(params);
    } else {
      await resolveAnnotation.mutateAsync(params);
    }

    queryClient.invalidateQueries(
      annotationQueryIds.useGetAllAnnotations(sessionId)
    );
  };

  const annotationsView = (
    <>
      <AnnotationTextInput onSubmit={handleAnnotation} />
      <div className="flex flex-row justify-between items-center mb-2">
        {filters.map((filter, index) => {
          const filterSelected = selectedFilterIndex === index;

          const handleClick = () => setSelectedFilterIndex(index);

          return (
            <div
              key={filter}
              className={classNames(
                "px-[4px] border border-black rounded-lg cursor-pointer",
                {
                  "bg-black/20": filterSelected,
                }
              )}
              onClick={handleClick}
            >
              {filter}
            </div>
          );
        })}
      </div>
      {filteredAnnotations.map((annotation, index) => (
        <AnnotationItem
          key={`annotation-${index}`}
          {...annotation}
          onClick={handleSelect}
        />
      ))}
    </>
  );

  const repliesView = (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="p-2" onClick={handleDeselect}>
          <ArrowLeft />
        </div>
        <h4>Annotation Replies</h4>
        <div className="p-2" onClick={handleToggleResolved}>
          {selected?.resolved ? <XCircle /> : <CheckCircle />}
        </div>
      </div>
      <AnnotationItem {...selected} />
      <div className="ml-2">
        {selected?.replies.map((reply, index) => {
          const user = participants.find(
            (participant) => participant.id === reply.userId
          );

          return (
            <ReplyItem
              key={`annotation-reply-${index}`}
              userName={user?.name}
              {...reply}
            />
          );
        })}
      </div>
      <AnnotationTextInput label="Reply" onSubmit={handleReply} />
    </>
  );

  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <>
      <div id="" className="ml-2 mb-2 flex flex-row-reverse">
        <DrawerToggle
          direction={drawerOpen ? "out" : "in"}
          onClick={() => setDrawerOpen(!drawerOpen)}
        />
      </div>

      <div className="h-full overflow-y-auto overflow-x-hidden w-[250px]">
        <div
          id="Annotation"
          className={classNames(
            "ml-2 backdrop-blur-sm bg-white/50 drop-shadow-lg border border-white p-3 rounded transition-transform",
            {
              "translate-x-[22rem]": !drawerOpen,
              "translate-x-0": drawerOpen,
            }
          )}
        >
          {!selected && annotationsView}
          {selected && repliesView}
        </div>
      </div>
    </>
  );
};

export default Annotations;
