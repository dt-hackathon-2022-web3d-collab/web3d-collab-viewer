import { useQuery } from "@tanstack/react-query";
import { getUsersInSession } from "./users-api";

const baseQueryId = "users";
const queryIds = {
  useGetUsersInSession: (sessionId) => [baseQueryId, sessionId],
};

export const useGetUsersInSession = (sessionId) =>
  useQuery(queryIds.useGetUsersInSession(sessionId), () =>
    getUsersInSession({ sessionId })
  );
