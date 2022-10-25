const url = import.meta.env.VITE_SOCKET_URL;

export const createSession = async (body) => {
  const response = await fetch(`http://${url}/v1/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.json();
};

export const getAllSessions = async () => {
  const response = await fetch(`http://${url}/v1/sessions`, { method: "GET" });
  return response.json();
};

export const getSession = async ({ sessionId }) => {
  const response = await fetch(`http://${url}/v1/sessions/${sessionId}`, {
    method: "GET",
  });
  return response.json();
};
