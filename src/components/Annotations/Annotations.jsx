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

const Annotations = ({ userId, participants }) => {
  const { roomId: sessionId } = useParams();
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const annotationsQuery = useGetAllAnnotations(sessionId);
  const annotations = annotationsQuery.data?.rows ?? [];
  const createAnnotation = useCreateAnnotation();
  const createReply = useCreateReply();
  const resolveAnnotation = useResolveAnnotation();
  const unresolveAnnotation = useUnresolveAnnotation();
  const selected = annotations?.find(
    (annotation) => annotation.id === selectedId
  );

  const handleSelect = (_event, annotation) => {
    setSelectedId(annotation.id);
  };

  const handleDeselect = () => {
    setSelectedId(null);
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
    const body = { message, userId, position: 0 };
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
      <h4>Annotations</h4>
      {annotations.map((annotation, index) => (
        <AnnotationItem
          key={`annotation-${index}`}
          {...annotation}
          onClick={handleSelect}
        />
      ))}
      <AnnotationTextInput label="Annotate" onSubmit={handleAnnotation} />
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

  return (
    <div className="bg-white h-full overflow-y-auto overflow-x-hidden">
      {!selected && annotationsView}
      {selected && repliesView}
    </div>
  );
};

export default Annotations;
