import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  PaperPlaneRight,
  XCircle,
} from "phosphor-react";
import { useState } from "react";
import { useParams } from "react-router";
import {
  queryIds as annotationQueryIds,
  useCreateAnnotation,
  useGetAllAnnotations,
} from "../../queries/annotations/annotations-query";
import { useCreateReply } from "../../queries/replies/replies-query";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationTextInput } from "./AnnotationTextInput";
import { ReplyItem } from "./ReplyItem";

const Annotations = ({ userId, participants }) => {
  const { roomId: sessionId } = useParams();
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();
  const annotationsQuery = useGetAllAnnotations(sessionId);
  const annotations = annotationsQuery.data?.rows ?? [];
  const createAnnotation = useCreateAnnotation();
  const createReply = useCreateReply();

  const handleSelect = (_event, annotation) => {
    setSelected(annotation);
  };

  const handleDeselect = () => {
    setSelected(null);
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
        <div className="p-2">
          {selected?.resolved ? <XCircle /> : <CheckCircle />}
        </div>
      </div>
      <AnnotationItem {...selected} />
      <div className="ml-2">
        {selected?.replies.map((reply, index) => {
          console.log(participants[0], reply);
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
