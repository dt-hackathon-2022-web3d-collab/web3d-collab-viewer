import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAnnotation,
  getAllAnnotations,
  resolveAnnotation,
  unresolveAnnotation,
} from "./annotations-api";

const baseQueryId = "annotations";
export const queryIds = {
  useGetAllAnnotations: (sessionId) => [baseQueryId, sessionId],
  useGetAnnotation: (sessionId, annotationId) => [
    baseQueryId,
    sessionId,
    annotationId,
  ],
};

export const useGetAllAnnotations = (sessionId) =>
  useQuery(queryIds.useGetAllAnnotations(sessionId), () =>
    getAllAnnotations({ sessionId })
  );

export const useGetAnnotation = (sessionId, annotationId) =>
  useQuery(queryIds.useGetAnnotation(sessionId, annotationId), () =>
    getAllAnnotations({ sessionId, annotationId })
  );

export const useCreateAnnotation = () => useMutation(createAnnotation);

export const useResolveAnnotation = () => useMutation(resolveAnnotation);

export const useUnresolveAnnotation = () => useMutation(unresolveAnnotation);
