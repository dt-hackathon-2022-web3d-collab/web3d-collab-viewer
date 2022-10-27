import { ArrowLeft, CheckCircle, XCircle } from "phosphor-react";
import {
  queryIds as annotationQueryIds,
  useCreateAnnotation,
  useResolveAnnotation,
  useUnresolveAnnotation,
} from "../../queries/annotations/annotations-query";

import { AnnotationItem } from "./AnnotationItem";
import { AnnotationTextInput } from "./AnnotationTextInput";
import { DrawerToggle } from "../DrawerToggle";
import { ReplyItem } from "./ReplyItem";
import classNames from "classnames";
import { useCreateReply } from "../../queries/replies/replies-query";
import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const filters = ["All", "Unresolved", "Resolved"];

const Annotations = ({
  userId,
  participants,
  annotations = [],
  selectedVariant,
  isAnotating,
  annotationId,
}) => {
  const { roomId: sessionId } = useParams();
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const queryClient = useQueryClient();

  console.log(annotations);
  const singleAnnotation =
    annotationId !== undefined
      ? annotations.filter((annotation) => annotation.id === annotationId)
      : annotations;

  // monkey patching singleAnnotations into this one. :O
  const filteredAnnotations = singleAnnotation.filter((annotation) => {
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

  const AnnotationsView = ({ annotationId }) => {
    // quick toggle for the filters.  unsure about how these will work with current Ux
    const showFilters = false;
    return (
      <div className="bg-yellow border">
        {showFilters && (
          <>
            <AnnotationTextInput label="Annotate" onSubmit={handleAnnotation} />
            <div className="flex flex-row justify-between items-center mb-2">
              {filters.map((filter, index) => {
                const filterSelected = selectedFilterIndex === index;

                const handleClick = () => setSelectedFilterIndex(index);

                return (
                  <div
                    key={filter}
                    className={classNames(
                      "px-[4px] border-[1px] border-black rounded-lg",
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
          </>
        )}
        {filteredAnnotations.map((annotation, index) => (
          <AnnotationItem
            key={`annotation-${index}`}
            {...annotation}
            onClick={handleSelect}
          />
        ))}
      </div>
    );
  };

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

  const [isOpen, setOpen] = useState(isAnotating || annotationId !== undefined);

  return (
    <>
      <div id="" className="ml-2 mb-2 flex flex-row-reverse">
        <DrawerToggle
          direction={isOpen ? "out" : "in"}
          onClick={() => setOpen(!isOpen)}
        />
      </div>

      <div
        className={classNames(
          "h-full overflow-y-auto overflow-x-hidden transition-transform w-[250px]",
          {
            "translate-x-[22rem]": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        <div
          id="Annotation"
          className={classNames(
            "ml-2 backdrop-blur-sm bg-white/50 drop-shadow-lg border border-white p-3 rounded transition-transform",
            {
              "translate-x-[22rem]": !isOpen,
              "translate-x-0": isOpen,
            }
          )}
        >
          {isAnotating && (
            <AnnotationTextInput label="Annotate" onSubmit={handleAnnotation} />
          )}

          {annotationId !== undefined && (
            <>
              {!selected && <AnnotationsView annotationId={annotationId} />}
              {selected && repliesView}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Annotations;
