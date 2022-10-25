import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "./sessions-api.js";

const baseQueryId = "sessions";
const queryIds = {
  useGetAllSessions: () => [baseQueryId, "getAll"],
  useGetSession: (sessionId) => [baseQueryId, "get", sessionId],
};

export const useCreateSession = () =>
  useMutation((productId) => api.createSession({ productId }));

export const useGetAllSessions = () =>
  useQuery(queryIds.useGetAllSessions(), () => api.getAllSessions());

export const useGetSession = (sessionId) =>
  useQuery(queryIds.useGetSession(sessionId), () =>
    api.getSession({ sessionId })
  );
