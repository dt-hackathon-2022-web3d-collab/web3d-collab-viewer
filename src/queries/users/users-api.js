const url = import.meta.env.VITE_SOCKET_URL;

export const getUsersInSession = async ({ sessionId }) => {
  const response = await fetch(`http://${url}/v1/sessions/${sessionId}/users`, {
    method: "GET",
  });
  return response.json();
};
