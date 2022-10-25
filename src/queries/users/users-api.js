const url = import.meta.env.VITE_REST_URL;

export const getUsersInSession = async ({ sessionId }) => {
  const response = await fetch(`${url}/v1/sessions/${sessionId}/users`, {
    method: "GET",
  });
  return response.json();
};
