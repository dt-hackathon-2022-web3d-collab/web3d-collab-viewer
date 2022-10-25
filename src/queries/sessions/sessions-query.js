import { useMutation } from "@tanstack/react-query";
import * as api from "./sessions-api.js";

const baseQueryId = "sessions";
const queryIds = {
  useGetAllSessions: () => [baseQueryId, "getAll"],
  useGetSession: (sessionId) => [baseQueryId, "get", sessionId],
};

export const useCreateSession = () =>
  useMutation((productId) => api.createSession({ productId }));
