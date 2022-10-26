const url = import.meta.env.VITE_REST_URL;

export const createSession = async (body) => {
  const response = await fetch(`${url}/v1/sessions`, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.json();
};

export const getAllSessions = async () => {
  const response = await fetch(`${url}/v1/sessions`, { method: "GET" });
  return response.json();
};

export const getSession = async ({ sessionId }) => {
  const response = await fetch(`${url}/v1/sessions/${sessionId}`, {
    method: "GET",
  });
  return response.json();
};
