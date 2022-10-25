import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  queryIds as annotationQueryIds,
  useCreateAnnotation,
} from "../queries/annotations/annotations-query";

const AddAnnotation = ({ userId }) => {
  const { roomId: sessionId } = useParams();
  const queryClient = useQueryClient();
  const createAnnotation = useCreateAnnotation();
  const isDisabled = !userId;

  const handleCreateAnnotation = async (event) => {
    event.preventDefault();

    const message = event.target.annotation.value;
    const button = event.target.submitter;
    const input = event.target.annotation;

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

  return (
    <form onSubmit={handleCreateAnnotation}>
      <label
        htmlFor="annotation-input"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Message
      </label>
      <input
        id="annotation-input"
        type="text"
        name="annotation"
        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        disabled={isDisabled}
      />
      <button
        type="submit"
        className="mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        name="submitter"
        disabled={isDisabled}
      >
        Add Annotation
      </button>
    </form>
  );
};

export default AddAnnotation;
