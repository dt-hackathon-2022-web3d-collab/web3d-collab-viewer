const url = import.meta.env.VITE_REST_URL;

export const getUsersInSession = async ({ sessionId }) => {
  const response = await fetch(
    `${url}/v1/sessions/${sessionId}/users?count=1000`,
    {
      method: "GET",
    }
  );
  return response.json();
};
